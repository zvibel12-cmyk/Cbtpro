import { createClient } from '@/lib/supabase-server'
import { Users, Calendar, Clock, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userName = user?.user_metadata?.full_name || 'מטפל'

  // 1. ספירת מטופלים כוללת
  const { count: totalPatients } = await supabase
    .from('patients_mapping')
    .select('*', { count: 'exact', head: true })
    .eq('therapist_id', user?.id)

  // 2. חישוב פגישות להיום (בין 00:00 ל-23:59 של היום הנוכחי)
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

  const { data: todayAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('therapist_id', user?.id)
    .gte('start_time', todayStart.toISOString())
    .lte('start_time', todayEnd.toISOString())

  const todayCount = todayAppointments?.length || 0;

  return (
    <div className="space-y-6">
      
      {/* ברכה אישית */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>
        <h1 className="text-2xl font-bold text-slate-800">בוקר טוב, {userName}</h1>
        <p className="text-slate-500 text-sm mt-1">מוכן ליום עבודה פורה בקליניקה?</p>
      </div>

      {/* כרטיסי המידע (מספרים גדולים) */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* כרטיס מטופלים */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
           <div className="absolute top-4 left-4 opacity-20"><Users size={40} /></div>
           <div className="text-4xl font-bold mt-2">{totalPatients || 0}</div>
           <div className="text-sm font-medium opacity-90 mt-1">מטופלים רשומים</div>
        </div>

        {/* כרטיס פגישות היום */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-4 left-4 text-orange-500 bg-orange-50 p-2 rounded-full"><Calendar size={20} /></div>
           <div className="text-4xl font-bold text-slate-800 mt-2">{todayCount}</div>
           <div className="text-sm font-medium text-slate-500 mt-1">פגישות היום</div>
        </div>

      </div>

      {/* אזור הפעולות המהירות */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">פעולות מהירות</h3>
        <div className="grid grid-cols-3 gap-3">
           <Link href="/dashboard/schedule" className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm hover:border-primary-300 transition">
              <div className="w-10 h-10 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2"><CheckCircle size={20} /></div>
              <span className="text-xs font-bold text-slate-600">סכם פגישה</span>
           </Link>
           <Link href="/dashboard/patients" className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm hover:border-primary-300 transition">
              <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2"><Users size={20} /></div>
              <span className="text-xs font-bold text-slate-600">תיק חדש</span>
           </Link>
           <Link href="/dashboard/schedule" className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm hover:border-primary-300 transition">
              <div className="w-10 h-10 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2"><Clock size={20} /></div>
              <span className="text-xs font-bold text-slate-600">זמינות</span>
           </Link>
        </div>
      </div>
    </div>
  )
}
