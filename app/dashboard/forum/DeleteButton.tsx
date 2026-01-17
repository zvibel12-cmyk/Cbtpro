'use client'

import { Trash2 } from 'lucide-react'
import { deletePost, deleteComment } from './actions'
import { useFormStatus } from 'react-dom'

function TrashIcon() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className="text-slate-400 hover:text-red-600 transition disabled:opacity-50">
      <Trash2 size={16} />
    </button>
  )
}

export default function DeleteButton({ type, id, postId }: { type: 'post' | 'comment', id: string, postId?: string }) {
  const action = type === 'post' ? deletePost : deleteComment

  return (
    <form action={action} onSubmit={(e) => {
      if (!confirm('האם אתה בטוח שברצונך למחוק? פעולה זו אינה הפיכה.')) {
        e.preventDefault()
      }
    }}>
      {type === 'post' ? <input type="hidden" name="postId" value={id} /> : (
        <>
          <input type="hidden" name="commentId" value={id} />
          <input type="hidden" name="postId" value={postId} />
        </>
      )}
      <TrashIcon />
    </form>
  )
}
