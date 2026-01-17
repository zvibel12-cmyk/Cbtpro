'use client'
import { useState } from 'react'
import { X, User, FileText, Save } from 'lucide-react'
import { updatePatient } from '@/app/dashboard/actions'

export default function EditPatientModal({ isOpen, onClose, profile, file }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">עריכת פרטי מטופל</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form action={async (formData) => {
            setIsSubmitting(true)
            await updatePatient(formData)
            setIsSubmitting(false)
            onClose()
        }} className="p-6 space-y-6 overflow-y-auto">
          <input type="hidden" name="patientId" value={profile.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="text-xs font-bold text-slate-500 mb-1">שם מלא</label>
               <input name="fullName" defaultValue={profile.full_name} className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>
            <div>
               <label className="text-xs font-bold text-slate-500 mb-1">טלפון</label>
               <input name="phone" defaultValue={profile.phone} className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>
            <div>
               <label className="text-xs font-bold text-slate-500 mb-1">אימייל</label>
               <input name="email" defaultValue={profile.email} className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>
            <div>
               <label className="text-xs font-bold text-slate-500 mb-1">כתובת</label>
               <input name="address" defaultValue={profile.address} className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>
          </div>

          <hr className="border-slate-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="text-xs font-bold text-slate-500 mb-1">גורם מפנה</label>
               <input name="referringParty" defaultValue={file.referring_party} className="w-full p-3 bg-slate-50 border rounded-xl" />
             </div>
             <div>
               <label className="text-xs font-bold text-slate-500 mb-1">סיבת הפניה</label>
               <input name="referralReason" defaultValue={file.referral_reason} className="w-full p-3 bg-slate-50 border rounded-xl" />
             </div>
             <div className="md:col-span-2">
               <label className="text-xs font-bold text-slate-500 mb-1">סיכום אינטייק</label>
               <textarea name="intakeSummary" rows={4} defaultValue={file.intake_summary} className="w-full p-3 bg-slate-50 border rounded-xl" />
             </div>
          </div>

          <button disabled={isSubmitting} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save size={18} /> {isSubmitting ? 'שומר...' : 'שמור שינויים'}
          </button>
        </form>
      </div>
    </div>
  )
}
