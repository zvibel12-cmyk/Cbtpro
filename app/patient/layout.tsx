import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, BookOpen, Calendar, LogOut, User } from 'lucide-react'

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row" dir="rtl">
      
      {/* תפריט צד (במובייל יהיה למטה, כרגע פשוט) */}
      <aside className="w-full md:w-64 bg-white border-l border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
             <User />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">אזור אישי</h1>
            <p className="text-xs text-slate-500">שלום, מטופל יקר</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/patient" className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition font-medium">
            <Home size={20} /> ראשי
          </Link>
          <Link href="/patient/journal" className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition font-medium">
            <BookOpen size={20} /> יומן מחשבות
          </Link>
          <Link href="/patient/appointments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition font-medium">
            <Calendar size={20} /> הפגישות שלי
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
           <form action="/auth/signout" method="post">
             <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition w-full p-2">
               <LogOut size={16} /> יציאה מהמערכת
             </button>
           </form>
        </div>
      </aside>

      {/* תוכן ראשי */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  )
}
