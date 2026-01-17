'use client'

import { useState } from 'react'
import { Calendar, BookOpen, ClipboardList, Plus, Video, MapPin, FileText, CheckSquare, RefreshCw, Pencil, BrainCircuit } from 'lucide-react'
import AppointmentModal from './AppointmentModal'
import RecurringModal from './RecurringModal'
import SessionNoteModal from './SessionNoteModal'
import EditPatientModal from './EditPatientModal'

export default function PatientTabs({ patientId, profile, file, appointments, journals, notes }: any) {
  const [activeTab, setActiveTab] = useState('appointments')
  
  // Modals States
  const [isApptModalOpen, setIsApptModalOpen] = useState(false)
  const [selectedAppt, setSelectedAppt] = useState<any>(null) // לעריכה

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<any>(null) // לעריכה

  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false) // עריכת מטופל

  const singlePatientList = [{ patient_id: patientId, profiles: { full_name: profile.full_name } }]

  // פונקציות עזר לפתיחת עריכה
  const handleEditAppt = (appt: any) => { setSelectedAppt(appt); setIsApptModalOpen(true); }
  const handleNewAppt = () => { setSelectedAppt(null); setIsApptModalOpen(true); }
  
  const handleEditNote = (note: any) => { setSelectedNote(note); setIsNoteModalOpen(true); }
  const handleNewNote = () => { setSelectedNote(null); setIsNoteModalOpen(true); }

  return (
    <div className="relative">
      
      {/* כפתור עריכת מטופל ראשי (צף למעלה) */}
      <div className="absolute top-[-140px] left-0 md:top-[-100px] md:left-8">
         <button onClick={() => setIsEditPatientOpen(true)} className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white hover:text-primary-600 transition shadow-sm">
           <Pencil size={14} /> ערוך פרטי מטופל
         </button>
      </div>

      {/* סרגל לשוניות */}
      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('appointments')} className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'appointments' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}>
          <Calendar size={18} /> פגישות
        </button>
        <button onClick={() => setActiveTab('notes')} className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'notes' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}>
          <FileText size={18} /> סיכומים
        </button>
        <button onClick={() => setActiveTab('questionnaires')} className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'questionnaires' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}>
          <BrainCircuit size={18} /> שאלונים ומבדקים
        </button>
        <button onClick={() => setActiveTab('journals')} className={`pb-4 px-4 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${activeTab === 'journals' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}>
          <BookOpen size={18} /> יומנים
        </button>
      </div>

      {/* --- לשונית פגישות --- */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            <button onClick={handleNewAppt} className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 transition flex items-center gap-2">
              <Plus size={16} /> פגישה בודדת
            </button>
            <button onClick={() => setIsRecurringModalOpen(true)} className="bg-white text-primary-600 border border-primary-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-50 transition flex items-center gap-2">
              <RefreshCw size={16} /> סדרת פגישות
            </button>
          </div>

          <div className="grid gap-3">
            {appointments?.map((appt: any) => (
                <div key={appt.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 group">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${appt.location_type === 'zoom' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                       {appt.location_type === 'zoom' ? <Video size={20} /> : <MapPin size={20} />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-lg">
                        {new Date(appt.start_time).toLocaleDateString('he-IL')} | {new Date(appt.start_time).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="text-sm text-slate-500">
                         {appt.location_type === 'zoom' ? 'מפגש זום' : 'מפגש בקליניקה'}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleEditAppt(appt)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition opacity-0 group-hover:opacity-100">
                    <Pencil size={18} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- לשונית סיכומים --- */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-slate-800">תיעוד רפואי</h3>
             <button onClick={handleNewNote} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition flex items-center gap-2">
               <FileText size={16} /> תיעוד חדש
             </button>
          </div>
          <div className="space-y-4">
            {notes?.map((note: any) => (
                <div key={note.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group relative">
                  <button onClick={() => handleEditNote(note)} className="absolute top-4 left-4 p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition opacity-0 group-hover:opacity-100">
                    <Pencil size={16} />
                  </button>
                  <div className="flex justify-between mb-4 border-b border-slate-50 pb-2">
                    <span className="font-bold text-slate-800 text-lg">{new Date(note.session_date).toLocaleDateString('he-IL')}</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">סיכום פגישה</span>
                      <p className="text-slate-700 mt-1 whitespace-pre-wrap">{note.summary}</p>
                    </div>
                    {note.homework && (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1"><CheckSquare size={12} /> משימות</span>
                        <p className="text-blue-900 mt-1 whitespace-pre-wrap">{note.homework}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* --- לשונית שאלונים (חדשה) --- */}
      {activeTab === 'questionnaires' && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
           <BrainCircuit className="mx-auto h-12 w-12 text-slate-300 mb-2" />
           <h3 className="text-lg font-bold text-slate-700">שאלונים ומבדקים</h3>
           <p className="text-slate-500 mb-6">כאן יופיעו שאלוני GAD-7, PHQ-9 ומבדקים נוספים.</p>
           <button className="bg-primary-50 text-primary-700 px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary-100 transition">
             + הקצאת שאלון חדש
           </button>
        </div>
      )}

      {activeTab === 'journals' && <div className="text-center py-10 text-slate-400">יומנים...</div>}

      {/* --- כל המודאלים --- */}
      <AppointmentModal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} patients={singlePatientList} preSelectedPatientId={patientId} initialData={selectedAppt} />
      <SessionNoteModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} patientId={patientId} initialData={selectedNote} />
      <RecurringModal isOpen={isRecurringModalOpen} onClose={() => setIsRecurringModalOpen(false)} patientId={patientId} />
      <EditPatientModal isOpen={isEditPatientOpen} onClose={() => setIsEditPatientOpen(false)} profile={profile} file={file} />
    </div>
  )
}
