import { Outlet } from "react-router-dom";
import "./style.css";

export const Outcome = () => {
  return (
    <>
      <div className="root">
        {/* <h1 className="title">Outcome</h1> */}
        <Outlet />
      </div>
    </>
  )
}
