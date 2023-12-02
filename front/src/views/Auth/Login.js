import React, { useContext } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import { useHistory } from 'react-router'
import axios from '../../helper/axios'

const Login = () => {
  let { setUserInfo } = useContext(UserContext)

  const history = useHistory()

  const onFinish = values => {
    const { userName, password } = values

    let loginUser = {
      username: userName,
      password
    }

    const hide = message.loading('Logging in..')
    axios
      .post('/login', loginUser)
      .then(async res => {
        const { avatar, role } = res.data
        setUserInfo({ ...loginUser, avatar, role })
        hide()
        message.success('Login successfully')
        history.push('/books')
      })
      .catch(err => {
        if (err?.response?.status === 401) {
          message.error('Something wrong with your username or password. Please try again')
        } else if (err.response.status === 400) {
          message.error('No Username or Password input')
        }else{
          message.error('Wrong user name or password')
        }
      })
  }

  return (
    <div>
      <div className='login-title'>Log In</div>
      <Form className='login-form' onFinish={onFinish} autoComplete='off' layout='vertical'>
        <Form.Item
          label='Username'
          name='userName'
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className='login-item'>
          <Button type='primary' htmlType='submit'>
            Log In
          </Button>

          <Button type='link' className='register-btn' onClick={() => history.push('/register')}>
            Register
          </Button>
          <br />
          <br />
        </Form.Item>
      </Form>
    </div>
  )
}

export default React.memo(Login)
