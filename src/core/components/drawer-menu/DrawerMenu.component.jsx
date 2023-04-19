import { Link, Outlet } from "react-router-dom";
import profileIcon from '../../../assets/icons/profile.png';
import sellIcon from '../../../assets/icons/sellout.png';
import cashIcon from '../../../assets/icons/cash.svg';
import calendarIcon from '../../../assets/icons/calendar.png';
import payrollIcon from '../../../assets/icons/payroll.png';
import documentsIcon from '../../../assets/icons/documents.png';
import logoutIcon from '../../../assets/icons/logout.png';
import "./style.css";


export const DrawerMenuComponent = () => {
  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark shadow p-3 bg-body-tertiary rounded" style={{backgroundColor: "#005CFF"}}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <div className='navbarlogo'>
              <img src="logo.png" className="img-fluid" alt="Logo" />
            </div></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={profileIcon} alt="Profile" />
                  <Link className="nav-link active" aria-current="page" to="/">Dashboard</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={sellIcon} alt="Profile" />
                  <Link className="nav-link" to="/income">Ventas</Link>
                </div>
              </li>
              <li className="nav-item">
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
                          <Link className="nav-link" to="/outcome/suppliers">Proovedores</Link>
                        </div>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Cash" /> */}
                          <Link className="nav-link" to="/outcome/invoices">Facturas</Link>
                        </div>
                        <div className="menuItemContainer">
                          {/* <img className="menuIcon" src={cashIcon} alt="Profile" /> */}
                          <Link className="nav-link" to="/outcome/expense-tickets">Tickets de gastos</Link>
                        </div>
                      </div>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={calendarIcon} alt="Profile" />
                  <Link className="nav-link" to="/vacations">Vacaciones</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={payrollIcon} alt="Profile" />
                  <Link className="nav-link" to="/payroll">Nóminas</Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="menuItemContainer">
                  <img className="menuIcon" src={documentsIcon} alt="Profile" />
                <Link className="nav-link" to="/documents">Documentos</Link>
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
