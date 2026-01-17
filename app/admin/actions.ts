'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'

// בדיקת אבטחה
async function ensureAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')
  return true
}

// --- ניהול משתמשים ---

export async function deleteUser(formData: FormData) {
  await ensureAdmin()
  const userId = formData.get('userId') as string

  // 1. ניקוי עמוק של כל המידע הקשור למשתמש (סנכרון נתונים מלא)
  await supabaseAdmin.from('forum_posts').delete().eq('author_id', userId)
  await supabaseAdmin.from('forum_comments').delete().eq('author_id', userId)
  await supabaseAdmin.from('appointments').delete().eq('patient_id', userId).or(`therapist_id.eq.${userId}`)
  await supabaseAdmin.from('cbt_journals').delete().eq('patient_id', userId)
  await supabaseAdmin.from('session_notes').delete().eq('patient_id', userId)
  await supabaseAdmin.from('patients_mapping').delete().eq('patient_id', userId)
  await supabaseAdmin.from('profiles').delete().eq('id', userId)

  // 2. מחיקה מהמערכת הראשית (Auth)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function toggleAdminStatus(formData: FormData) {
  await ensureAdmin()
  const userId = formData.get('userId') as string
  const currentStatus = formData.get('currentStatus') === 'true'

  await supabaseAdmin.from('profiles').update({ is_admin: !currentStatus }).eq('id', userId)
  revalidatePath('/admin/users')
}

// --- השעיית משתמשים ---
export async function toggleSuspension(formData: FormData) {
  await ensureAdmin()
  const userId = formData.get('userId') as string
  const isSuspended = formData.get('isSuspended') === 'true'

  if (!isSuspended) {
    // פעולת השעיה: חסימה ל-100 שנה ועדכון פרופיל
    await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: "876000h" })
    await supabaseAdmin.from('profiles').update({ is_suspended: true }).eq('id', userId)
  } else {
    // ביטול השעיה: הסרת החסימה
    await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: "0" })
    await supabaseAdmin.from('profiles').update({ is_suspended: false }).eq('id', userId)
  }

  revalidatePath('/admin/users')
}

// --- ניהול פורום ---
export async function adminDeletePost(formData: FormData) {
  await ensureAdmin()
  const postId = formData.get('postId') as string
  await supabaseAdmin.from('forum_posts').delete().eq('id', postId)
  revalidatePath('/admin/forum')
}

// --- הגדרות ---
export async function updatePrice(formData: FormData) {
  await ensureAdmin()
  const price = formData.get('price') as string
  await supabaseAdmin.from('system_settings').upsert({ key: 'subscription_price', value: price }) 
  revalidatePath('/admin')
}
