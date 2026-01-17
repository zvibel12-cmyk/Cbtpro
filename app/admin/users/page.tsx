export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { deleteUser, toggleAdminStatus } from '../actions'
import { Trash2, Shield, ShieldAlert, User } from 'lucide-react'

export default async function UsersAdmin() {
  const supabase = createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">ניהול משתמשים</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
            <tr>
              <th className="p-4 font-bold">שם מלא</th>
              <th className="p-4 font-bold">אימייל</th>
              <th className="p-4 font-bold">טלפון</th>
              <th className="p-4 font-bold">סטטוס</th>
              <th className="p-4 font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users?.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-800">{u.full_name}</td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4 text-slate-600">{u.phone}</td>
                <td className="p-4">
                  {u.is_admin ? (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold border border-purple-100">
                      <ShieldAlert size={12}/> אדמין
                    </span>
                  ) : (
                     <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">
                      <User size={12}/> משתמש
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {/* כפתור שינוי הרשאה */}
                  <form action={toggleAdminStatus}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="currentStatus" value={String(u.is_admin)} />
                    <button className="p-2 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg" title="שנה הרשאות אדמין">
                      <Shield size={16} />
                    </button>
                  </form>
                  
                  {/* כפתור מחיקה */}
                  <form action={deleteUser} onSubmit={() => confirm('בטוח? הפעולה תמחק את המשתמש לצמיתות!')}>
                    <input type="hidden" name="userId" value={u.id} />
                    <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg" title="מחק משתמש">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
