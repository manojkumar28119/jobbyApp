import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {similarJob} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJob

  return (
    <li className="similar-job-card">
      <div className="logo-nd-role-card">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="title-role">{title}</h1>
          <div className="icon-rating-container">
            <FaStar className="icon-star" />
            <p className="company-rating">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="des-heading">Description</h1>
        <p className="similar-job-description">{jobDescription}</p>
      </div>
      <div className="similar-jobs-loca-type-card">
        <div className="icon-text-card">
          <IoLocationSharp className="icon-for-job-card" />
          <p className="job-loc-type-text">{location}</p>
        </div>
        <div className="icon-text-card">
          <BsBriefcaseFill className="icon-for-job-card" />
          <p className="job-loc-type-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
