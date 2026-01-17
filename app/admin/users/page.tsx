export const dynamic = 'force-dynamic'

// שינוי קריטי: מייבאים את האדמין במקום הלקוח הרגיל
import { supabaseAdmin } from '@/lib/supabaseAdmin' 
import { deleteUser, toggleAdminStatus } from '../actions'
import { Trash2, Shield, ShieldAlert, User, AlertCircle } from 'lucide-react'

export default async function UsersAdmin() {
  
  // שליפה באמצעות הרשאות-על (עוקף RLS)
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
                <td className="p-4 font-bold text-slate-800">{u.full_name || 'ללא שם'}</td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4 text-slate-600">{u.phone || '-'}</td>
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
                  <form action={toggleAdminStatus}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="currentStatus" value={String(u.is_admin)} />
                    <button className="p-2 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg transition" title="שנה הרשאות אדמין">
                      <Shield size={16} />
                    </button>
                  </form>
                  
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={u.id} />
                    {/* כפתור מחיקה ללא אישור נוסף (כי זה כבר אדמין) או עם Confirm קטן ב-JS במידת הצורך, כאן זה ישיר */}
                    <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition" title="מחק משתמש">
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
