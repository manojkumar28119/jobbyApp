import Cookies from 'js-cookie'
import {Component} from 'react'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: '',
    similarJobs: '',
    jobDetailsStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobDetailsStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jobApiUrl = `https://apis.ccbp.in/jobs/${id}`
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

      const each = data.job_details

      const updatedJobDetails = {
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        companyWebsiteUrl: each.company_website_url,
        skills: each.skills,
        lifeAtCompany: each.life_at_company,
      }

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: data.similar_jobs,
        jobDetailsStatus: apiStatusConstants.success,
      })

      console.log(updatedJobDetails)
    } else {
      this.setState({jobDetailsStatus: apiStatusConstants.failure})
    }

    console.log(response)
  }

  renderSkillsList = () => {
    const {jobDetails} = this.state
    const {skills} = jobDetails

    return (
      <ul className="skills-list-card">
        {skills.map(each => (
          <div className="skill-item-card" key={each.name}>
            <img src={each.image_url} alt={each.name} className="skill-img" />
            <li className="skill-text">{each.name}</li>
          </div>
        ))}
      </ul>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    const updatedSimilarJobs = similarJobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    }))

    return (
      <div className="similar-jobs-container">
        <h1 className="sim-jobs-h1">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {updatedSimilarJobs.map(each => (
            <SimilarJobItem similarJob={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
      lifeAtCompany,
    } = jobDetails

    console.log(similarJobs)

    return (
      <div className="job-item-details">
        <div className="job-item-details-card-1">
          <div className="c-logo-and-title-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <p className="job-title">{title}</p>
              <div className="icon-rating-container">
                <FaStar className="icon-star" />
                <p className="company-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-nd-emp-type-card">
            <div className="icon-text-card">
              <IoLocationSharp className="icon-for-job-card" />
              <p className="job-loc-type-text">{location}</p>
            </div>
            <div className="icon-text-card">
              <BsBriefcaseFill className="icon-for-job-card" />
              <p className="job-loc-type-text">{employmentType}</p>
            </div>
            <div className="package-text">
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="description-nd-link">
            <h1 className="description-item-details-h1">Description</h1>
            <a href={companyWebsiteUrl} className="company-website-link">
              Visit
              <FaExternalLinkAlt className="icon-link" />
            </a>
          </div>
          <p className="job-description-item">{jobDescription}</p>
          <div>
            <h1 className="skill-heading">Skills</h1>
            {this.renderSkillsList()}
            <div className="life-at-com-card">
              <div className="life-at-com-card-sub">
                <h1 className="skill-heading">Life at Company</h1>
                <p className="job-description-item">
                  {lifeAtCompany.description}
                </p>
              </div>
              <img
                src={lifeAtCompany.image_url}
                alt="life at company"
                className="company-life-img"
              />
            </div>
          </div>
        </div>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container-job-details" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
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

  renderJobItemDetails = () => {
    const {jobDetailsStatus} = this.state

    console.log(jobDetailsStatus)

    switch (jobDetailsStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderOnFailureJobApi()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobItemDetails()}
      </>
    )
  }
}

export default JobItemDetails
