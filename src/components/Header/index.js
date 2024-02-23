import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'

import {BsBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    const {history} = props

    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <div className="nav-bar-container">
      <ul className="nav-bar">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
        </li>
        <li className="nav-content">
          <Link to="/" className="nav-link">
            <p className="nav-text">Home</p>
          </Link>
          <Link to="/jobs" className="nav-link">
            <p className="nav-text">Jobs</p>
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="logout-btn"
            onClick={onClickLogoutBtn}
          >
            Logout
          </button>
        </li>
        <ul className="nav-content-mobile-view">
          <Link to="/" className="nav-link">
            <AiFillHome className="icon-nav" />
          </Link>
          <Link to="/jobs" className="nav-link">
            <BsBriefcaseFill className="icon-nav" />
          </Link>
          <button type="button" className="icon-btn" onClick={onClickLogoutBtn}>
            <FiLogOut className="icon-nav" />.
          </button>
        </ul>
      </ul>
    </div>
  )
}

export default withRouter(Header)
