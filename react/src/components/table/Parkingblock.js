import "../../App.css";

const Parkingblock = (props) => {
  const { id,  free } = props;
  const bg = free ?  "bg-parked" :"bg-available";
  return (
    <div  className=" relative responsive-cell px-2">
      <div  className={bg} style={{ borderRadius: "2px" }}>
        <div  className="flex-center h-100">
          <p  className="px-20 text-center whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
            A{id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Parkingblock;
