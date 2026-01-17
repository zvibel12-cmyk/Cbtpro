export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import PatientView from './PatientView'

export default async function PatientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { id } = params
  const now = new Date().toISOString()

  // 1. נתונים בסיסיים
  const { data: patient } = await supabase.from('profiles').select('*').eq('id', id).single()
  
  // 2. פגישות (עתידיות ועבר - לצורך חישוב)
  const { data: allAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .order('start_time', { ascending: false }) // מהחדש לישן

  const futureAppointments = allAppointments?.filter(a => a.start_time > now).reverse() || [] // הופכים כדי שיהיה מהקרוב לרחוק
  const lastAppointment = allAppointments?.find(a => a.start_time < now) // הפגישה האחרונה שהייתה

  // 3. סיכומי פגישות
  const { data: notes } = await supabase
    .from('session_notes')
    .select('*')
    .eq('patient_id', id)
    .order('created_at', { ascending: false })

  // 4. יומנים והגדרות
  let { data: settings } = await supabase.from('patient_journal_settings').select('*').eq('patient_id', id).single()
  if (!settings) settings = {} // מניעת קריסה אם אין הגדרות

  // שליפת יומנים (רק אם יש אישור, אחרת מערך ריק)
  let journals: any[] = []
  if (settings?.share_with_therapist) {
     const { data } = await supabase.from('cbt_journals').select('*').eq('patient_id', id).order('created_at', { ascending: false })
     journals = data || []
  }

  // --- חישוב מדד מילוי יומנים (הלוגיקה החכמה) ---
  let journalsSinceLastAppt = 0
  let journalTypesFilled = new Set()
  
  if (lastAppointment) {
    const lastApptTime = new Date(lastAppointment.start_time).getTime()
    
    journals.forEach(j => {
      const journalTime = new Date(j.created_at).getTime()
      if (journalTime > lastApptTime) {
        journalsSinceLastAppt++
        journalTypesFilled.add(j.journal_type)
      }
    })
  } else {
    // אם מעולם לא הייתה פגישה, נספור הכל
    journalsSinceLastAppt = journals.length
    journals.forEach(j => journalTypesFilled.add(j.journal_type))
  }

  const stats = {
    count: journalsSinceLastAppt,
    types: Array.from(journalTypesFilled), // [1, 3] למשל
    lastApptDate: lastAppointment?.start_time || null
  }

  return (
    <PatientView 
      patientId={id}
      patient={patient}
      futureAppointments={futureAppointments}
      notes={notes || []} 
      journals={journals}
      settings={settings}
      stats={stats}
    />
  )
}
