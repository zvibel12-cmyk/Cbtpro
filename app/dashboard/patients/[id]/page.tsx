export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ArrowRight, User, Phone, Mail, FileText, Calendar, Clock, MapPin, Brain } from 'lucide-react'
import PermissionsPanel from './PermissionsPanel' // <--- הוספנו את הייבוא הזה

export default async function PatientFile({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { id } = params

  // 1. שליפת פרופיל מטופל
  const { data: patient } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  // 2. שליפת פגישות עתידיות
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  // 3. שליפת הגדרות יומן (חדש!)
  let { data: settings } = await supabase
    .from('patient_journal_settings')
    .select('*')
    .eq('patient_id', id)
    .single()

  // אם אין הגדרות, נציג אובייקט ריק (הפאנל ידע להתמודד)
  if (!settings) settings = {}

  // 4. שליפת יומנים של המטופל (רק אם יש אישור שיתוף!)
  let journals = []
  if (settings?.share_with_therapist) {
     const { data } = await supabase
       .from('cbt_journals')
       .select('*')
       .eq('patient_id', id)
       .order('created_at', { ascending: false })
     journals = data || []
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* כותרת וחזרה */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patients" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition">
          <ArrowRight size={20} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{patient?.full_name}</h1>
          <p className="text-slate-500">תיק מטופל דיגיטלי</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* עמודה ימנית: פרטים וניהול הרשאות */}
        <div className="space-y-6">
           {/* כרטיס פרטים אישיים */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                 {patient?.full_name?.[0]}
               </div>
               <div>
                 <div className="font-bold text-lg">{patient?.full_name}</div>
                 <div className="text-slate-400 text-sm">מטופל פעיל</div>
               </div>
             </div>
             
             <div className="space-y-4">
               <div className="flex items-center gap-3 text-slate-600">
                 <Mail size={18} /> {patient?.email}
               </div>
               <div className="flex items-center gap-3 text-slate-600">
                 <Phone size={18} /> {patient?.phone || 'לא הוזן טלפון'}
               </div>
             </div>
           </div>

           {/* --- כאן הטמענו את הפאנל החדש --- */}
           <PermissionsPanel patientId={id} settings={settings} />
           
        </div>

        {/* עמודה מרכזית ושמאלית: יומנים ופגישות */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* אזור היומנים */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Brain className="text-rose-500" /> יומני CBT ודיווחים
              </h3>
              
              {!settings?.share_with_therapist ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                  <p className="font-bold">אין גישה ליומנים</p>
                  <p className="text-sm">המטופל טרם אישר שיתוף של היומנים שלו.</p>
                </div>
              ) : journals.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  המטופל טרם מילא יומנים.
                </div>
              ) : (
                <div className="space-y-4">
                  {journals.map((journal: any) => (
                    <div key={journal.id} className="p-4 border rounded-xl hover:bg-slate-50 transition">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">
                          {journal.journal_type === 1 ? 'יומן רגשות' : journal.journal_type === 2 ? 'יומן עיוותים' : 'יומן מלא'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(journal.created_at).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{journal.situation}</p>
                      {/* כאן אפשר להוסיף כפתור לצפייה מלאה ביומן */}
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* פגישות קרובות */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Calendar className="text-teal-600" /> פגישות קרובות
             </h3>
             {appointments?.length === 0 ? (
               <p className="text-slate-400 text-sm">אין פגישות עתידיות ביומן.</p>
             ) : (
               <div className="space-y-3">
                 {appointments?.map((apt: any) => (
                   <div key={apt.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="bg-white p-2 rounded-lg border border-slate-200 text-center min-w-[50px]">
                       <div className="text-xs text-slate-400">{new Date(apt.start_time).toLocaleDateString('he-IL', {weekday: 'short'})}</div>
                       <div className="font-bold text-slate-800">{new Date(apt.start_time).getDate()}</div>
                     </div>
                     <div>
                       <div className="font-bold text-slate-800 text-sm">פגישה טיפולית</div>
                       <div className="text-xs text-slate-500 flex items-center gap-2">
                         <Clock size={12} /> {new Date(apt.start_time).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>

        </div>
      </div>
    </div>
  )
}
