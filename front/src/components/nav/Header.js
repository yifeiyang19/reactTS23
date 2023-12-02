import { useContext } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import axios from '../../helper/axios'
import { IDENTITY } from '../../constants/constants'
import './Header.css'

const Header = () => {
  const history = useHistory()
  const { userInfo, setUserInfo } = useContext(UserContext)

  const logout = async () => {
    try {
      await axios.put('/logout')
      setUserInfo({})
      window.axiosCancel.forEach(ele => {
        ele.cancel('Request cancelled')
      })
      window.axiosCancel = []

      history.replace('/')
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className='header-container'>
      <Link to='/books' className='title'>
        Book Review Club
      </Link>
      <div className='user-right'>
        <NavLink className='action' to='/books'>
          Books
        </NavLink>

        {userInfo.role === IDENTITY.ADMIN ? (
          <NavLink to='/upload' className='action'>
            Upload
          </NavLink>
        ) : null}

        <NavLink to='/about' className='action'>
          About
        </NavLink>
        <NavLink className='action' to='/profile'>
          Profile
        </NavLink>

        <span className='action' onClick={logout}>
          Logout
        </span>
      </div>
    </div>
  )
}

export default Header
