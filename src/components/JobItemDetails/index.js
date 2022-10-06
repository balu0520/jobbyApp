import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {GrShare} from 'react-icons/gr'
import {FaSuitcase} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItems: [],
    similarJobItems: [],
  }

  componentDidMount() {
    this.getJobItems()
  }

  getSkills = skill => {
    const updatedSkill = skill.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    }))
    return updatedSkill
  }

  getLife = life => ({
    description: life.description,
    imageUrl: life.image_url,
  })

  getJobDetails = eachData => ({
    companyLogoUrl: eachData.company_logo_url,
    companyWebsiteUrl: eachData.company_website_url,
    employmentType: eachData.employment_type,
    id: eachData.id,
    jobDescription: eachData.job_description,
    skills: this.getSkills(eachData.skills),
    lifeAtCompany: this.getLife(eachData.life_at_company),
    location: eachData.location,
    packagePerAnnum: eachData.package_per_annum,
    rating: eachData.rating,
    title: eachData.title,
  })

  getJobItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getJobDetails(data.job_details)
      const updatedSkillsData = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobItems: updatedData,
        similarJobItems: updatedSkillsData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemFailureView = () => (
    <div className="job-item-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-icon"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="failure-btn" type="button" onClick={this.getJobItems}>
        Retry
      </button>
    </div>
  )

  renderJobItemLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSimilarJobs = () => {
    const {similarJobItems} = this.state

    return (
      <ul className="similar-jobs-list">
        {similarJobItems.map(eachSimilarItem => (
          <li className="similar-item" key={eachSimilarItem.id}>
            <div className="job-item-logo-details">
              <img
                src={eachSimilarItem.companyLogoUrl}
                alt="similar job company logo"
                className="job-item-logo"
              />
              <div className="job-item-details-logo">
                <h1 className="company-title">{eachSimilarItem.title}</h1>
                <div className="rating-container">
                  <BsFillStarFill className="star-icon" />
                  <p className="rating-para">{eachSimilarItem.rating}</p>
                </div>
              </div>
            </div>
            <h1 className="jobs-description">Description</h1>
            <p className="job-location-para">
              {eachSimilarItem.jobDescription}
            </p>
            <div className="jobs-location">
              <MdLocationOn className="job-location-icon" />
              <p className="job-location-para">{eachSimilarItem.location}</p>
              <FaSuitcase className="job-location-icon" />
              <p className="job-location-para">
                {eachSimilarItem.employmentType}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderJobItemSuccessView = () => {
    const {jobItems} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
      title,
    } = jobItems
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <div className="job-item-details-container">
          <div className="job-item-logo-details">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-logo"
            />
            <div className="job-item-details-logo">
              <h1 className="company-title">{title}</h1>
              <div className="rating-container">
                <BsFillStarFill className="star-icon" />
                <p className="rating-para">{rating}</p>
              </div>
            </div>
          </div>
          <div className="jobs-location-container">
            <div className="jobs-location">
              <MdLocationOn className="job-location-icon" />
              <p className="job-location-para">{location}</p>
              <FaSuitcase className="job-location-icon" />
              <p className="job-location-para">{employmentType}</p>
            </div>
            <p className="job-salary">{packagePerAnnum}</p>
          </div>
          <hr className="jobs-description-separator" />
          <div className="jobs-description-container">
            <h1 className="jobs-description">Description</h1>
            <div>
              <a href={companyWebsiteUrl} className="website-link">
                Visit
              </a>
              <GrShare className="share-icon" />
            </div>
          </div>
          <p className="job-location-para">{jobDescription}</p>
          <h1 className="jobs-description">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li className="skill-item" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-item-logo"
                />
                <p className="skill-item-description">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="jobs-description">Life at Company</h1>
          <div className="life-at-company">
            <p className="job-location-para">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-logo"
            />
          </div>
        </div>
        <div className="bg-container">
          <h1 className="jobs-description similar-heading">Similar Jobs</h1>
          {this.renderSimilarJobs()}
        </div>
      </>
    )
  }

  getItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobItemLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-items-container">{this.getItems()}</div>
      </>
    )
  }
}

export default JobItemDetails
