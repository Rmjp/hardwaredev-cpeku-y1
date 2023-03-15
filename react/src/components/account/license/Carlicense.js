import "../../../App.css";

const Carlicense = ({ license }) => {
  return (
    <div>
      <div
        className="mx-20 my-10 border-grey-06 border-solid border-t border-b border-r border-l bg-background"
        style={{
          borderRadius: "5px",
          paddingLeft: 20,
          paddingRight: 10,
        }}
      >
        <div className="py-6">
          <a className="whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
            {license}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carlicense;
