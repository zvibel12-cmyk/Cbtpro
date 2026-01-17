export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import PatientView from './PatientView'

export default async function PatientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { id } = params
  const now = new Date().toISOString()

  // 1. שליפת פרופיל
  const { data: patient } = await supabase.from('profiles').select('*').eq('id', id).single()

  // 2. שליפת פגישות
  const { data: allAppts } = await supabase.from('appointments').select('*').eq('patient_id', id).order('start_time', { ascending: false })
  const futureAppointments = allAppts?.filter(a => a.start_time > now).reverse() || []
  const lastAppointment = allAppts?.find(a => a.start_time < now)

  // 3. שליפת סיכומים
  const { data: notes } = await supabase.from('session_notes').select('*').eq('patient_id', id).order('created_at', { ascending: false })

  // 4. הגדרות ויומנים
  let { data: settings } = await supabase.from('patient_journal_settings').select('*').eq('patient_id', id).single()
  if (!settings) settings = {}

  let journals: any[] = []
  if (settings?.share_with_therapist) {
     const { data } = await supabase.from('cbt_journals').select('*').eq('patient_id', id).order('created_at', { ascending: false })
     journals = data || []
  }

  // 5. חישוב סטטיסטיקה
  let count = 0
  let types = new Set()
  if (lastAppointment) {
    const lastTime = new Date(lastAppointment.start_time).getTime()
    journals.forEach(j => { if (new Date(j.created_at).getTime() > lastTime) { count++; types.add(j.journal_type) } })
  } else {
    count = journals.length
    journals.forEach(j => types.add(j.journal_type))
  }

  return (
    <PatientView 
      patientId={id}
      patient={patient}
      futureAppointments={futureAppointments}
      notes={notes || []}
      journals={journals}
      settings={settings}
      stats={{ count, types: Array.from(types) }}
    />
  )
}
