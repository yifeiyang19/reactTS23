import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import UserProvider from './Provider/UserProvider/UserProvider'
import Auth from './views/Auth/Landing'
import Profile from './views/Profile/Profile'
import Main from './views/Main/Main'
import Upload from './views/Upload/Upload'
import About from './views/About/About'
import Register from './views/Auth/Register'

import './App.css'

function App() {
  return (
    <div className='App'>
      <UserProvider>
        <Router>
          <Switch>
            <Route exact path='/' component={Auth} />
            <Route path='/profile' exact component={Profile} />
            <Route path='/books' exact component={Main} />
            <Route path='/about' exact component={About} />
            <Route path='/upload' exact component={Upload} />
            <Route path='/register' exact component={Register} />
          </Switch>
        </Router>
      </UserProvider>
    </div>
  )
}

export default React.memo(App)
