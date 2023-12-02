import React, { useContext, useState } from 'react'
import { formatDate } from '../../utils/util'
import { EditOutlined } from '@ant-design/icons'
import { Button, Input, message } from 'antd'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import axios from '../../helper/axios'
import { BASE_URL, IDENTITY } from '../../constants/constants'

const Posts = ({ post, updatePosts }) => {
  const { userInfo } = useContext(UserContext)
  const [isEditing, setIsEditing] = useState(false)
  const [editingText, setEditingText] = useState(post.text)
  const [comment, setComment] = useState(post.comment || '')
  const [showAddComment, setShowAddComment] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState('')
  const [editingCommentContent, setEditingCommentContent] = useState('')

  const onSave = async () => {
    try {
      const res = await axios.put(
        '/articles/' + post._id,
        { text: editingText },
        { withCredentials: true }
      )
      const [article] = res.data.articles
      updatePosts(article)
    } catch (error) {}

    setIsEditing(false)
  }

  const onCancel = () => {
    setIsEditing(false)
  }

  const onSaveComment = async () => {
    if (comment) {
      try {
        const hide = message.loading('Saving...')
        const res = await axios.post('/comment', { text: comment, articleId: post._id })
        hide()
        const [article] = res.data.articles
        updatePosts(article)
      } catch (error) {}
    }
    setShowAddComment(false)
    setComment('')
  }

  const onShowEditComment = comment => {
    setEditingCommentId(comment._id)
    setEditingCommentContent(comment.body)
  }

  const onSaveEditComment = async () => {
    try {
      const res = await axios.put('/comment/' + post._id, {
        text: editingCommentContent,
        commentId: editingCommentId
      })
      const [article] = res.data.articles
      updatePosts(article)
    } catch (error) {}

    setEditingCommentId('')
    setEditingCommentContent('')
  }

  return (
    <div className='post-item'>
      <div className='post-title'>
        <div className='right'>
          <div>
            <div>{post.author}</div>
            <div>
              {formatDate(post.date, 'MM-DD-YYYY')} at {formatDate(post.date, 'HH:mm:ss')}
            </div>
          </div>
          {userInfo.username === post.author || userInfo.role === IDENTITY.ADMIN ? (
            <EditOutlined className='edit-icon' onClick={() => setIsEditing(true)} />
          ) : null}
        </div>
      </div>

      <div className='post-content'>
        <img className='post-img' src={BASE_URL + post.image} alt='' />
        <div className='item-title'>{post.title}</div>
        <div className='text'>
          {isEditing ? (
            <>
              <Input.TextArea
                rows={4}
                onChange={e => setEditingText(e.target.value)}
                value={editingText}
              />
              <Button className='save-btn' onClick={onSave} type='primary'>
                Update
              </Button>
              <Button className='cancel-btn' onClick={onCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: post.text?.replace(/\n/g, '<br/>') }} />
          )}

          <div className='comment-title'>Comment:</div>

          {post.comments && post.comments.length ? (
            <div className='comment-list'>
              {post.comments.map(c => (
                <div className='comment' key={c._id}>
                  {c.author} ({formatDate(c.date, 'MM-DD-YYYY')} at
                  {formatDate(c.date, 'HH:mm:ss')})：
                  {editingCommentId === c._id ? (
                    <Input
                      size='small'
                      className='comment-input'
                      value={editingCommentContent}
                      onChange={e => setEditingCommentContent(e.target.value)}
                    />
                  ) : (
                    c.body
                  )}
                  {post.author === userInfo.username && editingCommentId !== c._id ? (
                    <Button
                      type='primary'
                      className='edit-btn'
                      size='small'
                      onClick={() => onShowEditComment(c)}
                    >
                      Edit
                    </Button>
                  ) : null}
                  {editingCommentId === c._id ? (
                    <Button
                      size='small'
                      onClick={onSaveEditComment}
                      type='primary'
                      className='save-comment-btn'
                    >
                      Save
                    </Button>
                  ) : null}
                  {}
                </div>
              ))}
            </div>
          ) : null}

          <div className='comment-input'>
            {showAddComment ? (
              <>
                <Input onChange={e => setComment(e.target.value)} value={comment} />
                <Button className='save-btn' onClick={onSaveComment} type='primary'>
                  Save
                </Button>

                <Button
                  className='cancel-btn'
                  onClick={() => {
                    setShowAddComment(false)
                    setComment('')
                  }}
                  type='primary'
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button size='small' onClick={() => setShowAddComment(true)} type='primary'>
                Add commonet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Posts)
