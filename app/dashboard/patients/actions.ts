'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    content,
    homework
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/patients/${patientId}`)
  redirect(`/dashboard/patients/${patientId}`)
}
