import React from 'react'
import "./Navbarm.css"
import Digit from "./DigitalDateTime.js"
import Logo from "./time.PNG"
import Kai from "./kaisetsu_1.PNG"

const MNavbar = ({title, sect}) => {
  const dialog = document.querySelector("#dialog");
  const onClickOpen = () => {
    console.log("クリック へるぷ")
    dialog.showModal();
  }
  const onClickClose = () => {
    console.log("クリック へるぷ クローズ")
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

    <dialog id="dialog">
      <div className="overlay">
        <img src={Kai} className="imgstyl" alt="写真" />
        <button className="button_close"  onClick={() => onClickClose()}> 閉じる </button>
      </div>
    </dialog>
    </nav>
  )
}

export default MNavbar;