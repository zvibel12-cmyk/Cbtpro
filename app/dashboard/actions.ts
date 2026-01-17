'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// --- Patient Actions ---
export async function createPatient(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user: therapistUser } } = await supabase.auth.getUser()
  if (!therapistUser) return { error: 'לא מחובר' }

  // שליפת נתונים
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const referringParty = formData.get('referringParty') as string
  const referralReason = formData.get('referralReason') as string
  const background = formData.get('background') as string
  const intakeSummary = formData.get('intakeSummary') as string
  
  // יצירת יוזר Auth
  const tempPassword = 'StartCbt123!' 
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'patient' }
  })

  if (createError) {
    return { error: 'שגיאה ביצירת המשתמש: ' + createError.message }
  }

  if (!newUser.user) return { error: 'נכשל ביצירת המשתמש' }

  // עדכון פרופיל
  await supabaseAdmin.from('profiles').update({
    phone: phone,
    address: address,
    full_name: fullName
  }).eq('id', newUser.user.id)

  // יצירת תיק
  const { error: mappingError } = await supabase.from('patients_mapping').insert({
    patient_id: newUser.user.id,
    therapist_id: therapistUser.id,
    intake_summary: intakeSummary,
    referring_party: referringParty,
    referral_reason: referralReason,
    background_summary: background,
    status: 'active'
  })

  if (mappingError) {
    return { error: 'המשתמש נוצר אך פרטי התיק נכשלו בשמירה' }
  }

  revalidatePath('/dashboard/patients')
  
  // --- השינוי הגדול: הפניה ישירה לתיק החדש ---
  redirect(`/dashboard/patients/${newUser.user.id}?new=true`)
}

// --- Appointment Actions (פגישות) ---
export async function createAppointment(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const patientId = formData.get('patientId') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const type = formData.get('type') as string 

  const startDateTime = new Date(`${date}T${time}`)
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) 

  const { error } = await supabase.from('appointments').insert({
    therapist_id: user.id,
    patient_id: patientId,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    location_type: type,
    status: 'confirmed'
  })

  if (error) return { error: 'Error creating appointment' }
  
  // רענון הדף הנוכחי
  revalidatePath(`/dashboard/patients/${patientId}`)
  revalidatePath('/dashboard/schedule')
  return { success: true }
}

// --- Journal Actions (ללא שינוי) ---
export async function createJournalEntry(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const entry = {
    patient_id: user?.id,
    entry_date: new Date().toISOString(),
    situation_description: formData.get('situation') as string,
    automatic_thoughts: formData.get('thoughts') as string,
    rational_response: formData.get('response') as string,
    mood_score: parseInt(formData.get('mood') as string),
    anxiety_score: parseInt(formData.get('anxiety') as string),
    is_shared_with_therapist: true
  }
  await supabase.from('cbt_journals').insert(entry)
  revalidatePath('/dashboard')
  return { success: true }
}

// --- Session Notes Actions (סיכומי פגישות) ---
export async function createSessionNote(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const patientId = formData.get('patientId') as string
  const date = formData.get('date') as string
  const summary = formData.get('summary') as string
  const homework = formData.get('homework') as string
  const privateNotes = formData.get('privateNotes') as string

  const { error } = await supabase.from('session_notes').insert({
    therapist_id: user.id,
    patient_id: patientId,
    session_date: date, // תאריך הפגישה
    summary: summary,
    homework: homework,
    private_notes: privateNotes
  })

  if (error) {
    console.error(error)
    return { error: 'Error saving session note' }
  }

  revalidatePath(`/dashboard/patients/${patientId}`)
  return { success: true }
}

// --- Update Actions (עריכה) ---

// 1. עריכת פרטי מטופל (מעדכן גם פרופיל וגם תיק)
export async function updatePatient(formData: FormData) {
  const supabase = createClient()
  const patientId = formData.get('patientId') as string
  
  // עדכון פרטים אישיים
  await supabaseAdmin.from('profiles').update({
    full_name: formData.get('fullName'),
    phone: formData.get('phone'),
    email: formData.get('email'), // הערה: שינוי אימייל ב-Auth דורש תהליך נפרד, כאן זה רק רישומי
    address: formData.get('address')
  }).eq('id', patientId)

  // עדכון פרטי התיק
  const { error } = await supabase.from('patients_mapping').update({
    referral_reason: formData.get('referralReason'),
    referring_party: formData.get('referringParty'),
    intake_summary: formData.get('intakeSummary')
  }).eq('patient_id', patientId)

  if (error) return { error: 'Failed to update patient' }
  revalidatePath(`/dashboard/patients/${patientId}`)
  return { success: true }
}

// 2. עריכת פגישה
export async function updateAppointment(formData: FormData) {
  const supabase = createClient()
  const appointmentId = formData.get('appointmentId') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const type = formData.get('type') as string
  
  const startDateTime = new Date(`${date}T${time}`)
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

  const { error } = await supabase.from('appointments').update({
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    location_type: type,
    meeting_address: type === 'clinic' ? formData.get('address') : null,
    video_link: type === 'zoom' ? formData.get('videoLink') : null,
  }).eq('id', appointmentId)

  if (error) return { error: 'Update failed' }
  revalidatePath('/dashboard/schedule')
  return { success: true }
}

// 3. עריכת סיכום פגישה
export async function updateSessionNote(formData: FormData) {
  const supabase = createClient()
  const noteId = formData.get('noteId') as string
  const patientId = formData.get('patientId') as string // נדרש ל-revalidate

  const { error } = await supabase.from('session_notes').update({
    session_date: formData.get('date'),
    summary: formData.get('summary'),
    homework: formData.get('homework'),
    private_notes: formData.get('privateNotes')
  }).eq('id', noteId)

  if (error) return { error: 'Update failed' }
  revalidatePath(`/dashboard/patients/${patientId}`)
  return { success: true }
}
