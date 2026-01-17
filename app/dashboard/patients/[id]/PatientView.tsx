'use client'

import { useState } from 'react'
import { User, Calendar, FileText, Brain, Phone, Mail, ArrowRight, Plus, Edit, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import PermissionsPanel from './PermissionsPanel'

export default function PatientView({ patient, futureAppointments, notes, journals, settings, stats, patientId }: any) {
  const [activeTab, setActiveTab] = useState('appointments')

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* כותרת עליונה ופרטי מטופל */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
        <div className="flex gap-4">
          <Link href="/dashboard/patients" className="p-2 h-10 w-10 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition text-slate-500">
            <ArrowRight size={20} />
          </Link>
          <div className="flex gap-4">
             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-blue-100 shadow-xl">
               {patient?.full_name?.[0]}
             </div>
             <div>
               <h1 className="text-2xl font-bold text-slate-800">{patient?.full_name}</h1>
               <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-slate-500 mt-1">
                 <span className="flex items-center gap-1"><Mail size={14}/> {patient?.email}</span>
                 <span className="flex items-center gap-1"><Phone size={14}/> {patient?.phone || 'לא הוזן נייד'}</span>
               </div>
             </div>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition bg-slate-50 px-4 py-2 rounded-xl">
           <Edit size={16} /> ערוך פרטים
        </button>
      </div>

      {/* סרגל לשוניות */}
      <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'appointments' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Calendar size={16}/> פגישות ויומן
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'notes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <FileText size={16}/> סיכומי פגישה
        </button>
        <button 
          onClick={() => setActiveTab('journals')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'journals' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Brain size={16}/> יומנים ומשימות
        </button>
      </div>

      {/* --- לשונית 1: פגישות --- */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-slate-800 text-lg">פגישות עתידיות</h3>
             <Link href={`/dashboard/schedule?patientId=${patientId}`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-100">
               <Plus size={18} /> קבע פגישה חדשה (בודדת/סדרה)
             </Link>
           </div>
           
           {futureAppointments.length === 0 ? (
             <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
               <Calendar className="mx-auto text-slate-300 mb-2 h-10 w-10"/>
               <p className="text-slate-500 font-bold">אין פגישות עתידיות</p>
               <p className="text-slate-400 text-sm">קבע פגישה חדשה כדי להמשיך את הרצף הטיפולי.</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {futureAppointments.map((apt: any) => (
                 <div key={apt.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-lg text-center border border-blue-100">
                        <div className="text-sm">{new Date(apt.start_time).getDate()}</div>
                        <div className="text-xs">{new Date(apt.start_time).toLocaleDateString('he-IL', {month:'short'})}</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">פגישה טיפולית</div>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                           <Clock size={14}/> {new Date(apt.start_time).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'})}
                           <span className="text-slate-300">|</span>
                           {new Date(apt.start_time).toLocaleDateString('he-IL', {weekday:'long'})}
                        </div>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">עתידי</span>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {/* --- לשונית 2: סיכומים --- */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-slate-800 text-lg">תיעוד מפגשים</h3>
             {/* כפתור הוספת סיכום */}
             <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2">
               <Plus size={18} /> הוסף סיכום פגישה
             </button>
           </div>

           {notes.length === 0 ? (
             <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
               <FileText className="mx-auto text-slate-300 mb-2 h-10 w-10"/>
               <p className="text-slate-500">טרם תועדו פגישות בתיק זה.</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {notes.map((note: any) => (
                 <div key={note.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                       <span className="font-bold text-slate-800">{new Date(note.created_at).toLocaleDateString('he-IL')}</span>
                       <span className="text-xs text-slate-400">נוצר ע"י המטפל</span>
                    </div>
                    <div className="space-y-3">
                       <div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">סיכום:</span>
                         <p className="text-slate-700 text-sm mt-1">{note.content}</p>
                       </div>
                       {note.homework && (
                         <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                           <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide flex items-center gap-1">
                             <CheckCircle size={12}/> משימות לבית (משוקף למטופל):
                           </span>
                           <p className="text-slate-700 text-sm mt-1">{note.homework}</p>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {/* --- לשונית 3: יומנים (עם המדד וההרשאות) --- */}
      {activeTab === 'journals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* צד ימין: סטטיסטיקה והרשאות */}
           <div className="space-y-6">
              {/* סטטיסטיקת מילוי - המדד המיוחד שביקשת */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                 <h4 className="font-bold opacity-90 text-sm mb-4">מדד התמדה (מאז הפגישה האחרונה)</h4>
                 <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-black">{stats.count}</span>
                    <span className="text-sm font-medium opacity-80 mb-2">יומנים מולאו</span>
                 </div>
                 {stats.lastApptDate && (
                   <p className="text-xs opacity-70 border-t border-white/20 pt-2 mt-2">
                     הספירה החלה ב: {new Date(stats.lastApptDate).toLocaleDateString('he-IL')}
                   </p>
                 )}
                 {stats.count > 0 && (
                   <div className="mt-3 flex gap-2">
                     {stats.types.includes(1) && <span className="bg-white/20 px-2 py-1 rounded text-xs">רגשות</span>}
                     {stats.types.includes(2) && <span className="bg-white/20 px-2 py-1 rounded text-xs">עיוותים</span>}
                     {stats.types.includes(3) && <span className="bg-white/20 px-2 py-1 rounded text-xs">מלא</span>}
                   </div>
                 )}
              </div>

              {/* פאנל ניהול הרשאות */}
              <PermissionsPanel patientId={patientId} settings={settings} />
           </div>

           {/* צד שמאל: רשימת היומנים */}
           <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <Brain className="text-rose-500" /> היסטוריית דיווחים
              </h3>

              {!settings?.share_with_therapist ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                   <p className="font-bold text-slate-600">אין גישה ליומנים</p>
                   <p className="text-sm text-slate-400 mt-1">המטופל בחר שלא לשתף את היומנים בשלב זה.</p>
                </div>
              ) : journals.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-slate-400">טרם מולאו יומנים.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {journals.map((journal: any) => (
                    <div key={journal.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer group">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${journal.journal_type === 1 ? 'bg-teal-50 text-teal-700' : journal.journal_type === 2 ? 'bg-purple-50 text-purple-700' : 'bg-rose-50 text-rose-700'}`}>
                               {journal.journal_type === 1 ? 'רגשות' : journal.journal_type === 2 ? 'עיוותים' : 'CBT מלא'}
                             </span>
                             <span className="text-xs text-slate-400">{new Date(journal.created_at).toLocaleDateString('he-IL')}</span>
                          </div>
                          {/* תצוגה מקדימה של עוצמה רגשית ראשית אם יש */}
                          {journal.journal_type === 3 && journal.belief_before && (
                            <span className="text-xs font-bold text-slate-400">
                               אמונה: {journal.belief_before}% -> {journal.belief_after}%
                            </span>
                          )}
                       </div>
                       <p className="text-sm text-slate-700 font-medium mb-1 line-clamp-1 group-hover:text-blue-700 transition">
                         {journal.situation}
                       </p>
                       <p className="text-xs text-slate-500 line-clamp-1">
                         מחשבה: {journal.automatic_thoughts}
                       </p>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      )}

    </div>
  )
}
