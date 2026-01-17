'use client'

// תיקון קריטי: נתיב אבסולוטי
import { saveSessionNote } from '@/app/dashboard/patients/actions'
import { useFormStatus } from 'react-dom'
import { ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return <button disabled={pending} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">{pending ? 'שומר...' : 'שמור סיכום'}</button>
}

export default function NewNotePage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0 pb-20">
      <Link href={`/dashboard/patients/${params.id}`} className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm"><ArrowRight size={16}/> חזרה</Link>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-6">תיעוד מפגש חדש</h1>
        <form action={saveSessionNote} className="space-y-6">
          <input type="hidden" name="patientId" value={params.id} />
          <div><label className="block font-bold mb-2">סיכום פגישה</label><textarea name="content" required rows={6} className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="תוכן הפגישה..."></textarea></div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><label className="block font-bold mb-2 text-yellow-800">משימות לבית (גלוי למטופל)</label><textarea name="homework" rows={3} className="w-full p-4 bg-white border rounded-xl"></textarea></div>
          <SubmitBtn />
        </form>
      </div>
    </div>
  )
}
