import React, { useContext, useState } from 'react'
import { Input, Button } from 'antd'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import { EditOutlined } from '@ant-design/icons'
import axios from 'axios'

const UserInfo = () => {
  const { userInfo, setUserInfo } = useContext(UserContext)

  const [userStatus, setUserStatus] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const BASE_URL = 'http://localhost:3000'

  const onSave = () => {
    setIsEditing(false)
    axios.put(BASE_URL + '/headline', { headline: userStatus }, { withCredentials: true })
    setUserInfo({
      ...userInfo,
      headline: userStatus
    })
  }

  return (
    <div className='user-info-wrapper'>
      <img src={BASE_URL + userInfo.avatar} alt='' className='avatar-img' />
      <div className='user-info-name'>
        <div>{userInfo.username}</div>
        <div className='status'>
          love reading
          {/* {isEditing ? (
            <Input
              className='user-status-input'
              onChange={e => setUserStatus(e.target.value)}
              value={userStatus}
            />
          ) : (
            userInfo.headline
          )} */}
          {/* {isEditing ? (
            <Button type='primary' className='save-btn' onClick={onSave}>
              Save
            </Button>
          ) : (
            <EditOutlined
              className='edit-user-status'
              onClick={() => {
                setUserStatus(userInfo.headline)
                setIsEditing(true)
              }}
            />
          )} */}
        </div>
      </div>
    </div>
  )
}

export default React.memo(UserInfo)
