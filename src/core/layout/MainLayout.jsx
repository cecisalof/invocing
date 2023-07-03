import React, { useEffect } from 'react';
import { DrawerComponent } from "../components/drawer/DrawerComponent";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import "./style.css";

export const MainLayout = () => {
  const userDataContext = useContext(Context);
  const navigate = useNavigate();

  useEffect( () => { // Check if user is already logged in
    if ((!userDataContext.userData || !userDataContext.userData.token || !userDataContext.userData.uuid) && !userDataContext.isInitialLoading) {
      console.log("Redirecting to login...") 
      navigate("/login", { replace: true });
    }
  }, [userDataContext])

    return (
      <>
        {!userDataContext.isInitialLoading && userDataContext.userData && userDataContext.userData.token && <div className="mainContainer">
          <div className="">
            <DrawerComponent user={userDataContext.userData} />
          </div>
        </div>}
      </>
    );
  };
 