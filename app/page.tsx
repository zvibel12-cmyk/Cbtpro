import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Heart, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-primary-50 to-white">
      <header className="w-full max-w-6xl p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-700">CBT.Pro</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-primary-700 font-medium hover:bg-primary-50 rounded-lg transition">כניסה</Link>
          <Link href="/register" className="px-5 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition">הצטרפות</Link>
        </div>
      </header>
      <section className="flex flex-col items-center text-center mt-16 max-w-4xl px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          מערכת CBT <span className="text-primary-600">מקצועית.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl">
          ניהול קליניקה, יומני מחשבות ומעקב התקדמות במקום אחד.
        </p>
        <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-700 transition transform hover:-translate-y-1">
          התחילו עכשיו <ArrowLeft size={20} />
        </Link>
      </section>
    </main>
  );
}
