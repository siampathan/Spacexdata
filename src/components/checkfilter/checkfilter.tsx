import "./checkfilter.scss";

const CheckFilter = ({ handleCheck, handleChange }: any) => {
  return (
    <div className="check-filter">
      <input
        type="checkbox"
        className="form-check-input"
        id="upcomingCheckbox"
        checked={handleCheck}
        onChange={handleChange}
      />
      <label className="form-check-label" htmlFor="upcomingCheckbox">
        Show upcoming only
      </label>
    </div>
  );
};

export default CheckFilter;
