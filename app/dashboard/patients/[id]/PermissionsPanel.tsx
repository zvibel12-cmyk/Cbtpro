'use client'

// תיקון קריטי: נתיב אבסולוטי
import { updateJournalPermissions } from '@/app/dashboard/patients/actions'

export default function PermissionsPanel({ patientId, settings }: { patientId: string, settings: any }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <h4 className="font-bold text-slate-800 mb-3 text-sm">ניהול הרשאות יומן</h4>
      <form action={updateJournalPermissions} className="space-y-3">
        <input type="hidden" name="patientId" value={patientId} />
        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded text-sm">
          <input type="checkbox" name="allow_level_1" defaultChecked={settings?.allow_level_1} className="w-4 h-4 accent-teal-600"/>
          <span>יומן רגשות (בסיסי)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded text-sm">
          <input type="checkbox" name="allow_level_2" defaultChecked={settings?.allow_level_2} className="w-4 h-4 accent-purple-600"/>
          <span>עיוותי חשיבה (מתקדם)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded text-sm">
          <input type="checkbox" name="allow_level_3" defaultChecked={settings?.allow_level_3} className="w-4 h-4 accent-rose-600"/>
          <span>יומן מלא (CBT)</span>
        </label>
        <button className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg font-bold mt-2 hover:bg-slate-800">שמור שינויים</button>
      </form>
    </div>
  )
}
