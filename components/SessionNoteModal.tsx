'use client'
import { useState, useEffect } from 'react'
import { X, FileText, CheckSquare, Lock, Save } from 'lucide-react'
import { createSessionNote, updateSessionNote } from '@/app/dashboard/actions'

export default function SessionNoteModal({ isOpen, onClose, patientId, initialData }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // אם יש מידע ראשוני, אנחנו במצב עריכה
  const isEdit = !!initialData

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-primary-600" /> {isEdit ? 'עריכת סיכום פגישה' : 'תיעוד פגישה חדש'}
          </h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form action={async (formData) => {
            setIsSubmitting(true)
            if (isEdit) {
                await updateSessionNote(formData)
            } else {
                await createSessionNote(formData)
            }
            setIsSubmitting(false)
            onClose()
        }} className="p-6 space-y-6 overflow-y-auto flex-1">
          <input type="hidden" name="patientId" value={patientId} />
          {isEdit && <input type="hidden" name="noteId" value={initialData.id} />}
          
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">תאריך הפגישה</label>
            <input name="date" type="datetime-local" defaultValue={isEdit ? new Date(initialData.session_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block">סיכום פגישה</label>
            <textarea name="summary" rows={5} defaultValue={initialData?.summary} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-blue-800 mb-2 block flex items-center gap-2">
              <CheckSquare size={16} /> משימות למטופל
            </label>
            <textarea name="homework" rows={3} defaultValue={initialData?.homework} className="w-full p-3 bg-white border border-blue-200 rounded-xl outline-none resize-none" />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-500 mb-2 block flex items-center gap-2">
              <Lock size={16} /> הערות אישיות
            </label>
            <input name="privateNotes" defaultValue={initialData?.private_notes} className="w-full p-3 bg-slate-50 border rounded-xl" />
          </div>

          <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition flex justify-center gap-2">
            <Save /> {isSubmitting ? 'שומר...' : (isEdit ? 'עדכן סיכום' : 'שמור סיכום')}
          </button>
        </form>
      </div>
    </div>
  )
}
