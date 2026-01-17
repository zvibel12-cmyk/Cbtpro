'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function createPost(formData: FormData) {
  console.log('🚀 [Server Action] התחילה פעולת יצירת פוסט')

  const supabase = createClient()
  
  // בדיקת משתמש
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error('❌ [Server Action] משתמש לא מחובר או שגיאת אימות')
    return { error: 'User not authenticated' }
  }
  console.log('👤 [Server Action] משתמש מזוהה:', user.id)

  // שליפת נתונים
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string

  console.log('📝 [Server Action] מנסה לשמור:', { title, category })

  // שמירה
  const { data, error } = await supabase.from('forum_posts').insert({
    author_id: user.id,
    title: title,
    content: content,
    category: category,
    views: 0
  }).select()

  if (error) {
    console.error('❌ [Server Action] שגיאת DB קריטית:', error.message)
    console.error('פרטים:', error)
    return { error: error.message }
  }

  console.log('✅ [Server Action] נשמר בהצלחה!', data)
  revalidatePath('/dashboard/forum')
  return { success: true }
}

export async function createComment(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const postId = formData.get('postId') as string
  const content = formData.get('content') as string

  const { error } = await supabase.from('forum_comments').insert({
    post_id: postId,
    author_id: user.id,
    content: content
  })

  if (error) {
    console.error('❌ Error creating comment:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/forum/${postId}`)
  return { success: true }
}
