import { createClient } from '@/lib/supabase-server'
import PatientTabs from '@/components/PatientTabs'
import { Phone, MapPin, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default async function PatientFilePage({ 
  params, 
  searchParams 
}: { 
  params: { id: string },
  searchParams: { new?: string } 
}) {
  const supabase = createClient()
  const patientId = params.id
  const isNew = searchParams.new === 'true'

  // שליפות בטוחות (Safe Fetching)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', patientId).single()
  
  // אם אין פרופיל, אי אפשר להמשיך
  if (!profile) {
    return (
      <div className="p-10 text-center">
        <div className="bg-yellow-50 text-yellow-800 p-6 rounded-2xl border border-yellow-200 inline-block">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <h2 className="text-xl font-bold">הפרופיל בטעינה...</h2>
          <p>הנתונים מתעדכנים, נסה לרענן את העמוד.</p>
        </div>
      </div>
    )
  }

  // שליפת שאר הנתונים עם ערכי ברירת מחדל במקרה של כישלון
  const { data: fileData } = await supabase.from('patients_mapping').select('*').eq('patient_id', patientId).single()
  const file = fileData || { referring_party: '', referral_reason: '', intake_summary: '' } // מניעת קריסה אם אין תיק

  const { data: appointments } = await supabase.from('appointments').select('*').eq('patient_id', patientId).order('start_time', { ascending: false })
  const { data: journals } = await supabase.from('cbt_journals').select('*').eq('patient_id', patientId).order('entry_date', { ascending: false })
  
  // ניסיון שליפת סיכומים (עטוף כדי לא להפיל את הדף אם הטבלה חסרה)
  let notes = []
  try {
    const { data: notesData } = await supabase.from('session_notes').select('*').eq('patient_id', patientId).order('session_date', { ascending: false })
    if (notesData) notes = notesData
  } catch (e) {
    console.error('Error fetching notes, table might be missing')
  }

  return (
    <div className="space-y-8 pb-20">
      {isNew && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3 animate-pulse">
          <CheckCircle className="text-green-600" /> <span className="font-bold">התיק נוצר בהצלחה!</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-4xl font-bold shadow-inner">
          {profile.full_name?.[0]}
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">{profile.full_name}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
             {profile.phone && <span className="flex items-center gap-1"><Phone size={14}/> {profile.phone}</span>}
             {profile.email && <span className="flex items-center gap-1"><Mail size={14}/> {profile.email}</span>}
             {profile.address && <span className="flex items-center gap-1"><MapPin size={14}/> {profile.address}</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
             <div>
               <span className="font-bold text-slate-700 block">סיבת פניה:</span>
               <span className="text-slate-600">{file.referral_reason || 'לא צוין'}</span>
             </div>
             <div>
               <span className="font-bold text-slate-700 block">גורם מפנה:</span>
               <span className="text-slate-600">{file.referring_party || 'עצמאי'}</span>
             </div>
          </div>
        </div>
      </div>

      <PatientTabs 
        patientId={patientId} 
        profile={profile}
        file={file}
        appointments={appointments || []} 
        journals={journals || []} 
        notes={notes}
      />
    </div>
  )
}
