'use client'

import { useState } from 'react'
import { User, Calendar, FileText, Brain, Phone, Mail, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import PermissionsPanel from './PermissionsPanel'

export default function PatientView({ patient, appointments, notes, journals, settings, patientId }: any) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* כותרת עליונה */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Link href="/dashboard/patients" className="p-2 hover:bg-slate-50 rounded-full transition">
          <ArrowRight className="text-slate-400" />
        </Link>
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
          {patient?.full_name?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{patient?.full_name}</h1>
          <div className="flex gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Mail size={14}/> {patient?.email}</span>
            <span className="flex items-center gap-1"><Phone size={14}/> {patient?.phone || '-'}</span>
          </div>
        </div>
      </div>

      {/* סרגל לשוניות (Tabs) */}
      <div className="flex gap-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-bold text-sm transition border-b-2 ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          מבט על
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-6 py-3 font-bold text-sm transition border-b-2 ${activeTab === 'notes' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          תיעוד מפגשים
        </button>
        <button 
          onClick={() => setActiveTab('journals')}
          className={`px-6 py-3 font-bold text-sm transition border-b-2 ${activeTab === 'journals' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          יומנים ומשימות
        </button>
      </div>

      {/* --- תוכן לשונית: מבט על --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="text-teal-600"/> פגישות קרובות</h3>
            {appointments?.length === 0 ? <p className="text-slate-400 text-sm">אין פגישות עתידיות.</p> : (
              <div className="space-y-3">
                {appointments.map((apt: any) => (
                   <div key={apt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="font-bold text-slate-800">{new Date(apt.start_time).toLocaleDateString('he-IL')}</div>
                      <div className="text-sm text-slate-500">{new Date(apt.start_time).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</div>
                   </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- תוכן לשונית: תיעוד מפגשים --- */}
      {activeTab === 'notes' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="text-blue-600"/> סיכומי פגישות</h3>
           {/* כאן יבואו הסיכומים הקיימים שלך */}
           <p className="text-slate-400 text-sm">רשימת הסיכומים תופיע כאן...</p>
        </div>
      )}

      {/* --- תוכן לשונית: יומנים (כאן השינוי) --- */}
      {activeTab === 'journals' && (
        <div className="space-y-6">
           
           {/* 1. הפאנל החדש שהוספנו (ניהול הרשאות) */}
           <PermissionsPanel patientId={patientId} settings={settings} />

           {/* 2. רשימת היומנים */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Brain className="text-rose-600"/> יומנים שמילא המטופל</h3>
              
              {!settings?.share_with_therapist ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 font-bold">אין גישה ליומנים</p>
                  <p className="text-xs text-slate-400">המטופל חסם את השיתוף.</p>
                </div>
              ) : journals.length === 0 ? (
                <p className="text-slate-400 text-sm">המטופל טרם מילא יומנים.</p>
              ) : (
                <div className="grid gap-4">
                  {journals.map((journal: any) => (
                    <div key={journal.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition bg-white">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-sm text-slate-800">
                          {journal.journal_type === 1 ? 'יומן רגשות' : journal.journal_type === 2 ? 'עיוותי חשיבה' : 'CBT מלא'}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(journal.created_at).toLocaleDateString('he-IL')}</span>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">{journal.situation}</p>
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
