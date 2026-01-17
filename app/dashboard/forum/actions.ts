'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

// --- יצירה ---
export async function createPost(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'User not authenticated' }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string

  const { error } = await supabase.from('forum_posts').insert({
    author_id: user.id,
    title, content, category, views: 0
  })

  if (error) return { error: error.message }
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
    post_id: postId, author_id: user.id, content
  })

  if (error) return { error: error.message }
  revalidatePath(`/dashboard/forum/${postId}`)
  return { success: true }
}

// --- מחיקה ---
export async function deletePost(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const postId = formData.get('postId') as string

  // מחיקה רק אם אתה המחבר
  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id) // אבטחה: מוודא שזה הפוסט שלך

  if (error) return { error: 'Failed to delete' }
  
  revalidatePath('/dashboard/forum')
  redirect('/dashboard/forum') // חזרה לראשי אחרי מחיקה
}

export async function deleteComment(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const commentId = formData.get('commentId') as string
  const postId = formData.get('postId') as string

  const { error } = await supabase
    .from('forum_comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id)

  if (error) return { error: 'Failed to delete' }
  
  revalidatePath(`/dashboard/forum/${postId}`)
  return { success: true }
}
