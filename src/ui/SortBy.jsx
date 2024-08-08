import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [seacrhParams, setSeacrhParams] = useSearchParams();

  const sortBy = seacrhParams.get("sortBy") || "";

  function handleChange(e) {
    seacrhParams.set("sortBy", e.target.value);
    setSeacrhParams(seacrhParams);
  }

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    />
  );
}

export default SortBy;
