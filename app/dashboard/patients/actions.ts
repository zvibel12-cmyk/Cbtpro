'use server'

import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. יצירת מטופל חדש (אדמין)
export async function createPatient(formData: FormData) {
  if (!supabaseAdmin) return { error: 'Server config error' }

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const identityNumber = formData.get('identityNumber') as string
  const address = formData.get('address') as string

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email, email_confirm: true, user_metadata: { full_name: fullName }
  })

  if (authError) return { error: authError.message }
  if (!authUser.user) return { error: 'User creation failed' }

  const newUserId = authUser.user.id

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: newUserId, email, full_name: fullName, phone, identity_number: identityNumber, address,
    created_at: new Date().toISOString()
  })

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    return { error: profileError.message }
  }

  await supabaseAdmin.from('patient_journal_settings').insert({
    patient_id: newUserId, allow_level_1: true, share_with_therapist: false
  })

  revalidatePath('/dashboard/patients')
  redirect(`/dashboard/patients/${newUserId}`)
}

// 2. שמירת סיכום פגישה
export async function saveSessionNote(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const patientId = formData.get('patientId') as string
  const content = formData.get('content') as string
  const homework = formData.get('homework') as string

  const { error } = await supabase.from('session_notes').insert({
    patient_id: patientId, therapist_id: user.id, content, homework
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/patients/${patientId}`)
  redirect(`/dashboard/patients/${patientId}`)
}

// 3. עדכון הרשאות יומן
export async function updateJournalPermissions(formData: FormData) {
  const supabase = createClient()
  const patientId = formData.get('patientId') as string
  
  await supabase.from('patient_journal_settings').upsert({ 
      patient_id: patientId,
      allow_level_1: formData.get('allow_level_1') === 'on',
      allow_level_2: formData.get('allow_level_2') === 'on',
      allow_level_3: formData.get('allow_level_3') === 'on'
  })
  revalidatePath(`/dashboard/patients/${patientId}`)
}
