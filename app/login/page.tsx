'use client'
import Link from 'next/link'
import { login } from '../auth/actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50" disabled={pending}>
      {pending ? 'מתחבר...' : 'כניסה למערכת'}
    </button>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">כניסה למערכת</h1>
        <form action={login as any} className="space-y-4">
          <input name="email" type="email" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="אימייל" />
          <input name="password" type="password" required className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="סיסמה" />
          <SubmitButton />
        </form>
         <div className="text-center mt-4 text-sm text-slate-500">
            אין לך חשבון? <Link href="/register" className="text-primary-600 hover:underline">הרשמה</Link>
        </div>
      </div>
    </div>
  )
}
