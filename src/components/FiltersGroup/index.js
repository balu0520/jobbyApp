import './index.css'

const FiltersGroup = props => {
  const {
    employmentList,
    salaryList,
    onChangeCheckBox,
    onChangeCheckBoxCh,
    onChangeRadio,
  } = props

  const onChangeCheck = event => {
    if (event.target.checked) {
      onChangeCheckBoxCh(event.target.value)
    } else {
      onChangeCheckBox(event.target.value)
    }
  }

  const onClickRad = event => {
    console.log(event.target.value)
    onChangeRadio(event.target.value)
  }
  return (
    <div className="filter-container">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="employment-list">
        {employmentList.map(eachEmployee => (
          <li className="item" key={eachEmployee.employmentTypeId}>
            <input
              type="checkbox"
              value={eachEmployee.employmentTypeId}
              onChange={onChangeCheck}
              id={eachEmployee.employmentTypeId}
              className="input-checkbox"
            />
            <label
              className="label-checkbox"
              htmlFor={eachEmployee.employmentTypeId}
            >
              {eachEmployee.label}
            </label>
          </li>
        ))}
      </ul>
      <hr className="separator" />
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="salary-list">
        {salaryList.map(eachSalary => (
          <li className="item" key={eachSalary.salaryRangeId}>
            <input
              type="radio"
              value={eachSalary.salaryRangeId}
              onClick={onClickRad}
              id={eachSalary.salaryRangeId}
              className="input-radio"
              name="salary"
            />
            <label
              className="label-checkbox"
              htmlFor={eachSalary.salaryRangeId}
            >
              {eachSalary.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FiltersGroup
