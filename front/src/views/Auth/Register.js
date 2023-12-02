import React, { useContext } from 'react'
import { Form, Input, Button, message, DatePicker, Radio } from 'antd'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import { useHistory } from 'react-router'
import axios from '../../helper/axios'

const Register = () => {
  let { setUserInfo } = useContext(UserContext)
  const history = useHistory()
  const [form] = Form.useForm()

  const onFinish = async user => {
    try {
      await axios.post('/register', user)
      message.success('Register Successfully')
      setUserInfo(user)
      history.push('/')
    } catch (error) {
      message.success('Register Failed')
    }
  }

  return (
    <div className='auth-container'>
      <div className='title'> Book Review Club </div>
      <div className='container'>
        <div>
          <div className='register-title'>Register</div>
          <Form
            name='register-form'
            className='register-form'
            form={form}
            onFinish={onFinish}
            autoComplete='off'
            layout='vertical'
          >
            <Form.Item
              label='Identity'
              name='role'
              className='role-radio-item'
              rules={[
                {
                  required: true,
                  message: 'Please choose identity'
                }
              ]}
            >
              <Radio.Group>
                <Radio value={0}>User</Radio>
                <Radio value={1}>Admin</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label='Username'
              name='username'
              rules={[
                {
                  required: true,
                  message: 'Please input your username'
                },
                {
                  pattern: /^[A-Za-z][-A-Za-z0-9]*$/,
                  message: 'Only letters and digits can exist and must start with a letter'
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder='password' />
            </Form.Item>

            <Form.Item
              name='confirm'
              label='Confirmation'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error("Passwords Don't Match. Please re-enter the password.")
                    )
                  }
                })
              ]}
            >
              <Input.Password placeholder='password confirmation' />
            </Form.Item>

            <Form.Item>
              <div className='register-item'>
                <Button type='primary' htmlType='submit'>
                  Register
                </Button>
                <Button className='reset-btn' onClick={() => form.resetFields()}>
                  Reset
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Register)
