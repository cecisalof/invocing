import React from 'react'
import { DrawerComponent } from "../components/drawer/DrawerComponent";
  
  export const MainLayout = (props) => {
    // const classes = mainLayoutStyles();
    // // Informs whole app if drawer is open
    // const openMenuStatus = useSelector(makeSelectMenuOpenStatus());
    // // Informs whole app if responsive menu is open
    // const openResponsiveMenuStatus = useSelector(makeSelectResponsiveMenuOpenStatus());
    // const userData = useSelector(makeSelectUserData());
  
    // const sp = useSelector(makeSelectSellingPartner());
    // const dispatch = useDispatch();
  
    return (
      <div className="">
        <DrawerComponent />
      </div>
    );
  };
