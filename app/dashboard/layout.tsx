import Link from 'next/link';
import { Home, Users, Calendar, UserPlus, MessageCircle, UserCircle, LogOut } from 'lucide-react';
import { signOut } from '../auth/actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Header עליון */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200">C</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-primary-600 to-primary-800">CBT.Pro</span>
         </div>
         <form action={signOut as any}>
            <button className="text-slate-400 hover:text-red-500 transition">
              <LogOut size={20} />
            </button>
         </form>
      </header>

      {/* Main Content */}
      <main className="pb-32 px-4 py-6 max-w-5xl mx-auto">
        {children}
      </main>

      {/* תפריט תחתון - מתוקן ומיושר */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="flex justify-between items-center max-w-5xl mx-auto px-2 py-3">
        
          {/* 1. דף הבית */}
          <Link href="/dashboard" className="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary-600 transition group">
            <Home size={22} className="group-hover:-translate-y-0.5 transition" />
            <span className="text-[10px] font-medium text-center leading-tight">דף הבית</span>
          </Link>

          {/* 2. מטופלים (הרשימה) */}
          <Link href="/dashboard/patients" className="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary-600 transition group">
            <Users size={22} className="group-hover:-translate-y-0.5 transition" />
            <span className="text-[10px] font-medium text-center leading-tight">מטופלים</span>
          </Link>

          {/* 3. יומן */}
          <Link href="/dashboard/schedule" className="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary-600 transition group">
             <Calendar size={22} className="group-hover:-translate-y-0.5 transition" />
             <span className="text-[10px] font-medium text-center leading-tight">יומן</span>
          </Link>

          {/* 4. ניהול מטופלים (הוספה/עריכה) */}
          <Link href="/dashboard/patients/new" className="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary-600 transition group">
            <UserPlus size={22} className="group-hover:-translate-y-0.5 transition" />
            <span className="text-[10px] font-medium text-center leading-tight">ניהול מטופלים</span>
          </Link>

          {/* 5. פורום מקצועי */}
          <Link href="/dashboard/forum" className="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary-600 transition group">
            <MessageCircle size={22} className="group-hover:-translate-y-0.5 transition" />
            <span className="text-[10px] font-medium text-center leading-tight">פורום מקצועי</span>
          </Link>

          {/* 6. איזור אישי */}
          <Link href="/dashboard/profile" className="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary-600 transition group">
            <UserCircle size={22} className="group-hover:-translate-y-0.5 transition" />
            <span className="text-[10px] font-medium text-center leading-tight">איזור אישי</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}
