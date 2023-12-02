import { Input } from 'antd'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import Header from '../../components/nav/Header'
import PostItem from './PostItem'
import UserInfo from './UserInfo'
import axios from '../../helper/axios'
import { getLocal, getUrlParams } from '../../utils/util'
import { UserContext } from '../../Provider/UserProvider/UserProvider'
import './Main.css'

let allPosts = []

export const hasAuth = () => getLocal('userInfo')?.username

const Main = () => {
  const { setUserInfo } = useContext(UserContext)

  const [posts, setPosts] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const getPosts = useCallback(async () => {
    allPosts = await axios.get('/mainarticles').then(response => {
      return response.data.articles
    })
    setPosts(allPosts)
  }, [])

  useEffect(() => {
    const getUserInfo = async () => {
      const params = getUrlParams(window.location.href)
      if (params?.user) {
        try {
          const res = await axios.get('/profile/' + params.user)
          console.log('res', res)
          setUserInfo(res.data.profile)
          getPosts()
        } catch (error) {}
      } else {
        getPosts()
      }
    }

    getUserInfo()
  }, [setUserInfo, getPosts])

  const onSearch = v => {
    if (!v) {
      setPosts(allPosts)
      return
    }
    const list = posts.filter(post => {
      const has =
        post.text.includes(v) ||
        post.author.includes(v) ||
        post.comments?.find(c => c.body.includes(v))
      return has
    })
    list.sort((a, b) => b.createTime - a.createTime)
    setPosts(list)
  }

  const onClear = async () => {
    setPosts(allPosts)
    setSearchValue('')
  }

  const onUpdatePosts = useCallback(post => {
    setPosts(posts => {
      return posts.map(v => {
        if (v._id === post._id) {
          return post
        }
        return v
      })
    })
  }, [])

  return (
    <div className='posts-container'>
      <Header />

      <div className='container'>
        <div className='slide-content'>
          <UserInfo />
        </div>

        <div className='main-content'>
          <div className='search-container'>
            <Input.Search
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder='Filter'
              onSearch={onSearch}
              size='large'
            />
            <CloseCircleOutlined onClick={onClear} className='clear-icon' />
          </div>

          <div className='post-items'>
            {posts.map(post => (
              <PostItem key={post._id} post={post} updatePosts={onUpdatePosts} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Main)
