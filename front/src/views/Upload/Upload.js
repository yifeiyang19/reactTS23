import { Button, Input, message } from 'antd'
import React, { useRef, useState } from 'react'
import Header from '../../components/nav/Header'
import axios from '../../helper/axios'
import { BASE_URL } from '../../constants/constants'
import './upload.css'

const Upload = () => {
  const fileInputRef = useRef()
  const [title, setTitle] = useState('')
  const [editingText, setEditingText] = useState('')
  const [imgUrl, setImgUrl] = useState('')

  const onFileChange = async e => {
    if (e.target.files.length) {
      const [file] = e.target.files
      const imgFormData = new FormData()
      imgFormData.append('image', file)
      const imgRes = await axios.post('/upload', imgFormData)
      const imageUrl = imgRes.data.imageUrl
      setImgUrl(imageUrl)
    }
  }

  const onSubmit = async () => {
    if (!editingText) {
      message.warning('Please enter the content')
      return
    }

    try {
      const hide = message.loading('Uploading')
      await axios.post('/article', {
        title,
        text: editingText,
        imageUrl: imgUrl
      })
      hide()
      message.success('Added successfully')
    } catch (error) {}
    setImgUrl('')
    setEditingText('')
    setTitle('')
  }

  return (
    <>
      <Header />

      <div className='upload-container'>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder='Book title' />

        <Input.TextArea
          style={{ marginTop: 12 }}
          rows={5}
          value={editingText}
          onChange={e => setEditingText(e.target.value)}
          placeholder='Book content'
        />

        <div className='upload-action-wrapper'>
          {imgUrl ? (
            <img src={BASE_URL + imgUrl} className='upload-preview-img' />
          ) : (
            <Button onClick={() => fileInputRef.current.click()} type='primary' className='upload'>
              Upload cover
            </Button>
          )}

          <div>
            <Button type='primary' onClick={onSubmit} className='upload-action-button'>
              Submit
            </Button>
            <Button onClick={() => setEditingText('')} className='upload-action-button'>
              Reset
            </Button>
          </div>

          <input ref={fileInputRef} type='file' onChange={onFileChange} className='hide' />
        </div>
      </div>
    </>
  )
}

export default React.memo(Upload)
