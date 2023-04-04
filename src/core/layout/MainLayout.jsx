import React from 'react'
import { DrawerComponent } from "../components/drawer/DrawerComponent";
import { AppBar } from "../../components/appBar/AppBar";
import { useLocation } from 'react-router-dom';
import "./style.css";
  
  export const MainLayout = () => {
  //  const location = useLocation();
   
    return (
      <>
        <div className="mainContainer">
          <div className="">
            <DrawerComponent />
          </div>
        </div>
      </>
    );
  };
