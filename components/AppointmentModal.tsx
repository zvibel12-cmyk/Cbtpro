'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Video, Calendar, Clock, User, Plus, Edit2, Save } from 'lucide-react'
import { createAppointment, updateAppointment } from '@/app/dashboard/actions'

interface Props {
  isOpen: boolean
  onClose: () => void
  patients: any[]
  preSelectedDate?: string
  preSelectedPatientId?: string
  existingAppointments?: any[]
  initialData?: any // עבור עריכה
}

export default function AppointmentModal({ isOpen, onClose, patients, preSelectedDate, preSelectedPatientId, existingAppointments = [], initialData }: Props) {
  const [locationType, setLocationType] = useState('clinic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // אם יש initialData, אנחנו במצב עריכה
  const isEdit = !!initialData
  const [showForm, setShowForm] = useState(isEdit || existingAppointments.length === 0)

  // אתחול ערכים בעריכה
  useEffect(() => {
    if (initialData) {
        setLocationType(initialData.location_type)
        setShowForm(true)
    }
  }, [initialData])

  if (!isOpen) return null

  // חישוב ערכי ברירת מחדל לטופס
  const defaultDate = initialData ? new Date(initialData.start_time).toISOString().split('T')[0] : (preSelectedDate || new Date().toISOString().split('T')[0])
  const defaultTime = initialData ? new Date(initialData.start_time).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'}) : ''

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[90vh] flex flex-col">
        
        <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
               {isEdit ? 'עריכת פגישה' : (preSelectedDate ? new Date(preSelectedDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' }) : 'תיאום פגישה')}
            </h2>
            <p className="text-xs text-slate-500">{isEdit ? 'עדכון פרטי יומן' : 'ניהול הלו"ז היומי'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* הצגת פגישות קיימות (רק אם אנחנו לא בעריכה) */}
          {!isEdit && existingAppointments.length > 0 && (
            <div className="space-y-3">
               <h3 className="text-sm font-bold text-slate-500">פגישות ביום זה:</h3>
               {existingAppointments.map(appt => (
                 <div key={appt.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${appt.location_type === 'zoom' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          {appt.location_type === 'zoom' ? <Video size={14} /> : <MapPin size={14} />}
                       </div>
                       <div>
                          <div className="font-bold text-sm text-slate-800">
                             {new Date(appt.start_time).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'})} - {appt.profiles?.full_name}
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
               {!showForm && (
                 <button onClick={() => setShowForm(true)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-primary-300 hover:text-primary-600 transition flex items-center justify-center gap-2 mt-4">
                    <Plus size={18} /> הוסף פגישה נוספת
                 </button>
               )}
            </div>
          )}

          {/* טופס (הוספה או עריכה) */}
          {showForm && (
            <form action={async (formData) => {
                setIsSubmitting(true)
                if (isEdit) {
                    await updateAppointment(formData)
                } else {
                    await createAppointment(formData)
                }
                setIsSubmitting(false)
                onClose()
                window.location.reload()
            }} className="space-y-5 animate-in fade-in zoom-in duration-200 border-t border-slate-100 pt-4">
              
              {isEdit && <input type="hidden" name="appointmentId" value={initialData.id} />}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Calendar size={12}/> תאריך</label>
                  <input name="date" type="date" defaultValue={defaultDate} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> שעה</label>
                  <input name="time" type="time" defaultValue={defaultTime} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><User size={12}/> מטופל</label>
                {(preSelectedPatientId || isEdit) ? (
                   <div className="w-full p-3 bg-primary-50 border border-primary-100 rounded-xl text-sm font-bold text-primary-700 flex items-center justify-between">
                     {patients.find(p => p.patient_id === (preSelectedPatientId || initialData.patient_id))?.profiles?.full_name || 'מטופל'}
                     <input type="hidden" name="patientId" value={preSelectedPatientId || initialData.patient_id} />
                   </div>
                ) : (
                  <select name="patientId" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                    <option value="">בחר מטופל...</option>
                    {patients.map(p => (
                      <option key={p.patient_id} value={p.patient_id}>{p.profiles?.full_name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="bg-slate-50 p-1 rounded-xl flex border border-slate-200">
                 <label className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${locationType === 'clinic' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}>
                   <input type="radio" name="type" value="clinic" checked={locationType === 'clinic'} onChange={() => setLocationType('clinic')} className="hidden" />
                   <MapPin size={16} /> בקליניקה
                 </label>
                 <label className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${locationType === 'zoom' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                   <input type="radio" name="type" value="zoom" checked={locationType === 'zoom'} onChange={() => setLocationType('zoom')} className="hidden" />
                   <Video size={16} /> וידאו (Zoom)
                 </label>
              </div>

              {locationType === 'clinic' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">כתובת</label>
                  <input name="address" defaultValue={initialData?.meeting_address} placeholder="רחוב, עיר" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                </div>
              )}

              {locationType === 'zoom' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">קישור לפגישה</label>
                  <input name="videoLink" defaultValue={initialData?.video_link} placeholder="zoom.us/..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                </div>
              )}

              <button disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg mt-2 flex items-center justify-center gap-2">
                <Save size={20} /> {isSubmitting ? 'שומר...' : (isEdit ? 'עדכן פגישה' : 'שריין מועד')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
