'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveJournalEntry(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  // שליפת שדות בסיסיים
  const situation = formData.get('situation') as string
  const automatic_thoughts = formData.get('automatic_thoughts') as string
  const belief_before = formData.get('belief_before')
  const physical_symptoms = formData.get('physical_symptoms') as string
  const reaction = formData.get('reaction') as string
  
  // שליפת שדות מתקדמים
  const rational_response = formData.get('rational_response') as string
  const belief_after = formData.get('belief_after')
  
  // עיבוד רגשות (נבנה JSON מהשדות הדינמיים)
  const emotionsMap: Record<string, number> = {}
  // נניח שהטופס שולח שמות רגשות שנבחרו, ואנחנו מחפשים את העוצמה שלהם
  const selectedEmotions = formData.getAll('selected_emotions') as string[]
  selectedEmotions.forEach(emotion => {
    const intensity = formData.get(`intensity_${emotion}`)
    if (intensity) emotionsMap[emotion] = parseInt(intensity as string)
  })

  // עיבוד עיוותי חשיבה (מערך)
  const distortions = formData.getAll('distortions') as string[]

  const { error } = await supabase.from('cbt_journals').insert({
    patient_id: user.id,
    situation,
    automatic_thoughts,
    belief_before: belief_before ? parseInt(belief_before as string) : null,
    emotions: emotionsMap,
    physical_symptoms,
    reaction,
    rational_response,
    distortions,
    belief_after: belief_after ? parseInt(belief_after as string) : null,
  })

  if (error) {
    console.error('Error saving journal:', error)
    return { error: error.message }
  }

  revalidatePath('/patient/journal')
  redirect('/patient/journal')
}
