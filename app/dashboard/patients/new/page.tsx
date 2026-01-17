'use client'
import { createPatient } from '../actions'
import { useFormStatus } from 'react-dom'
import { ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'

function SubmitBtn() { const { pending } = useFormStatus(); return <button disabled={pending} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">{pending ? 'יוצר...' : 'צור תיק'}</button> }

export default function NewPatientPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0 pb-20">
      <Link href="/dashboard/patients" className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm"><ArrowRight size={16}/> חזרה</Link>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-6">מטופל חדש</h1>
        <form action={createPatient} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4"><div><label className="font-bold">שם מלא</label><input name="fullName" required className="w-full p-3 bg-slate-50 border rounded-xl" /></div><div><label className="font-bold">ת.ז.</label><input name="identityNumber" className="w-full p-3 bg-slate-50 border rounded-xl" /></div></div>
          <div className="grid md:grid-cols-2 gap-4"><div><label className="font-bold">אימייל</label><input name="email" required className="w-full p-3 bg-slate-50 border rounded-xl" /></div><div><label className="font-bold">טלפון</label><input name="phone" className="w-full p-3 bg-slate-50 border rounded-xl" /></div></div>
          <div><label className="font-bold">כתובת</label><input name="address" className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
          <SubmitBtn />
        </form>
      </div>
    </div>
  )
}
