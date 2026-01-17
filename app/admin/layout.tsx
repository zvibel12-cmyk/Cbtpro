import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, LayoutDashboard, MessageSquare, LogOut, ShieldAlert } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans relative" dir="rtl">
      
      {/* כותרת עליונה קטנה */}
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-slate-900" />
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">CBT<span className="text-red-600">.ADMIN</span></h1>
        </div>
        <div className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
          מצב עריכה מלאה
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="p-6 pb-32 max-w-7xl mx-auto">
        {children}
      </main>

      {/* סרגל כפתורים תחתון (קבוע) */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-50 border-t border-slate-800">
        <nav className="flex justify-center items-center gap-2 md:gap-8 p-3 safe-area-bottom">

          <Link href="/admin" className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-slate-800 hover:text-blue-400 transition w-24 text-center group">
            <LayoutDashboard size={24} className="group-hover:-translate-y-1 transition duration-300" />
            <span className="text-[10px] font-bold opacity-70 group-hover:opacity-100">מבט על</span>
          </Link>

          <Link href="/admin/users" className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-slate-800 hover:text-blue-400 transition w-24 text-center group">
            <Users size={24} className="group-hover:-translate-y-1 transition duration-300" />
            <span className="text-[10px] font-bold opacity-70 group-hover:opacity-100">משתמשים</span>
          </Link>

          <Link href="/admin/forum" className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-slate-800 hover:text-blue-400 transition w-24 text-center group">
            <MessageSquare size={24} className="group-hover:-translate-y-1 transition duration-300" />
            <span className="text-[10px] font-bold opacity-70 group-hover:opacity-100">פורום</span>
          </Link>

          <div className="w-px h-10 bg-slate-700 mx-2 opacity-50"></div>

          <Link href="/dashboard" className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-red-900/30 hover:text-red-400 transition w-24 text-center text-slate-400 group">
            <LogOut size={24} className="group-hover:-translate-y-1 transition duration-300" />
            <span className="text-[10px] font-bold opacity-70 group-hover:opacity-100">יציאה</span>
          </Link>

        </nav>
      </div>
    </div>
  )
}
