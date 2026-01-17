'use client'
import { saveJournalEntry } from '../../actions'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const EMOTIONS = ["עצוב", "חרד", "כועס", "אשמה", "חסר תקווה", "נחות", "בודד", "מתוסכל", "מבוכה"]
const DISTORTIONS = ["הכל או כלום", "הכללה", "מסננת שלילית", "הקטנת החיובי", "קפיצה למסקנות", "ראיית העתיד", "העצמה/הקטנה", "טיעון רגשי", "הצהרות צריך/חייב", "תוויות", "האשמה"]

export default function Journal3() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const toggleEmotion = (e: string) => selectedEmotions.includes(e) ? setSelectedEmotions(prev => prev.filter(x => x !== e)) : setSelectedEmotions(prev => [...prev, e])

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href="/patient/journal" className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm"><ArrowRight size={16}/> חזרה</Link>
      <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm">
        <h1 className="text-2xl font-black text-rose-800 mb-6 flex items-center gap-2"><Star/> יומן CBT מלא (רמה 3)</h1>
        <form action={saveJournalEntry} className="space-y-8">
          <input type="hidden" name="journal_type" value="3" />
          
          <div><label className="label">1. האירוע</label><textarea name="situation" required rows={3} className="input-field"></textarea></div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* צד שמאל - שלילי */}
             <div className="space-y-4 bg-rose-50 p-6 rounded-2xl border border-rose-100">
               <h3 className="font-bold text-rose-700 border-b border-rose-200 pb-2 mb-4">לפני (מחשבה שלילית)</h3>
               <div><label className="label">המחשבה האוטומטית</label><textarea name="automatic_thoughts" rows={3} className="input-field bg-white"></textarea></div>
               
               <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-rose-200">
                 <label className="label mb-0">אמונה במחשבה (%):</label>
                 <input name="belief_before" type="number" min="0" max="100" className="w-20 p-2 border rounded text-center font-bold outline-none focus:border-rose-500" />
               </div>
               
               <div>
                  <label className="label">רגשות (לפני)</label>
                  <div className="flex flex-wrap gap-2 mb-4">{EMOTIONS.map(e => (<button type="button" key={e} onClick={() => toggleEmotion(e)} className={`chip ${selectedEmotions.includes(e) ? 'bg-rose-500 text-white border-rose-600' : 'bg-white'}`}>{e}</button>))}</div>
                  {selectedEmotions.map(e => (
                    <div key={e} className="flex justify-between items-center text-sm mb-2 bg-white p-2 rounded-lg border border-rose-100">
                      <span className="font-bold text-rose-700">{e}</span>
                      <input type="hidden" name="selected_emotions" value={e} />
                      <div className="flex items-center gap-1">
                        <input name={`intensity_before_${e}`} type="number" min="0" max="100" placeholder="%" className="w-16 p-1 border rounded text-center font-bold" />
                      </div>
                    </div>
                  ))}
               </div>
             </div>

             {/* צד ימין - חיובי */}
             <div className="space-y-4 bg-teal-50 p-6 rounded-2xl border border-teal-100">
               <h3 className="font-bold text-teal-700 border-b border-teal-200 pb-2 mb-4">אחרי (מחשבה מתקנת)</h3>
               <div>
                 <label className="label">זיהוי עיוותי חשיבה</label>
                 <select name="distortions" multiple className="input-field h-24 text-sm bg-white">{DISTORTIONS.map(d=><option key={d}>{d}</option>)}</select>
               </div>
               <div><label className="label">מחשבה חלופית</label><textarea name="rational_response" rows={3} className="input-field bg-white border-teal-200"></textarea></div>
               
               <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-teal-200">
                 <label className="label mb-0">אמונה במחשבה החדשה (%):</label>
                 <input name="belief_after" type="number" min="0" max="100" className="w-20 p-2 border rounded text-center font-bold outline-none focus:border-teal-500" />
               </div>
               
               <div>
                  <label className="label">רגשות (אחרי)</label>
                  {selectedEmotions.length === 0 && <span className="text-xs text-slate-400">בחר רגשות מצד ימין כדי לדרג</span>}
                  {selectedEmotions.map(e => (
                    <div key={e} className="flex justify-between items-center text-sm mb-2 bg-white p-2 rounded-lg border border-teal-100">
                      <span className="font-bold text-teal-700">{e}</span>
                      <div className="flex items-center gap-1">
                        <input name={`intensity_after_${e}`} type="number" min="0" max="100" placeholder="%" className="w-16 p-1 border rounded text-center border-teal-200 font-bold" />
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          <button className="btn-primary bg-slate-900 hover:bg-slate-800 w-full mt-8 text-white py-4 rounded-xl font-bold shadow-lg text-lg">סיכום ושמירה בתיק</button>
        </form>
      </div>
      <style jsx>{`
        .label { display: block; font-weight: bold; color: #334155; margin-bottom: 0.5rem; font-size: 0.85rem; }
        .input-field { width: 100%; padding: 0.8rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; outline: none; }
        .chip { padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.7rem; font-weight: bold; border: 1px solid #cbd5e1; }
      `}</style>
    </div>
  )
}
