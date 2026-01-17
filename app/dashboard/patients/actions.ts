'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- שמירת סיכום פגישה ---
export async function saveSessionNote(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  const patientId = formData.get('patientId') as string
  const content = formData.get('content') as string
  const homework = formData.get('homework') as string

  const { error } = await supabase.from('session_notes').insert({
    patient_id: patientId,
    therapist_id: user.id,
    content: content,
    homework: homework,
    created_at: new Date().toISOString()
  })

  if (error) {
    console.error('Error saving note:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/patients/${patientId}`)
  redirect(`/dashboard/patients/${patientId}`)
}

// --- יצירת מטופל חדש (אדמין) ---
export async function createPatient(formData: FormData) {
  console.log('➕ מתחיל יצירת מטופל חדש...')

  // בדיקת קיום מפתח אדמין
  if (!supabaseAdmin) {
    console.error('❌ שגיאה: חסר SUPABASE_SERVICE_ROLE_KEY')
    return { error: 'Server configuration error' }
  }

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const identityNumber = formData.get('identityNumber') as string
  const address = formData.get('address') as string
  
  // 1. יצירת משתמש Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    email_confirm: true, // המייל מאושר אוטומטית
    user_metadata: { full_name: fullName }
  })

  if (authError) {
    console.error('❌ שגיאה ביצירת משתמש Auth:', authError.message)
    return { error: authError.message }
  }

  if (!authUser.user) {
    return { error: 'User creation failed' }
  }

  const newUserId = authUser.user.id

  // 2. יצירת פרופיל
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: newUserId,
      email: email,
      full_name: fullName,
      phone: phone,
      identity_number: identityNumber,
      address: address,
      created_at: new Date().toISOString()
    })

  if (profileError) {
    console.error('❌ שגיאה ביצירת פרופיל:', profileError.message)
    // ניקוי המשתמש שנוצר אם הפרופיל נכשל
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    return { error: profileError.message }
  }

  // 3. הגדרות יומן ברירת מחדל
  await supabaseAdmin.from('patient_journal_settings').insert({
    patient_id: newUserId,
    allow_level_1: true,
    share_with_therapist: false
  })

  console.log('✅ מטופל נוצר בהצלחה!')
  revalidatePath('/dashboard/patients')
  redirect(`/dashboard/patients/${newUserId}`)
}
