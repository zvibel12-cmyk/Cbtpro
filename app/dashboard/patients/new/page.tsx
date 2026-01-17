'use client'
import { createPatient } from '../../actions'
import { UserPlus, Mail, Phone, MapPin, User, FileText, Upload, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg shadow-primary-200 mt-8 disabled:opacity-50">
      {pending ? 'פותח תיק ומעבד נתונים...' : 'שמור ופתח תיק מטופל'}
    </button>
  )
}

export default function NewPatientPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* כותרת וחזרה */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patients" className="p-2 bg-white rounded-full border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-200 transition">
          <ArrowRight size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">פתיחת תיק מטופל</h1>
          <p className="text-slate-500 text-sm">מלא את כל הפרטים ליצירת רשומה רפואית חדשה</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <form action={createPatient as any} className="space-y-8">
          
          {/* חלק 1: פרטים אישיים */}
          <section>
            <h3 className="text-lg font-bold text-primary-700 mb-4 flex items-center gap-2">
              <User size={20} /> פרטים אישיים
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">שם מלא *</label>
                <input name="fullName" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="ישראל ישראלי" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">תעודת זהות</label>
                <input name="idNumber" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="000000000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">טלפון *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={16} />
                  <input name="phone" required className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="050-0000000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">אימייל *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
                  <input name="email" type="email" required className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="email@example.com" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">כתובת מלאה</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-slate-400" size={16} />
                  <input name="address" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="רחוב, מספר, עיר" />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* חלק 2: פרטי הפניה ורקע */}
          <section>
            <h3 className="text-lg font-bold text-primary-700 mb-4 flex items-center gap-2">
              <FileText size={20} /> הפניה ורקע
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">גורם מפנה</label>
                <input name="referringParty" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="רופא משפחה / פסיכיאטר / עצמאי" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">סיבת הפניה</label>
                <input name="referralReason" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="חרדה / דיכאון / משבר..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">רקע כללי ורפואי</label>
                <textarea name="background" rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="רקע משפחתי, רפואי, טיפולים קודמים..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">סיכום אינטייק (ראשוני)</label>
                <textarea name="intakeSummary" rows={5} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none" placeholder="רשמים מפגישת ההיכרות, אבחנה משוערת, מטרות טיפול..." />
              </div>
            </div>
          </section>

          {/* חלק 3: קבצים (UI בלבד כרגע) */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
            <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Upload size={16} /> מסמכים וקבצים
            </h3>
            <p className="text-xs text-slate-500 mb-4">ניתן להעלות הפניות, בדיקות או שאלונים סרוקים.</p>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-slate-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="text-sm text-slate-500"><span className="font-semibold">לחץ להעלאה</span> או גרור קובץ לכאן</p>
                    </div>
                    <input type="file" className="hidden" disabled /> 
                </label>
            </div>
            <p className="text-[10px] text-red-400 mt-2 text-center">* העלאת קבצים תתאפשר לאחר שמירת התיק</p>
          </section>

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
