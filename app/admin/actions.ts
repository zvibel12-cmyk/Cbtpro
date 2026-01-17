'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // שימוש במפתח העל
import { redirect } from 'next/navigation'

// בדיקת אבטחה: האם המבקש הוא אדמין?
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

  // 1. מחיקה מ-Auth (מוחק את המשתמש מהמערכת לגמרי)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (authError) return { error: authError.message }

  // 2. ניקוי שאריות מטבלאות ציבוריות (אם ה-Cascade לא עבד)
  await supabaseAdmin.from('profiles').delete().eq('id', userId)

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

// --- ניהול פורום ---

export async function adminDeletePost(formData: FormData) {
  await ensureAdmin()
  const postId = formData.get('postId') as string
  
  // מחיקה בכוח (ללא בדיקת בעלות)
  await supabaseAdmin.from('forum_posts').delete().eq('id', postId)
  revalidatePath('/admin/forum')
}

// --- הגדרות מערכת (מחירים) ---

export async function updatePrice(formData: FormData) {
  await ensureAdmin()
  const price = formData.get('price') as string
  
  await supabaseAdmin
    .from('system_settings')
    .upsert({ key: 'subscription_price', value: price })
    
  revalidatePath('/admin')
}
