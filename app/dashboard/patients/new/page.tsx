'use client'

import { createPatient } from '../actions'
import { useFormStatus } from 'react-dom'
import { UserPlus, ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-lg">
      {pending ? 'יוצר כרטיס...' : <>צור תיק מטופל <Save size={20}/></>}
    </button>
  )
}

export default function NewPatientPage() {
  return (
    <div className="max-w-2xl mx-auto pb-20 p-4 md:p-0">
      <Link href="/dashboard/patients" className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm">
        <ArrowRight size={16}/> חזרה לרשימת המטופלים
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <UserPlus className="text-blue-600"/> פתיחת תיק מטופל חדש
        </h1>

        <form action={createPatient} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">שם מלא *</label>
              <input name="fullName" required className="input-field" placeholder="ישראל ישראלי" />
            </div>
            <div>
              <label className="label">תעודת זהות</label>
              <input name="identityNumber" className="input-field" placeholder="000000000" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">אימייל *</label>
              <input name="email" type="email" required className="input-field" placeholder="email@example.com" />
              <p className="text-xs text-slate-400 mt-1">ישמש את המטופל להתחברות</p>
            </div>
            <div>
              <label className="label">טלפון נייד</label>
              <input name="phone" type="tel" className="input-field" placeholder="050-0000000" />
            </div>
          </div>

          <div>
             <label className="label">כתובת מגורים</label>
             <input name="address" className="input-field" placeholder="רחוב, עיר..." />
          </div>

          <SubmitBtn />
        </form>
      </div>

      <style jsx>{`
        .label { display: block; font-weight: bold; color: #334155; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .input-field { width: 100%; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; transition: all; font-size: 1rem; }
        .input-field:focus { border-color: #3b82f6; background: white; }
      `}</style>
    </div>
  )
}
