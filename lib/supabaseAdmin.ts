import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// בדיקה האם המשתנים קיימים
if (!supabaseUrl) console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL')
if (!supabaseServiceRoleKey) console.error('❌ Error: Missing SUPABASE_SERVICE_ROLE_KEY')

// יצירת הקליינט רק אם יש מפתחות, אחרת מחזירים null (כדי לא לקרוס מיידית)
export const supabaseAdmin = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null
