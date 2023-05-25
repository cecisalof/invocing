import { DrawerMenuComponent } from '../drawer-menu/DrawerMenu.component';
import "../../layout/style.css"

export const DrawerComponent = ({user}) => {
  return (
    <div className="">
      <div className="rootContainer">
        <DrawerMenuComponent user={user}/>
      </div>
    </div>
  );
};