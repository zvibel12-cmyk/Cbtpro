'use client'

import { createPatient } from '../actions'
import { useFormStatus } from 'react-dom'
import { UserPlus, ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
      {pending ? 'יוצר תיק...' : <>צור תיק מטופל <Save size={20}/></>}
    </button>
  )
}

export default function NewPatientPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0 pb-20">
      <Link href="/dashboard/patients" className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm"><ArrowRight size={16}/> חזרה לרשימת המטופלים</Link>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><UserPlus className="text-blue-600"/> פתיחת תיק חדש</h1>
        <form action={createPatient} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="font-bold block mb-1">שם מלא</label><input name="fullName" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="ישראל ישראלי" /></div>
            <div><label className="font-bold block mb-1">תעודת זהות</label><input name="identityNumber" className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="000000000" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="font-bold block mb-1">אימייל</label><input name="email" type="email" required className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
            <div><label className="font-bold block mb-1">טלפון</label><input name="phone" className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
          </div>
          <div><label className="font-bold block mb-1">כתובת</label><input name="address" className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
          <SubmitBtn />
        </form>
      </div>
    </div>
  )
}
