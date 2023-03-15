import "../../App.css";
import Parkingblock from "./Parkingblock";

const Parkingtable = (cars) => {
  return (
    <div  className="">
      <div  className="flex flex-wrap gap-y-4 content-start mt-4 -mx-2 wrapper_wrapper7__2dOHS px-4">
        {cars.map((user, e) => {
            return <Parkingblock {...cars[e]} />;
        })}
      </div>
    </div>
  );
};

export default Parkingtable;
