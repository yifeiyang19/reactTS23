import { Button, Input, message } from 'antd'
import React, { useContext, useState, useRef } from 'react'
import { EditOutlined } from '@ant-design/icons'
import Header from '../../components/nav/Header'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import axios from '../../helper/axios'
import { BASE_URL } from '../../constants/constants'
import './Profile.css'

const Profile = () => {
  const { userInfo, setUserInfo } = useContext(UserContext)
  const [uploadImgUrl, setUploadImgUrl] = useState(userInfo.avatar)
  const fileInputRef = useRef()
  const [showUpdate, setShowUpdate] = useState(false)
  const [updateUserInfo, setUpdateUserInfo] = useState(userInfo || {})

  const onFileChange = async e => {
    if (e.target.files.length) {
      const [file] = e.target.files
      const imgFormData = new FormData()
      imgFormData.append('image', file)
      const imgRes = await axios.post('/upload', imgFormData)
      const imageUrl = imgRes.data.imageUrl
      setUploadImgUrl(imageUrl)
    }
  }

  const onUpdate = () => {
    setShowUpdate(!showUpdate)
    setUpdateUserInfo({ ...userInfo, phone: userInfo.phone?.split('x')[0] })
  }

  const onChange = (key, value) => {
    setUpdateUserInfo(v => ({ ...v, [key]: value }))
  }

  const handleUpdate = async () => {
    if (!/^[A-Za-z][-A-Za-z0-9]*$/.test(updateUserInfo.username)) {
      message.error('Only letters and digits can exist and must start with a letter')
      return
    }

    if (!updateUserInfo.password) {
      message.error('Please enter the correct password')
      return
    }

    let currentUserInfo = { ...updateUserInfo, avatar: uploadImgUrl }

    await axios.put('/user', currentUserInfo)

    message.success('Update Successfully')
    setUserInfo(currentUserInfo)
    setShowUpdate(false)
  }

  return (
    <div>
      <Header />

      <div className='profile-container'>
        <div>
          <div className='avatar-wrapper'>
            <img src={BASE_URL + uploadImgUrl} alt='' className='profile-avatar' />
            <div className='update-avatar'>
              {/* <Button
                className='update-avatar-btn'
                type='link'
                onClick={() => fileInputRef.current.click()}
              >
                Update the image
              </Button> */}

              {/* <div onClick={onUpdate}>
                <EditOutlined className='edit-icon' />
                <span className='update-span'>Update</span>
              </div> */}
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={onFileChange}
              className='hide'
            />
          </div>

          <div className='basic-info'>
            <div className='item'>
              <div className='name'>Username:</div>
              <div className='item-info'>{userInfo.username}</div>
            </div>
            {/* <div className='item'>
              <div className='name'>Password:</div>
              {showUpdate ? (
                <Input.Password
                  value={updateUserInfo.password}
                  onChange={e => onChange('street', e.target.value)}
                  className='update-input'
                />
              ) : (
                <div className='item-info'>{userInfo.password?.replace(/[0-9a-zA-Z]/g, '*')}</div>
              )}
            </div> */}

            {/* <div className='item'>
              <Button type='primary' className='update-btn' onClick={handleUpdate}>
                Update
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Profile)
