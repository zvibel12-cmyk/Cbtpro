export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { adminDeletePost } from '../actions'
import { Trash2 } from 'lucide-react'

export default async function ForumAdmin() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('forum_posts')
    .select('*, profiles:author_id(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">ניהול תוכן פורום</h1>

      <div className="grid gap-4">
        {posts?.map((post: any) => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
             <div>
               <h3 className="font-bold text-slate-800 text-lg">{post.title}</h3>
               <p className="text-slate-500 text-sm line-clamp-1 mb-2">{post.content}</p>
               <div className="flex gap-4 text-xs text-slate-400">
                 <span>מאת: {post.profiles?.full_name}</span>
                 <span>קטגוריה: {post.category}</span>
                 <span>תאריך: {new Date(post.created_at).toLocaleDateString('he-IL')}</span>
               </div>
             </div>
             
             <form action={adminDeletePost}>
               <input type="hidden" name="postId" value={post.id} />
               <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition flex items-center gap-2">
                 <Trash2 size={14} /> מחיקה מנהלתית
               </button>
             </form>
          </div>
        ))}
      </div>
    </div>
  )
}
