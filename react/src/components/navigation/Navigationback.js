import "../../App.css";
import { useNavigate } from "react-router-dom";

const Navigationback = ({ bfpage }) => {
  let navigate = useNavigate();
  return (
    <div  className="px-18 m-auto items-center flex h-header-height fixed top-0 left-0 right-0 z-navigationBar">
      <div  className="relative cursor-pointer flex-none py-13">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMiAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Im04LjY1NyA2LjM0MyAxLjQxNCAxLjQxNEw2LjgyOCAxMSAyOSAxMXYySDYuODI4bDMuMjQzIDMuMjQzLTEuNDE0IDEuNDE0TDMgMTJsNS42NTctNS42NTd6IiBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg=="
          alt="back"
          width="32px"
          height="24px"
          onClick={() => navigate(bfpage)}
        />
      </div>
    </div>
  );
};

export default Navigationback;
