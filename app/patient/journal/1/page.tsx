'use client'
import { saveJournalEntry } from '../../actions'
import { ArrowRight, Activity } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const EMOTIONS = ["עצוב", "חרד", "כועס", "אשמה", "חסר תקווה", "נחות", "בודד", "מתוסכל", "מבוכה"]

export default function Journal1() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const toggleEmotion = (e: string) => selectedEmotions.includes(e) ? setSelectedEmotions(prev => prev.filter(x => x !== e)) : setSelectedEmotions(prev => [...prev, e])

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Link href="/patient/journal" className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm"><ArrowRight size={16}/> חזרה</Link>
      <div className="bg-white p-8 rounded-3xl border border-teal-100 shadow-sm">
        <h1 className="text-2xl font-black text-teal-800 mb-6 flex items-center gap-2"><Activity/> יומן רגשות (רמה 1)</h1>
        <form action={saveJournalEntry} className="space-y-6">
          <input type="hidden" name="journal_type" value="1" />
          
          <div><label className="label">1. האירוע</label><textarea name="situation" required rows={3} className="input-field"></textarea></div>
          <div><label className="label">2. המחשבה</label><textarea name="automatic_thoughts" required rows={3} className="input-field"></textarea></div>
          
          <div>
            <label className="label">3. הרגש (הכנס עוצמה באחוזים 0-100)</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {EMOTIONS.map(e => (
                <button type="button" key={e} onClick={() => toggleEmotion(e)} 
                  className={`chip ${selectedEmotions.includes(e) ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-slate-50'}`}>{e}</button>
              ))}
            </div>
            {selectedEmotions.map(e => (
               <div key={e} className="flex items-center gap-4 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                 <span className="font-bold text-slate-700 w-24">{e}</span>
                 <input type="hidden" name="selected_emotions" value={e} />
                 {/* שינוי: קלט מספרי במקום סליידר */}
                 <div className="relative flex-1">
                   <input name={`intensity_${e}`} type="number" min="0" max="100" placeholder="0" className="w-full p-2 pr-8 border rounded-lg text-center font-bold outline-none focus:border-teal-500" required />
                   <span className="absolute top-2 right-3 text-slate-400 text-sm">%</span>
                 </div>
               </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div><label className="label">4. התנהגות</label><input name="reaction" className="input-field" /></div>
             <div><label className="label">5. סימפטומים גופניים</label><input name="physical_symptoms" className="input-field" /></div>
          </div>
          <button className="btn-primary bg-teal-600 hover:bg-teal-700 w-full mt-4 text-white py-3 rounded-xl font-bold">שמור יומן</button>
        </form>
      </div>
      <style jsx>{`
        .label { display: block; font-weight: bold; color: #334155; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .input-field { width: 100%; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; }
        .chip { padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #cbd5e1; transition: all; }
      `}</style>
    </div>
  )
}
