'use client'
import { saveJournalEntry } from '../../actions'
import { useFormStatus } from 'react-dom'
import { ArrowRight, Activity } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const EMOTIONS = ["עצוב", "חרד", "כועס", "אשמה", "חסר תקווה", "נחות", "בודד", "מתוסכל", "מבוכה"]

export default function Journal1() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  
  const toggleEmotion = (e: string) => {
    selectedEmotions.includes(e) ? setSelectedEmotions(prev => prev.filter(x => x !== e)) : setSelectedEmotions(prev => [...prev, e])
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Link href="/patient/journal" className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm"><ArrowRight size={16}/> חזרה</Link>
      <div className="bg-white p-8 rounded-3xl border border-teal-100 shadow-sm">
        <h1 className="text-2xl font-black text-teal-800 mb-6 flex items-center gap-2"><Activity/> יומן רגשות (רמה 1)</h1>
        <form action={saveJournalEntry} className="space-y-6">
          <input type="hidden" name="journal_type" value="1" />
          
          <div>
            <label className="label">1. האירוע (מה קרה?)</label>
            <textarea name="situation" required rows={3} className="input-field" placeholder="תיאור עובדתי..."></textarea>
          </div>
          <div>
            <label className="label">2. המחשבה (מה עבר לי בראש?)</label>
            <textarea name="automatic_thoughts" required rows={3} className="input-field" placeholder="המחשבה האוטומטית..."></textarea>
          </div>
          
          <div>
            <label className="label">3. הרגש (בחר וערוך עוצמה)</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {EMOTIONS.map(e => (
                <button type="button" key={e} onClick={() => toggleEmotion(e)} 
                  className={`chip ${selectedEmotions.includes(e) ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-slate-50'}`}>{e}</button>
              ))}
            </div>
            {selectedEmotions.map(e => (
               <div key={e} className="mb-2"><input type="hidden" name="selected_emotions" value={e} />
               <label className="text-xs font-bold text-slate-600">{e}</label>
               <input name={`intensity_${e}`} type="range" className="w-full accent-teal-600" /></div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div><label className="label">4. התנהגות (מה עשיתי?)</label><input name="reaction" className="input-field" /></div>
             <div><label className="label">5. סימפטומים גופניים</label><input name="physical_symptoms" className="input-field" placeholder="דפיקות לב, רעד..." /></div>
          </div>
          <button className="btn-primary bg-teal-600 hover:bg-teal-700 w-full mt-4 text-white py-3 rounded-xl font-bold">שמור יומן</button>
        </form>
      </div>
      <style jsx>{`
        .label { display: block; font-weight: bold; color: #334155; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .input-field { width: 100%; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; }
        .input-field:focus { border-color: #0d9488; }
        .chip { padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: bold; border: 1px solid #cbd5e1; transition: all; }
      `}</style>
    </div>
  )
}
