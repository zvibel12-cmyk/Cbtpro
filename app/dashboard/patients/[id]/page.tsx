export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import PatientView from './PatientView'

export default async function PatientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { id } = params

  // 1. נתונים בסיסיים
  const { data: patient } = await supabase.from('profiles').select('*').eq('id', id).single()
  const { data: appointments } = await supabase.from('appointments').select('*').eq('patient_id', id).order('start_time', { ascending: true })
  
  // 2. הגדרות ויומנים
  let { data: settings } = await supabase.from('patient_journal_settings').select('*').eq('patient_id', id).single()
  if (!settings) settings = {}

  let journals: any[] = []
  if (settings?.share_with_therapist) {
     const { data } = await supabase.from('cbt_journals').select('*').eq('patient_id', id).order('created_at', { ascending: false })
     journals = data || []
  }

  // 3. שליחת הכל לתצוגה
  return (
    <PatientView 
      patientId={id}
      patient={patient}
      appointments={appointments}
      notes={[]} 
      journals={journals}
      settings={settings}
    />
  )
}
