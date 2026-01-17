'use client'

import { updateJournalPermissions } from '@/app/patient/actions' // וודא שהנתיב נכון
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react'

export default function PermissionsPanel({ patientId, settings }: { patientId: string, settings: any }) {
  const isShared = settings?.share_with_therapist

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-800 text-lg">הגדרות ויומנים</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isShared ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
           {isShared ? <><Eye size={14}/> המטופל אישר צפייה</> : <><EyeOff size={14}/> אין אישור צפייה מהמטופל</>}
        </div>
      </div>

      <form action={updateJournalPermissions} className="space-y-4">
        <input type="hidden" name="patientId" value={patientId} />
        
        <p className="text-sm text-slate-500 font-bold mb-2">אילו יומנים פתוחים למטופל?</p>
        
        <div className="flex gap-4">
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition flex-1">
            <input type="checkbox" name="allow_level_1" defaultChecked={settings?.allow_level_1} className="w-5 h-5 accent-teal-600" />
            <span className="text-sm font-bold text-slate-700">יומן רגשות (1)</span>
          </label>
          
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition flex-1">
            <input type="checkbox" name="allow_level_2" defaultChecked={settings?.allow_level_2} className="w-5 h-5 accent-purple-600" />
            <span className="text-sm font-bold text-slate-700">עיוותי חשיבה (2)</span>
          </label>
          
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition flex-1">
            <input type="checkbox" name="allow_level_3" defaultChecked={settings?.allow_level_3} className="w-5 h-5 accent-rose-600" />
            <span className="text-sm font-bold text-slate-700">יומן מלא (3)</span>
          </label>
        </div>

        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 mt-2">
          עדכן הרשאות גישה
        </button>
      </form>
    </div>
  )
}
