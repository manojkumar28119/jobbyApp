import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-card-link">
      <div className="job-details-card">
        <div className="c-logo-and-title-card">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
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
          <div className="package-text">{packagePerAnnum}</div>
        </div>
        <hr className="hr-line" />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobCard
