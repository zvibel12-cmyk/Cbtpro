import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, LayoutDashboard, MessageSquare, DollarSign, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // הגנה: בדיקה שאתה אכן אדמין
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard') // בעיטה החוצה למשתמשים רגילים
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans" dir="rtl">
      
      {/* סרגל צד שחור - אדמין */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white tracking-tighter">CBT<span className="text-red-500">.ADMIN</span></h1>
          <p className="text-xs text-slate-500 mt-1">אזור שליטה מלאה</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 hover:text-white transition">
            <LayoutDashboard size={20} /> מבט על
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 hover:text-white transition">
            <Users size={20} /> ניהול משתמשים
          </Link>
          <Link href="/admin/forum" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 hover:text-white transition">
            <MessageSquare size={20} /> ניהול תוכן
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
             <LogOut size={16} /> יציאה לאתר הרגיל
           </Link>
        </div>
      </aside>

      {/* תוכן */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
