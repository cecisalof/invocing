import { Link, Outlet, NavLink } from "react-router-dom";
import React, { useState} from 'react';
import profileIcon from '../../../assets/icons/profile.png';
import profileWhiteIcon from '../../../assets/icons/profileWhite.png';
import sellIcon from '../../../assets/icons/sellout.png';
import sellWhitecon from '../../../assets/icons/selloutWhite.png';
import cashIcon from '../../../assets/icons/cash.svg';
import cashIconBlue from '../../../assets/icons/Cash.png';
import calendarIcon from '../../../assets/icons/calendar.png';
import calendarWhiteIcon from '../../../assets/icons/calendarWhite.png';
import payrollIcon from '../../../assets/icons/payroll.png';
import payrollWhiteIcon from '../../../assets/icons/payrollWhite.png';
import documentsIcon from '../../../assets/icons/documents.png';
import documentsWhiteIcon from '../../../assets/icons/documentsWhite.png';
import logoutIcon from '../../../assets/icons/logout.png';
import arrow from '../../../assets/icons/Arrow.png';
import "./style.css";
import { useNavigate } from 'react-router-dom';


export const DrawerMenuComponent = ({user}) => {
  const navigate = useNavigate();
  const isAdministrator = user?.groups?.includes("administrador")
  const [gastosCollapsed, setGastosCollapsed] = useState(true);
  const [profileCollapsed, setProfilesCollapsed] = useState(false);
  const [sellInCollapsed, setSellInCollapsed] = useState(true);
  const [holidaysCollapsed, setHolidaysCollapsed] = useState(true);
  const [payrollCollapsed, setPayrollCollapsed] = useState(true);
  const [documentsCollapsed, setDocumentsCollapsed] = useState(true);

  const handleClickDashboard = () => {
    setSellInCollapsed(true);
    setGastosCollapsed(true)
    setProfilesCollapsed(false)
    setHolidaysCollapsed(true)
    setPayrollCollapsed(true)
    setDocumentsCollapsed(true)
    navigate('/')
  };
  const handleClickGastos = () =>{
    setSellInCollapsed(true);
    setGastosCollapsed(!gastosCollapsed)
    setProfilesCollapsed(true)
    setHolidaysCollapsed(true)
    setPayrollCollapsed(true)
    setDocumentsCollapsed(true)
  }
  const handleClickSellin = () =>{
    setSellInCollapsed(false);
    setGastosCollapsed(true)
    setProfilesCollapsed(true)
    setHolidaysCollapsed(true)
    setPayrollCollapsed(true)
    setDocumentsCollapsed(true)
    navigate('/income')
  }

  const handleClickHolidays= () =>{
    setSellInCollapsed(true);
    setGastosCollapsed(true)
    setProfilesCollapsed(true)
    setHolidaysCollapsed(false)
    setPayrollCollapsed(true)
    navigate('/vacations')
  }

  const handleClickPayroll= () =>{
    setSellInCollapsed(true);
    setGastosCollapsed(true)
    setProfilesCollapsed(true)
    setHolidaysCollapsed(true)
    setPayrollCollapsed(false)
    setDocumentsCollapsed(true)
    navigate('/payroll')
  }

  const handleClickDocuments= () =>{
    setSellInCollapsed(true);
    setGastosCollapsed(true)
    setProfilesCollapsed(true)
    setHolidaysCollapsed(true)
    setPayrollCollapsed(true)
    setDocumentsCollapsed(false)
    navigate('/documents')
  }


  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark shadow p-3 bg-body-tertiary rounded" style={{backgroundColor: "#005CFF"}}>
        <div className="container-fluid">
          <NavLink to="/" onClick={handleClickDashboard} className='navbar-brand'>
            <div className='navbarlogo'>
              <img src="logo.png" className="img-fluid" alt="Logo" />
            </div ></NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="menuItemContainer">
                <button
                      className={`accordion-button collapsed ${profileCollapsed ? 'collapsed-icon' : ''}`}
                      type="button"
                      
                      style={{ backgroundColor: profileCollapsed ? 'transparent' : '#005CFF', color: profileCollapsed ? '#005CFF' : '#ffffff', fontFamily: 'Nunito',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '19px',
                      lineHeight: '26px',border: 'none',
                      paddingLeft: '5px',
                      paddingRight: '135px',
                      paddingBottom: '15px',
                      paddingTop: '10px',
                      cursor: 'pointer',
                      marginRight: '20px' }}
                      data-bs-target="#flush-collapseOne"
                      aria-expanded={!profileCollapsed}
                      aria-controls="flush-collapseOne"
                      onClick={handleClickDashboard}
                    >
                      <img className="menuIcon" src={profileCollapsed ?  profileIcon: profileWhiteIcon} alt="Profile" />
                      Dashboard

                    </button>
                  
                </div>
              </li>
              {isAdministrator && <li className="nav-item">
                <div className="menuItemContainer">
                <button
                      className={`accordion-button collapsed ${sellInCollapsed ? 'collapsed-icon' : ''}`}
                      type="button"
                      
                      style={{ backgroundColor: sellInCollapsed ? 'transparent' : '#005CFF', color: sellInCollapsed ? '#005CFF' : '#ffffff', fontFamily: 'Nunito',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '19px',
                      lineHeight: '26px',border: 'none',
                      paddingLeft: '5px',
                      paddingRight: '170px',
                      paddingBottom: '15px',
                      paddingTop: '10px',
                      cursor: 'pointer',
                      marginRight: '20px' }}
                      data-bs-target="#flush-collapseOne"
                      aria-expanded={!sellInCollapsed}
                      aria-controls="flush-collapseOne"
                      onClick={handleClickSellin}
                    >
                      <img className="menuIcon" src={sellInCollapsed ?  sellIcon: sellWhitecon} alt="Profile" />
                      Ventas

                    </button>
                  {/* <img className="menuIcon" src={sellIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')}  to="/income">Ventas</NavLink> */}
                </div>
              </li>}
              {isAdministrator && <li className="nav-item">
                <div>
                  <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                      className={`accordion-button collapsed ${gastosCollapsed ? 'collapsed-icon' : ''}`}
                      type="button"
                      
                      style={{ backgroundColor: gastosCollapsed ? 'transparent' : '#005CFF', color: gastosCollapsed ? '#005CFF' : '#ffffff', fontFamily: 'Nunito',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '19px',
                      lineHeight: '26px',border: 'none',
                      paddingLeft: '5px',
                      paddingRight: '105px',
                      paddingBottom: '15px',
                      paddingTop: '10px',
                      cursor: 'pointer',
                      marginRight: '20px' }}
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded={!gastosCollapsed}
                      aria-controls="flush-collapseOne"
                      onClick={handleClickGastos}
                    >
                      <img className="menuIcon" src={gastosCollapsed ?  cashIconBlue: cashIcon} alt="Profile" />
                      Gastos
                      
                      <img className={`arrow ${gastosCollapsed ? 'rotate-down' : 'rotate-up'}`} src={arrow} alt="Arrow" />
                    </button>
                      </h2>
                      <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample" style={{background: 'rgba(0, 92, 255, 0.03)'}}>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Profile" /> */}
                          <NavLink className={(navData) => (navData.isActive ? 'subactive' : 'sub-nav-link')} to="/outcome/suppliers">Proveedores</NavLink>
                        </div>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Cash" /> */}
                          <NavLink className={(navData) => (navData.isActive ? 'subactive' : 'sub-nav-link')}  to="/outcome/invoices-to-pay">Facturas</NavLink>
                        </div>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Profile" /> */}
                          <NavLink className={(navData) => (navData.isActive ? 'subactive' : 'sub-nav-link')} to="/outcome/expense-tickets">Tickets de gastos</NavLink>
                        </div>
                      </div>
                  </div>
                </div>
              </li>}
              <li className="nav-item">
                <div className="menuItemContainer">

                <button
                      className={`accordion-button collapsed ${holidaysCollapsed ? 'collapsed-icon' : ''}`}
                      type="button"
                      
                      style={{ backgroundColor: holidaysCollapsed ? 'transparent' : '#005CFF', color: holidaysCollapsed ? '#005CFF' : '#ffffff', fontFamily: 'Nunito',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '19px',
                      lineHeight: '26px',border: 'none',
                      paddingLeft: '5px',
                      paddingRight: '135px',
                      paddingBottom: '15px',
                      paddingTop: '10px',
                      cursor: 'pointer',
                      marginRight: '20px' }}
                      data-bs-target="#flush-collapseOne"
                      aria-expanded={!holidaysCollapsed}
                      aria-controls="flush-collapseOne"
                      onClick={handleClickHolidays}
                    >
                      <img className="menuIcon" src={holidaysCollapsed ?  calendarIcon: calendarWhiteIcon} alt="Profile" />
                      Vacaciones

                    </button>
                  {/* <img className="menuIcon" src={calendarIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/vacations">Vacaciones</NavLink> */}
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                <button
                      className={`accordion-button collapsed ${payrollCollapsed ? 'collapsed-icon' : ''}`}
                      type="button"
                      
                      style={{ backgroundColor: payrollCollapsed ? 'transparent' : '#005CFF', color: payrollCollapsed ? '#005CFF' : '#ffffff', fontFamily: 'Nunito',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '19px',
                      lineHeight: '26px',border: 'none',
                      paddingLeft: '5px',
                      paddingRight: '155px',
                      paddingBottom: '15px',
                      paddingTop: '10px',
                      cursor: 'pointer',
                      marginRight: '20px' }}
                      data-bs-target="#flush-collapseOne"
                      aria-expanded={!payrollCollapsed}
                      aria-controls="flush-collapseOne"
                      onClick={handleClickPayroll}
                    >
                      <img className="menuIcon" src={payrollCollapsed ?  payrollIcon: payrollWhiteIcon} alt="Profile" />
                      Nóminas

                    </button>

                  {/* <img className="menuIcon" src={payrollIcon} alt="Profile" />
                  <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/payroll">Nóminas</NavLink> */}
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                <button
                      className={`accordion-button collapsed ${documentsCollapsed ? 'collapsed-icon' : ''}`}
                      type="button"
                      
                      style={{ backgroundColor: documentsCollapsed ? 'transparent' : '#005CFF', color: documentsCollapsed ? '#005CFF' : '#ffffff', fontFamily: 'Nunito',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: '19px',
                      lineHeight: '26px',border: 'none',
                      paddingLeft: '5px',
                      paddingRight: '120px',
                      paddingBottom: '15px',
                      paddingTop: '10px',
                      cursor: 'pointer',
                      marginRight: '20px' }}
                      data-bs-target="#flush-collapseOne"
                      aria-expanded={!documentsCollapsed}
                      aria-controls="flush-collapseOne"
                      onClick={handleClickDocuments}
                    >
                      <img className="menuIcon" src={documentsCollapsed ?  documentsIcon: documentsWhiteIcon} alt="Profile" />
                      Documentos

                    </button>
                  {/* <img className="menuIcon" src={documentsIcon} alt="Profile" />
                <NavLink className={(navData) => (navData.isActive ? 'active' : 'nav-link')} to="/documents">Documentos</NavLink> */}
                </div>
              </li>

              
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
