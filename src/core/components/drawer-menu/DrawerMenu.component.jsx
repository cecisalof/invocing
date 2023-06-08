import { Link, Outlet, NavLink } from "react-router-dom";
import profileIcon from '../../../assets/icons/profile.png';
import sellIcon from '../../../assets/icons/sellout.png';
import cashIcon from '../../../assets/icons/cash.svg';
import calendarIcon from '../../../assets/icons/calendar.png';
import payrollIcon from '../../../assets/icons/payroll.png';
import documentsIcon from '../../../assets/icons/documents.png';
import logoutIcon from '../../../assets/icons/logout.png';
import Context from '../../../contexts/context';
import { useContext } from 'react';
import "./style.css";
import close from '../../../assets/icons/close.png';
import { ProgressBar } from 'react-bootstrap';


export const DrawerMenuComponent = ({user}) => {
  const isAdministrator = user?.groups?.includes("administrador")
  const userDataContext = useContext(Context);
  function handleCloseClick() {
    userDataContext.updateProgress(0)
    userDataContext.updateFiles([])
    userDataContext.toggleLoading()
  }
  function handleCloseClickEx() {
    userDataContext.updateProgressEx(0)
    userDataContext.updateFilesEx([])
    userDataContext.toggleLoadingEx()
  }
  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark shadow p-3 bg-body-tertiary rounded" style={{backgroundColor: "#005CFF"}}>
        <div className="container-fluid">
          <NavLink to="/" className='navbar-brand'>
            <div className='navbarlogo'>
              <img src="logo.png" className="img-fluid" alt="Logo" />
            </div></NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={profileIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} aria-current="page" to="/">Dashboard</NavLink>
                </div>
              </li>
              {isAdministrator && <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={sellIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')}  to="/income">Ventas</NavLink>
                </div>
              </li>}
              {isAdministrator && <li className="nav-item">
                <div className="accordion accordion-flush" id="accordionFlushExample">
                  <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                          <img className="menuIcon" src={cashIcon} alt="Profile" />
                          Gastos
                        </button>
                      </h2>
                      <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Profile" /> */}
                          <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/outcome/suppliers">Proveedores</NavLink>
                        </div>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Cash" /> */}
                          <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')}  to="/outcome/invoices-to-pay">Facturas</NavLink>
                        </div>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Profile" /> */}
                          <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/outcome/expense-tickets">Tickets de gastos</NavLink>
                        </div>
                      </div>
                  </div>
                </div>
              </li>}
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={calendarIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/vacations">Vacaciones</NavLink>
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={payrollIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/payroll">Nóminas</NavLink>
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={documentsIcon} alt="Profile" />
                <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/documents">Documentos</NavLink>
                </div>
              </li>

              {userDataContext.isLoadingRef && (<label style={{ fontFamily: 'Nunito', color: '#639cfe'}} >Progreso facturas</label>)}
              {userDataContext.isLoadingRef && (

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  
                <ProgressBar
                  now={userDataContext.progress}
                  label={userDataContext.progress === 0 ? "0%" : `${userDataContext.progress}%`}
                  animated={userDataContext.progress === 0}
                  variant="custom-color"
                  className="mb-3 custom-width-progess-menu custom-progress"
                />
                <img src={close} alt="Close icon" onClick={handleCloseClick} style={{ marginRight: '100px', width: '20 px', height: '20px'}} />
                </div>)}

                {userDataContext.isLoadingRefEx && (<label style={{fontFamily: 'Nunito', color: '#639cfe'}} >Progreso tickets de gastos</label>)}
                {userDataContext.isLoadingRefEx && (
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    
                  <ProgressBar
                    now={userDataContext.progressEx}
                    label={userDataContext.progressEx === 0 ? "0%" : `${userDataContext.progressEx}%`}
                    animated={userDataContext.progressEx === 0}
                    variant="custom-color"
                    className="mb-3 custom-width-progess-menu custom-progress"
                  />
                  <img src={close} alt="Close icon" onClick={handleCloseClickEx} style={{ marginRight: '100px', width: '20 px', height: '20px'}} />
                  </div>)}
              <div className="">
                <li className="nav-item">
                  <div className="menuItemContainer logout">
                    <img className="menuIcon" src={logoutIcon} alt="Profile" />
                    <Link className="nav-link" to="/logout">Salir</Link>
                  </div>
                </li>
              </div>
            </ul>
          </div>
        </div>
    </nav>
    <Outlet/>
    </>
  );
};
