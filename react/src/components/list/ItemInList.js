import "../../App.css";

const ItemInList = (props) => {
  const {id,free} = props;

  const bg = id==="Block"? 'bg-available':'';
  const tx = id==="Block"? 800 : 400;

  return (
    <div  className={bg} style={{borderRadius:'6px'}}>
    <div  className="border-grey-02 border-b border-t border-solid w-full">
      <ul  className="py-6  relative flex items-center justify-between">
        <li  className="mx-40 flex-center whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap" style={{width:'60px',fontWeight: tx}}>
          {
            id==="Block"? 'Block': <>A{id}</>
          }
        </li>
        <li  className="mx-40 flex-center whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap" style={{width:'100px',fontWeight: tx}}>
          {
            free==="Status"? 'Status' :
            free?  'parked':'available' 
          }
        </li>
      </ul>
    </div></div>
  );
};

export default ItemInList;
