import "../App.css";

const Parkingstatus = (props) => {
  const {available,max} = props
  return (
    <div  className="">
      <div  className="bg-background lg:w-default-max-width px-30 m-auto items-center flex h-header-height fixed bottom-0 left-0 right-0 z-navigationBar" style={{borderTopLeftRadius :'10px', borderTopRightRadius:'10px'}}>
        <ul  className="relative flex items-center justify-between w-full">
          <li  className="px-10 whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
            Parking available
          </li>
          <li  className=" whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
            {available}
          </li>
          <li  className="whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
            of
          </li>
          <li  className="pr-20 whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
            {max}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Parkingstatus;
