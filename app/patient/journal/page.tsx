export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Book, Star, Activity, Lock } from 'lucide-react'
import SharingToggle from './SharingToggle' // <--- הוספנו את הייבוא הזה

export default async function JournalLobby() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // שליפת הגדרות
  let { data: settings } = await supabase
    .from('patient_journal_settings')
    .select('*')
    .eq('patient_id', user?.id)
    .single()

  // יצירת הגדרות ברירת מחדל אם אין
  if (!settings && user) {
     await supabase.from('patient_journal_settings').insert({ patient_id: user.id })
     settings = { allow_level_1: true, allow_level_2: false, allow_level_3: false, share_with_therapist: false }
  }

  return (
    <div className="space-y-8">
      
      {/* כותרת ומתג שיתוף */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">היומנים שלי</h1>
          <p className="text-slate-500">בחר את סוג היומן שברצונך למלא היום</p>
        </div>
      </div>

      {/* --- כאן הטמענו את המתג --- */}
      <SharingToggle initialState={settings?.share_with_therapist || false} />

      {/* רשימת היומנים (מושפעת מההגדרות) */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* יומן 1 */}
        <div className={`relative p-6 rounded-2xl border ${settings?.allow_level_1 ? 'bg-white border-teal-200 shadow-sm hover:shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
           <div className="flex justify-between items-start mb-4">
             <div className="bg-teal-100 text-teal-700 p-3 rounded-xl"><Activity size={24}/></div>
             {!settings?.allow_level_1 && <Lock className="text-slate-400" size={20} />}
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">יומן רגשות בסיסי</h3>
           <p className="text-sm text-slate-500 mb-6 min-h-[40px]">זיהוי אירוע, רגש, תגובה וסימפטומים גופניים.</p>
           
           {settings?.allow_level_1 ? (
             <Link href="/patient/journal/1" className="block w-full py-3 bg-teal-600 text-white text-center rounded-xl font-bold hover:bg-teal-700 transition">
               פתח יומן
             </Link>
           ) : (
             <button disabled className="block w-full py-3 bg-slate-200 text-slate-400 text-center rounded-xl font-bold cursor-not-allowed">
               נעול ע"י מטפל
             </button>
           )}
        </div>

        {/* יומן 2 */}
        <div className={`relative p-6 rounded-2xl border ${settings?.allow_level_2 ? 'bg-white border-purple-200 shadow-sm hover:shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
           <div className="flex justify-between items-start mb-4">
             <div className="bg-purple-100 text-purple-700 p-3 rounded-xl"><Book size={24}/></div>
             {!settings?.allow_level_2 && <Lock className="text-slate-400" size={20} />}
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">יומן עיוותי חשיבה</h3>
           <p className="text-sm text-slate-500 mb-6 min-h-[40px]">הוספת זיהוי עיוותי חשיבה ומחשבה חלופית.</p>
           
           {settings?.allow_level_2 ? (
             <Link href="/patient/journal/2" className="block w-full py-3 bg-purple-600 text-white text-center rounded-xl font-bold hover:bg-purple-700 transition">
               פתח יומן
             </Link>
           ) : (
             <button disabled className="block w-full py-3 bg-slate-200 text-slate-400 text-center rounded-xl font-bold cursor-not-allowed">
               נעול ע"י מטפל
             </button>
           )}
        </div>

        {/* יומן 3 */}
        <div className={`relative p-6 rounded-2xl border ${settings?.allow_level_3 ? 'bg-white border-rose-200 shadow-sm hover:shadow-md' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
           <div className="flex justify-between items-start mb-4">
             <div className="bg-rose-100 text-rose-700 p-3 rounded-xl"><Star size={24}/></div>
             {!settings?.allow_level_3 && <Lock className="text-slate-400" size={20} />}
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">יומן CBT מלא</h3>
           <p className="text-sm text-slate-500 mb-6 min-h-[40px]">תהליך מלא: דירוג אמונה לפני ואחרי, מחשבות מתקנות.</p>
           
           {settings?.allow_level_3 ? (
             <Link href="/patient/journal/3" className="block w-full py-3 bg-rose-600 text-white text-center rounded-xl font-bold hover:bg-rose-700 transition">
               פתח יומן
             </Link>
           ) : (
             <button disabled className="block w-full py-3 bg-slate-200 text-slate-400 text-center rounded-xl font-bold cursor-not-allowed">
               נעול ע"י מטפל
             </button>
           )}
        </div>

      </div>
    </div>
  )
}
