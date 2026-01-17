'use client'

import { saveJournalEntry } from '../../actions'
import { useFormStatus } from 'react-dom'
import { Save, ArrowRight, Brain, Activity, Heart, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// רשימת הרגשות מתוך הקבצים (מקורות 2, 8, 13)
const EMOTIONS_LIST = [
  "עצוב / מדוכא / אומלל",
  "חרד / מודאג / מפוחד",
  "כועס / עצבני / רותח",
  "אשמה / בושה / ייסורי מצפון",
  "חסר תקווה / מיואש",
  "נחות / פגום / חסר ערך",
  "בודד / דחוי / לא אהוב",
  "מתוסכל / תקוע",
  "מבוכה / מושפל"
]

// רשימת עיוותי החשיבה מתוך הקבצים (מקורות 5, 11)
const DISTORTIONS_LIST = [
  "הכל או כלום (שחור/לבן)",
  "הכללה מוגזמת",
  "מסננת שלילית (התעלמות מהחיובי)",
  "הקטנת הערך החיובי",
  "קפיצה למסקנות / קריאת מחשבות",
  "ראיית העתיד (רואה שחורות)",
  "העצמה (קטסטרופה) או הקטנה",
  "טיעון רגשי (מרגיש ולכן זה נכון)",
  "הצהרות 'צריך' / 'חייב' / 'אסור'",
  "שימוש בתוויות (אני דפוק)",
  "האשמה עצמית או האשמת אחרים"
]

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 mt-8">
      {pending ? 'שומר יומן...' : 'שמור יומן'}
    </button>
  )
}

export default function NewJournalEntry() {
  // סטייט לניהול הרגשות שנבחרו כדי להציג להם סליידר עוצמה
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion))
    } else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Link href="/patient" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 mb-6 font-bold text-sm transition">
        <ArrowRight size={16} /> ביטול וחזרה
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <h1 className="text-2xl font-black text-slate-800">יומן מצב רוח</h1>
          <p className="text-slate-500 text-sm mt-1">תיעוד, זיהוי ושינוי דפוסי חשיבה</p>
        </div>

        <form action={saveJournalEntry} className="p-6 md:p-8 space-y-10">
          
          {/* חלק 1: האירוע */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-teal-600 font-bold text-lg">
              <Activity size={20} /> 1. האירוע
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">מה קרה? עם מי? איפה?</label>
              <textarea name="situation" required rows={3} placeholder="תאר את האירוע בצורה עובדתית..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 outline-none resize-none"></textarea>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* חלק 2: המחשבה */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-lg">
              <Brain size={20} /> 2. המחשבות
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">מה עבר לי בראש? מה הכי הטריד אותי?</label>
              <textarea name="automatic_thoughts" required rows={3} placeholder="המחשבה האוטומטית שקפצה..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">כמה אני מאמין למחשבה זו? (0-100%)</label>
              <div className="flex items-center gap-4">
                 <input name="belief_before" type="range" min="0" max="100" defaultValue="50" className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"/>
                 <span className="w-12 text-center font-bold text-slate-600 bg-slate-100 rounded-lg py-1 text-sm">לפני</span>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* חלק 3: הרגש */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-lg">
              <Heart size={20} /> 3. הרגשות והגוף
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">מה הרגשתי? (ניתן לבחור כמה)</label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS_LIST.map(emotion => (
                  <button 
                    key={emotion} 
                    type="button"
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition border ${selectedEmotions.includes(emotion) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              {/* שדות נסתרים עבור הרגשות שנבחרו כדי שיישלחו בטופס */}
              {selectedEmotions.map(e => <input key={e} type="hidden" name="selected_emotions" value={e} />)}
            </div>

            {/* סליידרים לרגשות שנבחרו */}
            {selectedEmotions.length > 0 && (
              <div className="bg-rose-50 p-4 rounded-2xl space-y-4 border border-rose-100">
                {selectedEmotions.map(emotion => (
                  <div key={emotion}>
                    <label className="text-xs font-bold text-rose-700 mb-1 block">{emotion} - עוצמה (%)</label>
                    <input name={`intensity_${emotion}`} type="range" min="0" max="100" defaultValue="70" className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">סימפטומים גופניים</label>
                 <input name="physical_symptoms" placeholder="דופק מהיר, רעידות, הזעה..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 outline-none" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">התנהגות (מה עשיתי?)</label>
                 <input name="reaction" placeholder="נמנעתי, צעקתי, הסתגרתי..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 outline-none" />
               </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* חלק 4: אתגור (מתקדם - ע"פ יומן 2 ו-3) */}
          <section className="space-y-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
             <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
              <Zap size={20} /> 4. אתגור המחשבה (מתקדם)
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">זיהוי עיוותי חשיבה (סמן את הרלוונטיים)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {DISTORTIONS_LIST.map(distortion => (
                  <label key={distortion} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100 cursor-pointer hover:border-blue-300 transition">
                    <input type="checkbox" name="distortions" value={distortion} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-xs text-slate-600 font-medium">{distortion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">מחשבה חלופית / רציונלית</label>
              <textarea name="rational_response" rows={3} placeholder="מהי המחשבה המאוזנת יותר? מבוססת עובדות?" className="w-full p-4 bg-white border border-blue-200 rounded-xl focus:border-blue-500 outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">כמה אני מאמין למחשבה השלילית המקורית עכשיו?</label>
              <div className="flex items-center gap-4">
                 <input name="belief_after" type="range" min="0" max="100" defaultValue="20" className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                 <span className="w-12 text-center font-bold text-slate-600 bg-white rounded-lg py-1 text-sm border border-blue-100">אחרי</span>
              </div>
            </div>
          </section>

          <SubmitBtn />

        </form>
      </div>
    </div>
  )
}
