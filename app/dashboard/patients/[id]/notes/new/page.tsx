'use client'

import { saveSessionNote } from '../../../../actions' // ייבוא הפעולה שיצרנו
import { useFormStatus } from 'react-dom'
import { ArrowRight, Save, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-lg">
      {pending ? 'שומר סיכום...' : <>שמור סיכום בתיק <Save size={20}/></>}
    </button>
  )
}

export default function NewNotePage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0 pb-20">
      <Link href={`/dashboard/patients/${params.id}`} className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm">
        <ArrowRight size={16}/> חזרה לתיק מטופל
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="text-blue-600"/> תיעוד מפגש חדש
        </h1>

        <form action={saveSessionNote} className="space-y-6">
          <input type="hidden" name="patientId" value={params.id} />
          
          <div>
            <label className="block font-bold text-slate-700 mb-2">סיכום המפגש (פנימי למטפל)</label>
            <textarea 
              name="content" 
              required 
              rows={6} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none text-base"
              placeholder="מה עלה בפגישה? תובנות מרכזיות..."
            ></textarea>
          </div>

          <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
             <label className="block font-bold text-yellow-800 mb-2 flex items-center gap-2">
               <CheckCircle size={18}/> משימות לבית (משוקף למטופל)
             </label>
             <textarea 
               name="homework" 
               rows={3} 
               className="w-full p-4 bg-white border border-yellow-200 rounded-xl focus:border-yellow-500 outline-none resize-none text-base"
               placeholder="תרגילים או מחשבות לבית..."
             ></textarea>
             <p className="text-xs text-yellow-600 mt-2 font-bold">
               * שים לב: תוכן זה יופיע באזור האישי של המטופל.
             </p>
          </div>

          <SubmitBtn />
        </form>
      </div>
    </div>
  )
}
