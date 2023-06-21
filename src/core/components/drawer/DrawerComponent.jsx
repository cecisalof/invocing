import { DrawerMenuComponent } from '../drawer-menu/DrawerMenu.component';
import "../../layout/style.css"
import PropTypes from 'prop-types';

export const DrawerComponent = ({user}) => {
  return (
    <div className="">
      <div className="rootContainer">
        <DrawerMenuComponent user={user}/>
      </div>
    </div>
  );
};
DrawerComponent.propTypes = {
  user: PropTypes.object.isRequired,
};