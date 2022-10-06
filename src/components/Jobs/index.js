import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'

import './index.css'

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
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    apiStatusProfile: apiStatusConstants.initial,
    jobsData: [],
    profileData: [],
    activeEmploymentId: [],
    activeSalaryRangeId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJob()
  }

  getJob = async () => {
    const {activeEmploymentId, activeSalaryRangeId, searchInput} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const employee = activeEmploymentId.join(',')
    let apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employee}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    if (activeEmploymentId === '' && activeSalaryRangeId !== '') {
      apiUrl = `https://apis.ccbp.in/jobs?minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    }
    if (activeEmploymentId !== '' && activeSalaryRangeId === '') {
      apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employee}&search=${searchInput}`
    }
    if (activeEmploymentId !== '' && activeSalaryRangeId !== '') {
      apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employee}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    }
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsData: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  getProfileDetails = eachProfile => ({
    name: eachProfile.name,
    profileImageUrl: eachProfile.profile_image_url,
    shortBio: eachProfile.short_bio,
  })

  getProfile = async () => {
    this.setState({apiStatusProfile: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getProfileDetails(data.profile_details)
      this.setState({
        profileData: updatedData,
        apiStatusProfile: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatusProfile: apiStatusConstants.failure})
    }
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-icon" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-para">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickProRetry = () => {
    this.setState(
      {apiStatusProfile: apiStatusConstants.inProgress},
      this.getProfile,
    )
  }

  renderProfileFailureView = () => (
    <div className="loader-container">
      <button className="jobs-btn" type="button" onClick={this.onClickProRetry}>
        Retry
      </button>
    </div>
  )

  onClickRetryJob = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getJob)
  }

  renderJobDetailsFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-icon"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="jobs-btn" onClick={this.onClickRetryJob}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobsData} = this.state
    const res = jobsData.length === 0
    if (res) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="job-result-container">
        {jobsData.map(eachData => (
          <li className="job-item" key={eachData.id}>
            <Link
              to={`/jobs/${eachData.id}`}
              className="nav-link"
              title={eachData.title}
            >
              <div className="logo-description">
                <div className="logo-container">
                  <img
                    src={eachData.companyLogoUrl}
                    alt="company logo"
                    className="logo"
                  />
                  <div className="company-name">
                    <h1 className="company-title">{eachData.title}</h1>
                    <div className="rating-container">
                      <BsFillStarFill
                        className="star-icon"
                        testid="searchButton"
                      />
                      <p className="rating-para">{eachData.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="jobs-location-container">
                  <div className="jobs-location">
                    <MdLocationOn className="job-location-icon" />
                    <p className="job-location-para">{eachData.location}</p>
                    <FaSuitcase className="job-location-icon" />
                    <p className="job-location-para">
                      {eachData.employmentType}
                    </p>
                  </div>
                  <h1 className="job-salary">{eachData.packagePerAnnum}</h1>
                </div>
                <hr className="jobs-description-separator" />
                <h1 className="jobs-description">Description</h1>
                <p className="job-location-para">{eachData.jobDescription}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  onChangeCheckBox = check => {
    const {activeEmploymentId} = this.state
    const employeeId = activeEmploymentId.filter(eachEmp => eachEmp !== check)
    this.setState({activeEmploymentId: employeeId}, this.getJob)
  }

  onChangeCheckBoxCh = check => {
    this.setState(
      prevState => ({
        activeEmploymentId: [...prevState.activeEmploymentId, check],
      }),
      this.getJob,
    )
  }

  onChangeRadio = radio => {
    this.setState({activeSalaryRangeId: radio}, this.getJob)
  }

  renderProfile = () => {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-filter-container">
            {this.renderProfile()}
            <hr className="separator" />
            <FiltersGroup
              employmentList={employmentTypesList}
              salaryList={salaryRangesList}
              onChangeCheckBoxCh={this.onChangeCheckBoxCh}
              onChangeCheckBox={this.onChangeCheckBox}
              onChangeRadio={this.onChangeRadio}
            />
          </div>
          <div className="search-filters-list">
            <div className="input-search-container">
              <input
                type="search"
                value={searchInput}
                className="input-search"
                onChange={this.onChangeSearch}
                placeholder="Search"
              />
              <button
                type="button"
                className="search-btn"
                onClick={this.getJob}
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobDetails()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
