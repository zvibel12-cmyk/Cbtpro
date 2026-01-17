export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { MessageSquare, Hash, Clock } from 'lucide-react'
import NewPostForm from './NewPostForm'

export default async function ForumPage() {
  const supabase = createClient()
  
  // שליפה פשוטה (select *) ללא join לפרופילים
  const { data: posts, error } = await supabase
    .from('forum_posts')
    .select('*') 
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">הפורום המקצועי</h1>
          <p className="text-slate-500">קהילת המטפלים - התייעצות, שיתוף ולמידה</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3 text-sm">נושאים חמים</h3>
              <ul className="space-y-2 text-sm">
                {['התייעצות קלינית', 'כלים וטכניקות', 'ניהול קליניקה', 'אתיקה', 'הפניות'].map(cat => (
                  <li key={cat} className="flex items-center gap-2 text-slate-600 hover:text-primary-600 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition">
                    <Hash size={14} /> {cat}
                  </li>
                ))}
              </ul>
           </div>
        </div>

        <div className="lg:col-span-3">
          <NewPostForm />
          
          <div className="mb-2 text-xs text-slate-400">
             סטטוס מערכת: נמצאו {posts?.length || 0} פוסטים
          </div>

          <div className="space-y-4">
            {posts?.map((post: any) => (
              <Link href={`/dashboard/forum/${post.id}`} key={post.id} className="block bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg border border-blue-100">
                    {post.category || 'כללי'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(post.created_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-700 transition">{post.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                  {post.content}
                </p>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">?</div>
                    מחבר הפוסט
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                    <MessageSquare size={14} /> כנס לדיון
                  </div>
                </div>
              </Link>
            ))}

            {(!posts || posts.length === 0) && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-600">הפורום שקט כרגע</h3>
                <p className="text-slate-400">לא נמצאו פוסטים להצגה.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
