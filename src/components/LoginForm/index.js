import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errMsg: '', showSubmitError: false}

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    console.log(jwtToken)
    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onFailureLogin = errMsg => {
    this.setState({errMsg, showSubmitError: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      this.onSuccessLogin(data.jwt_token)
    } else {
      const data = await response.json()
      this.onFailureLogin(data.error_msg)
    }
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUserNameLabel = () => (
    <div className="input-container">
      <label htmlFor="userInput" className="label-name">
        USERNAME
      </label>
      <input
        type="text"
        id="userInput"
        className="input-login"
        placeholder="Username"
        onChange={this.onChangeUserName}
      />
    </div>
  )

  renderUserPasswordLabel = () => (
    <div className="input-container">
      <label htmlFor="passInput" className="label-name">
        PASSWORD
      </label>
      <input
        type="password"
        id="passInput"
        className="input-login"
        placeholder="Password"
        onChange={this.onChangePassword}
      />
    </div>
  )

  render() {
    const {showSubmitError, errMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
          {this.renderUserNameLabel()}
          {this.renderUserPasswordLabel()}
          <button className="login-btn" type="submit">
            Login
          </button>
          <div className="err-card">
            {showSubmitError && <p className="error-msg">*{errMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default LoginForm
