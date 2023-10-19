import { Link, Outlet, NavLink } from "react-router-dom";
import React, { useState } from 'react';
import profileIcon from '../../../assets/icons/profile.png';
//import profileWhiteIcon from '../../../assets/icons/profileWhite.png';
//import sellIcon from '../../../assets/icons/sellout.png';
//import sellWhitecon from '../../../assets/icons/selloutWhite.png';
//import cashIcon from '../../../assets/icons/cash.svg';
import cashIconBlue from '../../../assets/icons/Cash.png';
//import calendarIcon from '../../../assets/icons/calendar.png';
// import calendarWhiteIcon from '../../../assets/icons/calendarWhite.png';
// import payrollIcon from '../../../assets/icons/payroll.png';
// import payrollWhiteIcon from '../../../assets/icons/payrollWhite.png';
// import documentsIcon from '../../../assets/icons/documents.png';
// import documentsWhiteIcon from '../../../assets/icons/documentsWhite.png';
import logo from '../../../assets/icons/logotramitgo.svg'
import logoutIcon from '../../../assets/icons/logout.png';
import arrow from '../../../assets/icons/Arrow.png';
import "./style.css";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


export const DrawerMenuComponent = ({ user }) => {
  const navigate = useNavigate();
  const isAdministrator = user?.groups?.includes("administrador")
  const [gastosCollapsed, setGastosCollapsed] = useState(true);
  const [profileCollapsed, setProfilesCollapsed] = useState(false);
  //const [sellInCollapsed, setSellInCollapsed] = useState(true);
  // const [holidaysCollapsed, setHolidaysCollapsed] = useState(true);
  // const [payrollCollapsed, setPayrollCollapsed] = useState(true);
  // const [documentsCollapsed, setDocumentsCollapsed] = useState(true);

  const handleClickDashboard = () => {
    //setSellInCollapsed(true);
    setProfilesCollapsed(false)
    //setHolidaysCollapsed(true)
    //setPayrollCollapsed(true)
    //setDocumentsCollapsed(true)
    navigate('/')
  };
  const handleClickGastos = () => {
    //setSellInCollapsed(true);
    setGastosCollapsed(!gastosCollapsed)
    //setProfilesCollapsed(true)
    //setHolidaysCollapsed(true)
    //setPayrollCollapsed(true)
    //setDocumentsCollapsed(true)
  }
  const handleClick = () => {
    setProfilesCollapsed(true)
    // Aquí puedes realizar las acciones que deseas ejecutar al hacer clic en el enlace
  };
  // const handleClickSellin = () => {
  //   setSellInCollapsed(false);
  //   setProfilesCollapsed(true)
  //   setHolidaysCollapsed(true)
  //   setPayrollCollapsed(true)
  //   setDocumentsCollapsed(true)
  //   navigate('/income')
  // }

  // const handleClickHolidays = () => {
  //   setSellInCollapsed(true);
  //   setProfilesCollapsed(true)
  //   setHolidaysCollapsed(false)
  //   setPayrollCollapsed(true)
  //   navigate('/vacations')
  // }

  // const handleClickPayroll = () => {
  //   setSellInCollapsed(true);
  //   setProfilesCollapsed(true)
  //   setHolidaysCollapsed(true)
  //   setPayrollCollapsed(false)
  //   setDocumentsCollapsed(true)
  //   navigate('/payroll')
  // }

  // const handleClickDocuments = () => {
  //   setSellInCollapsed(true);
  //   setProfilesCollapsed(true)
  //   setHolidaysCollapsed(true)
  //   setPayrollCollapsed(true)
  //   setDocumentsCollapsed(false)
  //   navigate('/documents')
  // }


  return (
    <>
      <nav className="navbar navbar-expand-lg shadow p-3">
        <div className="container-fluid p-0 m-0">
          <NavLink to="/" onClick={handleClickDashboard} className='navbar-brand p-0 m-0'>
            <div className='navbarlogo'>
              <img src={logo} className="img-fluid" alt="Logo" />
            </div ></NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item my-2">
                <div className="menuItemContainer font-nunito">
                  <button
                    className={`accordion-button border-0 px-2 pt-2 collapsed cursor-pointer ${profileCollapsed ? 'collapsed-icon' : 'opacity-08'}`}
                    type="button"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded={!profileCollapsed}
                    aria-controls="flush-collapseOne"
                    onClick={handleClickDashboard}
                  >
                    <img className="menuIcon" src={profileIcon} alt="Profile" />
                    Dashboard
                    <img className={`arrow ${profileCollapsed ? 'rotate-down' : 'rotate-right'}`} src={arrow} alt="Arrow" />
                  </button>

                </div>
              </li>
              {isAdministrator && <li className="nav-item my-2">
                <div className="menuItemContainer">
                  {/* <button
                    className={`accordion-button border-0 px-2 pt-2 collapsed ${sellInCollapsed ? 'collapsed-icon' : ''}`}
                    type="button"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded={!sellInCollapsed}
                    aria-controls="flush-collapseOne"
                    onClick={handleClickSellin}
                  >
                    <img className="menuIcon" src={sellInCollapsed ? sellIcon : sellWhitecon} alt="Profile" />
                    Ventas

                  </button> */}
                </div>
              </li>}
              {isAdministrator && <li className="nav-item my-2">
                <div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button border-0 rounded-top px-2 pt-2 collapsed ${gastosCollapsed ? 'collapsed-icon closed' : 'open'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded={!gastosCollapsed}
                        aria-controls="flush-collapseOne"
                        onClick={handleClickGastos}
                      >
                        <img className="menuIcon" src={cashIconBlue} alt="Profile" />
                        <span>Gastos</span>

                        <img className={`arrow ${gastosCollapsed ? 'rotate-down' : 'rotate-up'}`} src={arrow} style={{ marginLeft: '50px' }} alt="Arrow" />
                      </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                      <div className="menuItemContainer pt-2">
                        <NavLink className={(navData) => ('py-2 my-1 ms-4 w-100 text-decoration-none ' + (navData.isActive ? 'subactive opacity-08 opacity-hover-05' : 'sub-nav-link'))} onClick={handleClick} to="/outcome/suppliers">Proveedores</NavLink>
                      </div>
                      <div className="menuItemContainer">
                        <NavLink className={(navData) => ('py-2 my-1 ms-4 w-100 text-decoration-none ' + (navData.isActive ? 'subactive opacity-08 opacity-hover-05' : 'sub-nav-link'))} onClick={handleClick} to="/outcome/invoices-to-pay">Facturas</NavLink>
                      </div>
                      <div className="menuItemContainer rounded-bottom">
                        <NavLink className={(navData) => ('py-2 my-1 ms-4 w-100 text-decoration-none ' + (navData.isActive ? 'subactive opacity-08 opacity-hover-05' : 'sub-nav-link'))} onClick={handleClick} to="/outcome/expense-tickets">Tickets de gastos</NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </li>}
              {/* <li className="nav-item my-2">
                <div className="menuItemContainer">
                  <button
                    className={`accordion-button border-0 px-2 pt-2 collapsed ${holidaysCollapsed ? 'collapsed-icon' : ''}`}
                    type="button"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded={!holidaysCollapsed}
                    aria-controls="flush-collapseOne"
                    onClick={handleClickHolidays}
                  >
                    <img className="menuIcon" src={holidaysCollapsed ? calendarIcon : calendarWhiteIcon} alt="Profile" />
                    Vacaciones

                  </button>
                </div>
              </li> */}
              {/* <li className="nav-item my-2">
                <div className="menuItemContainer">
                  <button
                    className={`accordion-button border-0 px-2 pt-2 collapsed ${payrollCollapsed ? 'collapsed-icon' : ''}`}
                    type="button"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded={!payrollCollapsed}
                    aria-controls="flush-collapseOne"
                    onClick={handleClickPayroll}
                  >
                    <img className="menuIcon" src={payrollCollapsed ? payrollIcon : payrollWhiteIcon} alt="Profile" />
                    Nóminas

                  </button>
                </div>
              </li> */}
              {/* <li className="nav-item my-2">
                <div className="menuItemContainer">
                  <button
                    className={`accordion-button border-0 px-2 pt-2 collapsed ${documentsCollapsed ? 'collapsed-icon' : ''}`}
                    type="button"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded={!documentsCollapsed}
                    aria-controls="flush-collapseOne"
                    onClick={handleClickDocuments}
                  >
                    <img className="menuIcon" src={documentsCollapsed ? documentsIcon : documentsWhiteIcon} alt="Profile" />
                    Documentos

                  </button>
                </div>
              </li> */}

              <div>
                <li className="nav-item my-2">
                  <Link className="menuItemContainer logout nav-link" to="/logout">
                    <img className="menuIcon" src={logoutIcon} alt="Profile" />
                    <span className="nav-link" to="/logout">Salir</span>
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </nav>
      {/* Dumy filling */}
      <div style={{"width": "20vw"}}></div> 
      <Outlet />
    </>
  );
};


DrawerMenuComponent.propTypes = {
  user: PropTypes.object.isRequired,
};