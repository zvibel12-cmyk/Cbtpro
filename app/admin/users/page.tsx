export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabaseAdmin' 
import { deleteUser, toggleAdminStatus, toggleSuspension } from '../actions'
import { Trash2, Shield, ShieldAlert, User, AlertCircle, Lock, Unlock, Ban } from 'lucide-react'

export default async function UsersAdmin() {
  
  const { data: users, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="mx-auto mb-2" />
        <h3 className="font-bold">שגיאה בטעינת משתמשים</h3>
        <p className="text-sm dir-ltr text-left mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">ניהול משתמשים</h1>
        <div className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
          סה"כ: {users?.length || 0}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-20">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
            <tr>
              <th className="p-4 font-bold">שם מלא</th>
              <th className="p-4 font-bold">אימייל</th>
              <th className="p-4 font-bold">סטטוס</th>
              <th className="p-4 font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users?.map((u: any) => (
              <tr key={u.id} className={`transition ${u.is_suspended ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`}>
                <td className="p-4 font-bold text-slate-800">
                  {u.full_name || 'ללא שם'}
                  {u.is_suspended && <span className="mr-2 text-xs text-red-600 font-bold">(מושעה)</span>}
                </td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4">
                  {u.is_admin ? (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold border border-purple-100">
                      <ShieldAlert size={12}/> אדמין
                    </span>
                  ) : u.is_suspended ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold">
                      <Ban size={12}/> חסום
                    </span>
                  ) : (
                     <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                      <User size={12}/> פעיל
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {/* כפתור אדמין */}
                  <form action={toggleAdminStatus}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="currentStatus" value={String(u.is_admin)} />
                    <button className="p-2 hover:bg-purple-100 text-slate-400 hover:text-purple-600 rounded-lg transition" title="ניהול הרשאות אדמין">
                      <Shield size={16} />
                    </button>
                  </form>
                  
                  {/* כפתור השעיה/שחרור */}
                  <form action={toggleSuspension}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="isSuspended" value={String(u.is_suspended || false)} />
                    <button 
                      className={`p-2 rounded-lg transition ${u.is_suspended ? 'hover:bg-green-100 text-red-500 hover:text-green-600' : 'hover:bg-orange-100 text-slate-400 hover:text-orange-600'}`}
                      title={u.is_suspended ? "בטל השעיה" : "השעה משתמש"}
                    >
                      {u.is_suspended ? <Unlock size={16} /> : <Lock size={16} />}
                    </button>
                  </form>

                  {/* כפתור מחיקה */}
                  <form action={deleteUser} onSubmit={(e) => { if(!confirm('זהירות! מחיקה זו תמחק את כל המידע של המשתמש (פוסטים, פגישות, יומנים) לצמיתות.')) e.preventDefault() }}>
                    <input type="hidden" name="userId" value={u.id} />
                    <button className="p-2 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition" title="מחיקה מלאה">
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
