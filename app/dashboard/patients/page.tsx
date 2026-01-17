import { createClient } from '@/lib/supabase-server'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default async function PatientsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: patients } = await supabase
    .from('patients_mapping')
    .select('patient_id, intake_summary, status, profiles:patient_id(full_name, email)')
    .eq('therapist_id', user?.id)

  return (
    <div className="space-y-6">
      
      {/* כותרת עם כפתור הוספה מהיר */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">תיקי מטופלים</h1>
          <p className="text-slate-500 text-sm">סה״כ {patients?.length || 0} מטופלים פעילים</p>
        </div>
        <Link href="/dashboard/patients/new" className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200">
          <Plus size={24} />
        </Link>
      </div>

      {/* שורת חיפוש (ויזואלית כרגע) */}
      <div className="relative">
        <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
        <input type="text" placeholder="חיפוש לפי שם או ת.ז..." className="w-full p-3 pr-12 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-400 shadow-sm" />
      </div>

      {/* רשימת הכרטיסים */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients?.map((record: any) => (
          <Link href={`/dashboard/patients/${record.patient_id}`} key={record.patient_id} className="block bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition group relative overflow-hidden">
            
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg shadow-sm">
                {record.profiles?.full_name?.[0] || 'P'}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition">{record.profiles?.full_name}</h3>
                <p className="text-xs text-slate-400">{record.profiles?.email}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl mb-3">
               <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                 {record.intake_summary || 'אין מידע בסיכום אינטייק...'}
               </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100">תיק פעיל</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-primary-600 transition flex items-center gap-1">
                לתיק המלא &larr;
              </span>
            </div>
          </Link>
        ))}

        {(!patients || patients.length === 0) && (
           <div className="col-span-full py-10 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
             <p>עדיין אין מטופלים במערכת.</p>
             <Link href="/dashboard/patients/new" className="text-primary-600 font-bold hover:underline mt-2 inline-block">הוסף את המטופל הראשון</Link>
           </div>
        )}
      </div>
    </div>
  )
}
