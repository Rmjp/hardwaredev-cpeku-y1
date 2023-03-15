import "../../App.css";
import ItemInList from "./ItemInList";

const Parkinglist = (cars) => {
  const data = cars
  return (
    <div  className="">
      {data.map((user, e) => {
        return <ItemInList {...e} />;
      })}
    </div>
  );
};

export default Parkinglist;
