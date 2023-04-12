import './index.css';
function GetCardHolder(prop) {
  let { carddata, setcarddata } = prop;
  // useContext(AppContext);
  
return (
     <div className="container-card">
       {carddata}
     </div>  
      
);
}
  
  export default GetCardHolder;