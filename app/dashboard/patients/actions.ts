'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveSessionNote(formData: FormData) {
  console.log('📝 מתחיל שמירת סיכום פגישה...')
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('❌ שגיאה: משתמש לא מחובר')
    return { error: 'Unauthorized' }
  }

  const patientId = formData.get('patientId') as string
  const content = formData.get('content') as string
  const homework = formData.get('homework') as string

  console.log('פרטי סיכום:', { patientId, therapistId: user.id, contentLenght: content.length })

  const { data, error } = await supabase.from('session_notes').insert({
    patient_id: patientId,
    therapist_id: user.id, // המזהה של המטפל המחובר
    content: content,
    homework: homework,
    created_at: new Date().toISOString()
  }).select()

  if (error) {
    console.error('❌ שגיאה בשמירה ל-DB:', error.message)
    return { error: error.message }
  }

  console.log('✅ הסיכום נשמר בהצלחה:', data)
  revalidatePath(`/dashboard/patients/${patientId}`)
  redirect(`/dashboard/patients/${patientId}`)
}
