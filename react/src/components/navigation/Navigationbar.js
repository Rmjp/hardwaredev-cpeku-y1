import "../../App.css";

const Navigationbar = ({balance}) => {
  
  return (
    <div className="translate-y-0 transition-transform duration-[250ms] z-navigationBar left-0 fixed top-0 w-full HomeHeader_homeHeader__Ls0BW">
      <div className="h-auto fixed top-0 left-0 right-0 z-navigationBarMinus2 bg-background/[0.97]"></div>
      <div className="bg-background px-18 m-auto items-center flex h-header-height fixed top-0 left-0 right-0 z-navigationBar">
        <div className="pr-26 relative flex-none">
          <p className="whitespace-pre-wrap break-all break-words support-break-word !whitespace-nowrap s22-extrabold-white light:text-black">
            Car Parking
          </p>
        </div>
        <ul className="ml-auto flex flex-center relative item-center">
          <li>
            <div>Balance: {balance}</div>
          </li>
          <li className="ml-20 cursor-pointer" style={{ display: "inline" }}>
            <a href="/account"><img
              src="/pictures/user-light.png"
              alt="side menu"
              width="24px"
              height="24px"
            /></a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigationbar;
