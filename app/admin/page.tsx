export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { updatePrice } from './actions'
import { Users, FileText, DollarSign } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createClient()
  
  // שליפת סטטיסטיקות
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: postsCount } = await supabase.from('forum_posts').select('*', { count: 'exact', head: true })
  
  // שליפת מחיר נוכחי
  const { data: setting } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'subscription_price')
    .single()

  const currentPrice = setting?.value || '0'

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">לוח בקרה ראשי</h1>
      
      {/* כרטיסי מידע */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm font-bold">סה"כ משתמשים</p>
                <p className="text-3xl font-black text-slate-800">{usersCount}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Users /></div>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm font-bold">פוסטים בפורום</p>
                <p className="text-3xl font-black text-slate-800">{postsCount}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full text-purple-600"><FileText /></div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm font-bold">מחיר מנוי נוכחי</p>
                <p className="text-3xl font-black text-green-600">₪{currentPrice}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full text-green-600"><DollarSign /></div>
           </div>
        </div>
      </div>

      {/* אזור שינוי מחירים */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-xl">
        <h3 className="text-lg font-bold text-slate-800 mb-4">עדכון מחירון מערכת</h3>
        <form action={updatePrice} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">מחיר מנוי חודשי (בשקלים)</label>
            <input name="price" type="number" defaultValue={currentPrice} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" />
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition">
            שמור שינויים
          </button>
        </form>
      </div>
    </div>
  )
}
