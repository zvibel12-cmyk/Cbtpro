'use client'
import { useState } from 'react'
import { X, RefreshCw, Calendar, Clock } from 'lucide-react'
import { createRecurringAppointments } from '@/app/dashboard/schedule/actions'

export default function RecurringModal({ isOpen, onClose, patientId }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState('clinic')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="text-primary-600" /> קביעת סדרת פגישות
          </h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form action={async (formData) => {
            setIsSubmitting(true)
            await createRecurringAppointments(formData)
            setIsSubmitting(false)
            onClose()
            window.location.reload()
        }} className="space-y-4">
          <input type="hidden" name="patientId" value={patientId} />
          
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">תאריך התחלה</label>
            <input name="startDate" type="date" required className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">שעה קבועה</label>
            <input name="time" type="time" required className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">מספר מפגשים (שבועי)</label>
            <input name="count" type="number" defaultValue="10" min="2" max="50" className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>
          
          <div>
             <label className="text-xs font-bold text-slate-500 mb-2 block">מיקום</label>
             <div className="flex gap-4">
               <label className="flex-1 p-2 border rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                 <input type="radio" name="type" value="clinic" checked={type==='clinic'} onChange={()=>setType('clinic')} /> קליניקה
               </label>
               <label className="flex-1 p-2 border rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                 <input type="radio" name="type" value="zoom" checked={type==='zoom'} onChange={()=>setType('zoom')} /> זום
               </label>
             </div>
          </div>

          {type === 'clinic' && <input name="address" placeholder="כתובת הקליניקה" className="w-full p-3 bg-slate-50 border rounded-xl" />}
          {type === 'zoom' && <input name="videoLink" placeholder="קישור זום קבוע" className="w-full p-3 bg-slate-50 border rounded-xl" />}

          <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4">
            {isSubmitting ? 'מייצר פגישות...' : 'צור סדרה ביומן'}
          </button>
        </form>
      </div>
    </div>
  )
}
