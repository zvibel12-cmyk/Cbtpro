'use client'

import { toggleJournalSharing } from '../actions' // וודא נתיב
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function SharingToggle({ initialState }: { initialState: boolean }) {
  const [isShared, setIsShared] = useState(initialState)

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between mb-6 transition ${isShared ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isShared ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
           {isShared ? <Eye size={20}/> : <EyeOff size={20}/>}
        </div>
        <div>
           <h4 className={`font-bold text-sm ${isShared ? 'text-green-800' : 'text-orange-800'}`}>
             {isShared ? 'היומנים משותפים עם המטפל' : 'היומנים פרטיים (מוסתרים מהמטפל)'}
           </h4>
           <p className="text-xs opacity-70">
             {isShared ? 'המטפל יכול לצפות ולהגיב על הרישומים שלך.' : 'רק אתה יכול לראות את מה שאתה כותב.'}
           </p>
        </div>
      </div>

      <form action={async (formData) => {
          setIsShared(!isShared) // עדכון אופטימי מהיר
          await toggleJournalSharing(formData)
      }}>
         <input type="hidden" name="shareState" value={String(!isShared)} />
         <button className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${isShared ? 'bg-white text-green-700 border border-green-200' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
           {isShared ? 'הפסק שיתוף' : 'אשר צפייה'}
         </button>
      </form>
    </div>
  )
}
