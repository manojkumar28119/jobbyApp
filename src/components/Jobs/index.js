import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'
import JobCard from '../JobCard'

import Header from '../Header'

import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  noJobs: 'NOJOBS',
}

class Jobs extends Component {
  state = {
    profileDetails: '',
    profileApiStatus: apiStatusConstants.inProgress,
    jobsApiStatus: apiStatusConstants.inProgress,
    jobDetails: [],
    employmentType: [],
    salaryRange: '',
    searchTitle: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {salaryRange, employmentType, searchTitle} = this.state
    console.log(employmentType)
    const type = employmentType.join(',')
    console.log(type)
    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${salaryRange}&search=${searchTitle}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      console.log(data)
      const {jobs} = data

      if (jobs.length !== 0) {
        const updatedJobDetails = jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }))

        this.setState({
          jobDetails: updatedJobDetails,
          jobsApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({jobsApiStatus: apiStatusConstants.noJobs})
      }
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details

      const updatedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryBtnProfile = () => {
    this.getProfileDetails()
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-bg">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderOnFailureProfile = () => (
    <div className="failure-profile-card">
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryBtnProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.renderOnFailureProfile()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onChangeEmployementType = event => {
    if (event.target.checked === true) {
      const typeValue = event.target.value
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, typeValue],
        }),
        this.getJobDetails,
      )
    } else {
      const {employmentType} = this.state

      const newList = employmentType

      if (employmentType.length > 1) {
        newList.pop(event.target.value)

        this.setState({employmentType: newList}, this.getJobDetails)
      } else {
        this.setState({employmentType: []}, this.getJobDetails)
      }
    }
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobDetails)
  }

  renderEmploymentTypeDetails = () => (
    <ul className="employment-type-card">
      <h1 className="employment-type-heading">Type of Employment</h1>
      <div className="checkbox-items-list-card">
        {employmentTypesList.map(each => (
          <li className="checkbox-item" key={each.employmentTypeId}>
            <input
              type="checkbox"
              id={each.employmentTypeId}
              value={each.employmentTypeId}
              className="checkbox"
              onChange={this.onChangeEmployementType}
            />
            <label htmlFor={each.employmentTypeId} className="checkbox-label">
              {each.label}
            </label>
          </li>
        ))}
      </div>
    </ul>
  )

  renderSalaryRangeDetails = () => (
    <div className="employment-type-card">
      <h1 className="employment-type-heading">Salary Range</h1>
      <ul className="checkbox-items-list-card">
        {salaryRangesList.map(each => (
          <div className="checkbox-item" key={each.salaryRangeId}>
            <input
              type="radio"
              id={each.salaryRangeId}
              value={each.salaryRangeId}
              className="checkbox"
              onChange={this.onChangeSalaryRange}
              name="salary"
            />
            <label htmlFor={each.salaryRangeId} className="checkbox-label">
              {each.label}
            </label>
          </div>
        ))}
      </ul>
    </div>
  )

  onClickRetryBtn = () => {
    this.getJobDetails()
  }

  renderOnFailureJobApi = () => (
    <div className="failure-page">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderOnNoJobs = () => (
    <div className="failure-page">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
        alt="no jobs"
        className="failure-img"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsDetails = () => {
    const {jobDetails, jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return (
          <ul className="jobs-list">
            {jobDetails.map(each => (
              <JobCard jobDetails={each} key={each.id} />
            ))}
          </ul>
        )
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderOnFailureJobApi()
      case apiStatusConstants.noJobs:
        return this.renderOnNoJobs()
      default:
        return null
    }
  }

  onChangeSearchQuery = event => {
    this.setState({searchTitle: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobDetails()
  }

  renderSearchBarDesktopView = () => {
    const {searchTitle} = this.state

    return (
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchQuery}
          value={searchTitle}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-btn"
          onClick={this.onClickSearchBtn}
        >
          <BsSearch className="search-icon" />.
        </button>
      </div>
    )
  }

  renderSearchBarMobileView = () => {
    const {searchTitle} = this.state

    return (
      <div className="search-container-mobile-view">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchQuery}
          value={searchTitle}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-btn"
          onClick={this.onClickSearchBtn}
        >
          <BsSearch className="search-icon" />.
        </button>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-page">
          <div className="job-page-container-1">
            {this.renderSearchBarMobileView()}
            <div className="left-side-card">
              {this.renderProfile()}
              <hr className="hr-line" />
              {this.renderEmploymentTypeDetails()}
              <hr className="hr-line" />
              {this.renderSalaryRangeDetails()}
            </div>
            <div className="right-side-card">
              {this.renderSearchBarDesktopView()}
              {this.renderJobsDetails()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
