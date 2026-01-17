export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Plus, Calendar, Clock, ArrowLeft } from 'lucide-react'

export default async function PatientDashboard() {
  const supabase = createClient()
  
  // שליפת הפגישה הקרובה
  const { data: nextAppointment } = await supabase
    .from('appointments')
    .select('*')
    .gt('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(1)
    .single()

  return (
    <div className="space-y-8">
      
      {/* ברכה יומית */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">ברוך הבא למרחב שלך</h1>
          <p className="opacity-90 max-w-lg text-lg">
            "הצעד הראשון לשינוי הוא מודעות. הצעד השני הוא קבלה."
          </p>
          <Link href="/patient/journal/new" className="inline-flex items-center gap-2 bg-white text-teal-700 px-6 py-3 rounded-xl font-bold mt-6 hover:bg-teal-50 transition shadow-md">
            <Plus size={18} /> כתוב ביומן המחשבות
          </Link>
        </div>
        {/* קישוט רקע */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* כרטיס פגישה קרובה */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="text-teal-600" size={20} /> הפגישה הבאה שלך
          </h3>
          
          {nextAppointment ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
               <div className="font-bold text-lg text-slate-800">
                 {new Date(nextAppointment.start_time).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
               </div>
               <div className="text-slate-500 flex items-center gap-2 mt-1">
                 <Clock size={16} /> 
                 {new Date(nextAppointment.start_time).toLocaleTimeString('he-IL', { hour: '2-digit', minute:'2-digit' })}
               </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-4">
              לא נקבעה פגישה עתידית.
            </div>
          )}
        </div>

        {/* משימות / סטטוס */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">התקדמות שבועית</h3>
          <div className="space-y-4">
             <div className="flex justify-between text-sm mb-1 text-slate-600">
               <span>מילוי יומנים</span>
               <span>2/5</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-teal-500 h-2 rounded-full w-[40%]"></div>
             </div>
             <p className="text-xs text-slate-400 mt-2">התמדה בתרגול היא המפתח להצלחה.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
