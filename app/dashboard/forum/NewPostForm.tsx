'use client'

import { useFormStatus } from 'react-dom'
import { createPost } from './actions'
import { Plus, Send } from 'lucide-react'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      disabled={pending} 
      className="bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
    >
      {pending ? 'שומר...' : <>פרסם דיון <Send size={16} /></>}
    </button>
  )
}

export default function NewPostForm() {
  const [key, setKey] = useState(+new Date())

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="text-primary-600" /> פתיחת דיון חדש
      </h3>
      
      <form 
        key={key}
        action={async (formData) => {
            const res = await createPost(formData)
            
            if (res?.error) {
              alert('שגיאה בשמירה: ' + res.error) // הצגת השגיאה האמיתית
            } else {
              setKey(+new Date()) 
              alert('הדיון פורסם בהצלחה!')
            }
        }} 
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input name="title" required placeholder="נושא הדיון" className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none" />
          </div>
          <div>
            <select name="category" className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none">
              <option value="התייעצות קלינית">התייעצות קלינית</option>
              <option value="כלים וטכניקות">כלים וטכניקות CBT</option>
              <option value="ניהול קליניקה">ניהול קליניקה</option>
              <option value="אתיקה">אתיקה וגבולות</option>
              <option value="הפניות">הפניות ומקורות</option>
            </select>
          </div>
        </div>
        <textarea name="content" rows={3} required placeholder="תוכן הדיון..." className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none resize-none" />
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}
