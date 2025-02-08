import React from 'react'
import "./Navbar.css"
import Digit from "./DigitalDateTime.js"
import Logo from "./time.PNG"
import Kai from "./kaisetsu_1.PNG"
import { Link } from 'react-router-dom';
//<button className="button_help"><Link to="/chart">📊</Link></button> 
const Navbar = ({title, sect}) => {
  const dialog = document.querySelector("#dialog");
  const onClickOpen = () => {
    dialog.showModal();
  }
  const onClickClose = () => {
    dialog.close();
  }
  return (
    <nav>
    <img src={Logo} className="logo" width="100" alt="写真" />

    {title}
    <>　　</>
    <Digit />
    <>　</>
    <button className="button_help"  onClick={() => onClickOpen()}> 説明 </button>
    <button className="button_help"><Link to="/chart">📊</Link></button>
    
    <dialog id="dialog">
      <div className="overlay">
        <img src={Kai} className="imgstyl" alt="写真" />
        <button className="button_close"  onClick={() => onClickClose()}> 閉じる </button>
      </div>
    </dialog>
    </nav>
  )
}

export default Navbar;