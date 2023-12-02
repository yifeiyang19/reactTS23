import { createContext, useState, useCallback, useContext } from 'react'
import { getLocal, setLocal } from '../../utils/util'

export const useUserContext = () => useContext(UserContext)
export const UserContext = createContext({ users: [], userInfo: {} ,userAvatarInfos:{}})

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([])

  /**
   * currentUserInfo
   */
  const [userInfo, updateUserInfo] = useState(getLocal('userInfo') ?? {})
  const [userAvatarInfos, updateUserAvatarInfos] = useState({})

  const addUser = user =>
    setUsers(users => {
      setLocal('users', [...users, user])
      return [...users, user]
    })

  const setUserInfo = useCallback(user => {
    updateUserInfo(user)
    setLocal('userInfo', user)
  }, [])

  const updateUsers = useCallback(users => {
    setUsers(users)
    setLocal('users', users)
  }, [])

  const setUserAvatarInfos = useCallback(info => {
    updateUserAvatarInfos(info)
  }, [])

  return (
    <UserContext.Provider
      value={{
        users,
        userInfo,
        userAvatarInfos,
        addUser,
        setUserInfo,
        updateUsers,
        setUserAvatarInfos
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
