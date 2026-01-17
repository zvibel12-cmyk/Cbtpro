'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function createAppointment(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const patientId = formData.get('patientId') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const type = formData.get('type') as string 
  
  // שדות חדשים
  const address = formData.get('address') as string
  const videoLink = formData.get('videoLink') as string

  const startDateTime = new Date(`${date}T${time}`)
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) 

  const { error } = await supabase.from('appointments').insert({
    therapist_id: user.id,
    patient_id: patientId,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    location_type: type,
    meeting_address: type === 'clinic' ? address : null, // שומרים כתובת רק אם זה קליניקה
    video_link: type === 'zoom' ? videoLink : null,      // שומרים לינק רק אם זה זום
    status: 'confirmed'
  })

  if (error) {
    console.error(error)
    return { error: 'Error creating appointment' }
  }

  revalidatePath('/dashboard/schedule')
  return { success: true }
}

// --- הוספת פונקציה לסדרת פגישות ---
export async function createRecurringAppointments(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const patientId = formData.get('patientId') as string
  const startDate = formData.get('startDate') as string
  const time = formData.get('time') as string
  const count = parseInt(formData.get('count') as string) || 10 // ברירת מחדל 10 מפגשים
  const type = formData.get('type') as string 
  const address = formData.get('address') as string
  const videoLink = formData.get('videoLink') as string

  const appointmentsToInsert = []
  let currentDate = new Date(`${startDate}T${time}`)

  for (let i = 0; i < count; i++) {
    const endDateTime = new Date(currentDate.getTime() + 60 * 60 * 1000) // שעה משך פגישה

    appointmentsToInsert.push({
      therapist_id: user.id,
      patient_id: patientId,
      start_time: currentDate.toISOString(),
      end_time: endDateTime.toISOString(),
      location_type: type,
      meeting_address: type === 'clinic' ? address : null,
      video_link: type === 'zoom' ? videoLink : null,
      status: 'confirmed'
    })

    // קידום השבוע הבא (הוספת 7 ימים)
    currentDate.setDate(currentDate.getDate() + 7)
  }

  const { error } = await supabase.from('appointments').insert(appointmentsToInsert)

  if (error) {
    console.error(error)
    return { error: 'Error creating recurring appointments' }
  }

  revalidatePath('/dashboard/schedule')
  revalidatePath(`/dashboard/patients/${patientId}`)
  return { success: true }
}
