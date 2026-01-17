'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveJournalEntry(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  // זיהוי סוג היומן
  const journalType = parseInt(formData.get('journal_type') as string)

  // שדות משותפים
  const situation = formData.get('situation') as string
  const automatic_thoughts = formData.get('automatic_thoughts') as string
  const emotionsMap: Record<string, any> = {}

  // עיבוד רגשות (לוגיקה שונה ליומן 3)
  if (journalType === 3) {
    // ביומן 3 יש "לפני" ו"אחרי"
    const emotionsBefore: Record<string, number> = {}
    const emotionsAfter: Record<string, number> = {}
    
    const selectedEmotions = formData.getAll('selected_emotions') as string[]
    selectedEmotions.forEach(emotion => {
      const valBefore = formData.get(`intensity_before_${emotion}`)
      const valAfter = formData.get(`intensity_after_${emotion}`)
      if (valBefore) emotionsBefore[emotion] = parseInt(valBefore as string)
      if (valAfter) emotionsAfter[emotion] = parseInt(valAfter as string)
    })
    emotionsMap['before'] = emotionsBefore
    emotionsMap['after'] = emotionsAfter
  } else {
    // יומן 1 ו-2 (רק עוצמה אחת)
    const selectedEmotions = formData.getAll('selected_emotions') as string[]
    selectedEmotions.forEach(emotion => {
      const intensity = formData.get(`intensity_${emotion}`)
      if (intensity) emotionsMap[emotion] = parseInt(intensity as string)
    })
  }

  // איסוף שאר הנתונים
  const dataToInsert: any = {
    patient_id: user.id,
    journal_type: journalType,
    situation,
    automatic_thoughts,
    emotions: emotionsMap,
    created_at: new Date().toISOString()
  }

  // שדות ספציפיים לפי סוג יומן
  if (journalType === 1) {
    dataToInsert.reaction = formData.get('reaction') // התנהגות
    dataToInsert.physical_symptoms = formData.get('physical_symptoms') // סימפטומים
  }

  if (journalType === 2 || journalType === 3) {
    dataToInsert.rational_response = formData.get('rational_response')
    dataToInsert.distortions = formData.getAll('distortions')
  }

  if (journalType === 3) {
    dataToInsert.belief_before = parseInt(formData.get('belief_before') as string || '0')
    dataToInsert.belief_after = parseInt(formData.get('belief_after') as string || '0')
  }

  const { error } = await supabase.from('cbt_journals').insert(dataToInsert)

  if (error) {
    console.error('Error:', error)
    return { error: error.message }
  }

  revalidatePath('/patient/journal')
  redirect('/patient/journal')
}
