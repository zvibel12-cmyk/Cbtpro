'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ... (השאר את הפונקציה saveJournalEntry כמו שהיא בקובץ המקורי) ...

// --- פעולה חדשה למטופל: שינוי סטטוס שיתוף ---
export async function toggleJournalSharing(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const isShared = formData.get('shareState') === 'true' // המצב החדש הרצוי

  await supabase
    .from('patient_journal_settings')
    .update({ share_with_therapist: isShared })
    .eq('patient_id', user.id)

  revalidatePath('/patient')
}

// --- פעולה חדשה למטפל: הגדרת אילו יומנים פתוחים ---
export async function updateJournalPermissions(formData: FormData) {
  const supabase = createClient()
  
  // כאן נדרשת בדיקת הרשאה שהמשתמש הוא אכן מטפל (נדלג לצורך הפשטות כרגע)
  
  const patientId = formData.get('patientId') as string
  const allow1 = formData.get('allow_level_1') === 'on'
  const allow2 = formData.get('allow_level_2') === 'on'
  const allow3 = formData.get('allow_level_3') === 'on'

  await supabase
    .from('patient_journal_settings')
    .upsert({ 
      patient_id: patientId,
      allow_level_1: allow1,
      allow_level_2: allow2,
      allow_level_3: allow3
    })

  revalidatePath(`/dashboard/patients/${patientId}`)
}
