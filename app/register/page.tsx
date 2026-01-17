'use client'
import Link from 'next/link'
import { signup } from '../auth/actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50" disabled={pending}>
      {pending ? 'מעבד נתונים...' : 'הרשמה'}
    </button>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">פתיחת קליניקה</h1>
        <form action={signup as any} className="space-y-4">
          <input name="fullName" type="text" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="שם מלא" />
          <input name="email" type="email" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="אימייל" />
          <input name="password" type="password" required minLength={6} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="סיסמה" />
          <SubmitButton />
        </form>
        <div className="text-center mt-4 text-sm text-slate-500">
            כבר יש לך חשבון? <Link href="/login" className="text-primary-600 hover:underline">כניסה</Link>
        </div>
      </div>
    </div>
  )
}
