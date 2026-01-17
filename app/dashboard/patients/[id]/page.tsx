export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import PatientView from './PatientView'

export default async function PatientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { id } = params
  const now = new Date().toISOString()

  // שליפות מקביליות לביצועים טובים
  const [patientRes, apptRes, notesRes, settingsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('appointments').select('*').eq('patient_id', id).order('start_time', { ascending: false }),
    supabase.from('session_notes').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
    supabase.from('patient_journal_settings').select('*').eq('patient_id', id).single()
  ])

  const patient = patientRes.data
  const allAppts = apptRes.data || []
  const futureAppointments = allAppts.filter(a => a.start_time > now).reverse()
  const notes = notesRes.data || []
  let settings = settingsRes.data || {}

  let journals = []
  if (settings.share_with_therapist) {
    const { data } = await supabase.from('cbt_journals').select('*').eq('patient_id', id).order('created_at', { ascending: false })
    journals = data || []
  }

  // חישוב סטטיסטיקה
  const lastAppt = allAppts.find(a => a.start_time < now)
  let count = 0
  const lastTime = lastAppt ? new Date(lastAppt.start_time).getTime() : 0
  journals.forEach(j => { if (new Date(j.created_at).getTime() > lastTime) count++ })

  return <PatientView patient={patient} futureAppointments={futureAppointments} notes={notes} journals={journals} settings={settings} stats={{ count }} patientId={id} />
}
