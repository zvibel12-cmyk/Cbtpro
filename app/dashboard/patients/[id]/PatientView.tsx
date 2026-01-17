'use client'

import { useState } from 'react'
import { User, Calendar, FileText, Brain, Phone, Mail, ArrowRight, Plus, Edit, CheckCircle, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import PermissionsPanel from './PermissionsPanel'

export default function PatientView({ patient, futureAppointments, notes, journals, settings, stats, patientId }: any) {
  const [activeTab, setActiveTab] = useState('appointments')

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* כותרת עליונה */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          <Link href="/dashboard/patients" className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500"><ArrowRight size={20}/></Link>
          <div className="flex gap-4">
             <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">{patient?.full_name?.[0]}</div>
             <div>
               <h1 className="text-xl font-bold text-slate-800">{patient?.full_name}</h1>
               <div className="flex gap-3 text-sm text-slate-500">
                 <span className="flex items-center gap-1"><Mail size={12}/> {patient?.email}</span>
                 <span className="flex items-center gap-1"><Phone size={12}/> {patient?.phone}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* טאבים */}
      <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 w-fit">
          {['appointments', 'notes', 'journals'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab === 'appointments' ? 'פרטים ופגישות' : tab === 'notes' ? 'סיכומים' : 'יומנים ומשימות'}
            </button>
          ))}
      </div>

      {/* טאב 1: פגישות ופרטים */}
      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-3 border-b pb-2 flex items-center gap-2"><User size={16}/> פרטים אישיים</h3>
                <div className="space-y-3 text-sm">
                   <div><span className="text-slate-400 text-xs block">תעודת זהות</span><span className="font-bold">{patient?.identity_number || '-'}</span></div>
                   <div><span className="text-slate-400 text-xs block">כתובת</span><span className="font-bold">{patient?.address || '-'}</span></div>
                   <div><span className="text-slate-400 text-xs block">הצטרף בתאריך</span><span className="font-bold">{new Date(patient?.created_at).toLocaleDateString()}</span></div>
                </div>
              </div>
           </div>
           <div className="lg:col-span-2 space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-slate-800">פגישות עתידיות</h3>
               <Link href={`/dashboard/schedule?patientId=${patientId}`} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2"><Plus size={14}/> קבע פגישה</Link>
             </div>
             {futureAppointments.length === 0 ? <div className="bg-slate-50 p-6 rounded-xl border border-dashed text-center text-slate-500 text-sm">אין פגישות עתידיות</div> : 
               futureAppointments.map((apt: any) => (
                 <div key={apt.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-center font-bold text-xs">
                      <div>{new Date(apt.start_time).getDate()}</div>
                      <div>{new Date(apt.start_time).toLocaleDateString('he-IL',{month:'short'})}</div>
                    </div>
                    <div><div className="font-bold text-sm">טיפול</div><div className="text-xs text-slate-500">{new Date(apt.start_time).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})}</div></div>
                 </div>
               ))
             }
           </div>
        </div>
      )}

      {/* טאב 2: סיכומים */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-slate-800">תיעוד מפגשים</h3>
             <Link href={`/dashboard/patients/${patientId}/notes/new`} className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-2"><Plus size={14}/> הוסף סיכום</Link>
           </div>
           {notes.length === 0 ? <div className="bg-slate-50 p-8 rounded-xl border border-dashed text-center text-slate-500 text-sm">אין סיכומים</div> : 
             notes.map((note: any) => (
               <div key={note.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 font-bold mb-2">{new Date(note.created_at).toLocaleDateString('he-IL')}</div>
                  <div className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{note.content}</div>
                  {note.homework && <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-slate-700"><span className="font-bold block mb-1 text-yellow-800">משימות לבית:</span>{note.homework}</div>}
               </div>
             ))
           }
        </div>
      )}

      {/* טאב 3: יומנים */}
      {activeTab === 'journals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-sm">
                 <div className="text-4xl font-black">{stats.count}</div>
                 <div className="text-sm opacity-80">יומנים מאז הפגישה האחרונה</div>
              </div>
              <PermissionsPanel patientId={patientId} settings={settings} />
           </div>
           <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-slate-800">היסטוריית דיווחים</h3>
              {journals.length === 0 ? <div className="bg-white p-6 rounded-xl border text-center text-slate-400 text-sm">אין יומנים.</div> : 
                journals.map((j: any) => (
                  <div key={j.id} className="bg-white p-4 rounded-xl border hover:border-blue-300">
                     <div className="flex justify-between text-xs mb-1"><span className="font-bold text-blue-600">{j.journal_type === 1 ? 'רגשות' : 'CBT'}</span><span className="text-slate-400">{new Date(j.created_at).toLocaleDateString('he-IL')}</span></div>
                     <div className="text-sm text-slate-700 line-clamp-2">{j.situation}</div>
                  </div>
                ))
              }
           </div>
        </div>
      )}
    </div>
  )
}
