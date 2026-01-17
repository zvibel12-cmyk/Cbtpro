export const dynamic = 'force-dynamic' // חובה!
export const revalidate = 0

import { createClient } from '@/lib/supabase-server'
import { createComment } from '../actions'
import { ArrowRight, MessageSquare, Clock, Send } from 'lucide-react'
import Link from 'next/link'

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const postId = params.id

  const { data: post } = await supabase
    .from('forum_posts')
    .select('*, profiles:author_id(full_name)')
    .eq('id', postId)
    .single()

  const { data: comments } = await supabase
    .from('forum_comments')
    .select('*, profiles:author_id(full_name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (!post) return <div className="p-10 text-center">הדיון לא נמצא או נמחק</div>

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <Link href="/dashboard/forum" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition text-sm font-bold">
        <ArrowRight size={16} /> חזרה לכל הדיונים
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex gap-2 mb-4">
           <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              {post.category}
           </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">{post.title}</h1>
        <div className="prose max-w-none text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
          {post.content}
        </div>
        
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
           <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-700 font-bold text-lg">
              {post.profiles?.full_name?.[0]}
           </div>
           <div>
              <div className="font-bold text-slate-800 text-sm">{post.profiles?.full_name}</div>
              <div className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString('he-IL')}</div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
           <MessageSquare size={20} className="text-primary-600" /> 
           {comments?.length || 0} תגובות
        </h3>

        {comments?.map((comment: any) => (
          <div key={comment.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
             <div className="w-8 h-8 bg-primary-50 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {comment.profiles?.full_name?.[0]}
             </div>
             <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                   <span className="font-bold text-sm text-slate-800">{comment.profiles?.full_name}</span>
                   <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
             </div>
          </div>
        ))}

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6">
           <h4 className="font-bold text-slate-700 mb-3 text-sm">הוסף תגובה</h4>
           <form action={createComment as any} className="flex gap-4">
             <input type="hidden" name="postId" value={postId} />
             <input name="content" required placeholder="כתוב תגובה..." className="flex-1 p-4 bg-white border border-slate-200 rounded-xl focus:border-primary-500 outline-none" />
             <button className="bg-slate-900 text-white px-6 rounded-xl hover:bg-slate-800 transition flex items-center justify-center">
               <Send size={20} />
             </button>
           </form>
        </div>
      </div>
    </div>
  )
}
