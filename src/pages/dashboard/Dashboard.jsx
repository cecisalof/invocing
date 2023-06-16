import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import '../general-style.css'
import { postInvoiceAutomatic, getSchenduleStatus } from "../invoicesToPay/services";
import { postExpenseTicketAutomatic } from "../expensesTickets/services";
import { getInvoicesCount, getInvoicesStates, getInvoicesEmitCount, getInvoicesEmitStates, getInvoicesEmitTotals} from "./services";
import Context from '../../contexts/context';
import { useContext } from 'react';
import cashIconBlue from '../../assets/icons/Cash.png';
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import cashYellow from '../../assets/icons/cashYellow.png';
import sellIcon from '../../assets/icons/sellout.png';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


export const Dashboard = (props) => {
  const location = useLocation();


  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileUploadedEx, setIsFileUploadedEx] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState({});
  const [invoiceStates, setInvoiceStates] = useState({});
  const [invoiceEmitCount, setInvoiceEmitCount] = useState({});
  const [invoiceEmitStates, setInvoiceEmitStates] = useState({});
  const [totals, setTotals] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState([new Date(), new Date()]);
  
  const [userToken, setUserToken] = useState('');

  const userDataContext = useContext(Context);

  const getCountInvoice = async (userToken, filters=null) => {
    try {
      const data = await getInvoicesCount(userToken, filters);
      if (data !== undefined) {
        setInvoiceCount(data);
      }

    } catch (error) {
    setInvoiceCount({});
      console.log('No hay datos para mostrar.');
    }
  };

  const getCountInvoiceEmit = async (userToken, filters=null) => {
    try {
      const data = await getInvoicesEmitCount(userToken, filters);
      if (data !== undefined) {
        setInvoiceEmitCount(data);
      }

    } catch (error) {
      setInvoiceEmitCount({});
      console.log('No hay datos para mostrar.');
    }
  };

  const getCountStates = async (userToken, filters=null) => {
    try {
      const data = await getInvoicesStates(userToken, filters);
      if (data !== undefined) {
        setInvoiceStates(data);
      }

    } catch (error) {
      setInvoiceStates({});
      console.log('No hay datos para mostrar.');
      
    }
  };

  const getCountStatesEmit = async (userToken, filters = null) => {
    try {
      const data = await getInvoicesEmitStates(userToken, filters);
      if (data !== undefined) {
        setInvoiceEmitStates(data);
      }

    } catch (error) {
      setInvoiceEmitStates({});
      console.log('No hay datos para mostrar.');
      
    }
  };

  const getTotalsEmit = async (userToken, filters=null) => {
    try {
      const data = await getInvoicesEmitTotals(userToken, filters);
      if (data !== undefined) {
        console.log(data)
        setTotals(data);
      }

    } catch (error) {
      setTotals({});
      console.log('No hay datos para mostrar.');
      
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getTotalsEmit(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        } 
      }
    };
  
    fetchData();
  }, [userToken]);


  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getCountInvoice(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        } 
      }
    };
  
    fetchData();
  }, [userToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getCountInvoiceEmit(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        } 
      }
    };
  
    fetchData();
  }, [userToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getCountStates(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceStates:', error);
        } 
      }
    };
  
    fetchData();
  }, [userToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getCountStatesEmit(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceStates:', error);
        } 
      }
    };
  
    fetchData();
  }, [userToken]);


  useEffect(() => {
    let token = userDataContext.userData.token;
    if (token !== null) {
      setUserToken(token);
    }
  }, [userDataContext.userData.token]);
  
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.add('file-drop-zone-dragging');
  };
  
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('file-drop-zone-dragging');
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('file-drop-zone-dragging');
    
    const files = event.dataTransfer.files;
    userDataContext.updateFiles(files)
    setIsFileUploaded(true);
  };

  const handleDropEx = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('file-drop-zone-dragging');
    
    const files = event.dataTransfer.files;
    userDataContext.updateFiles(files)
    setIsFileUploadedEx(true);
  };
  
  
  const processFiles = async () => {
    console.log("Procesando archivos automáticamente...");
    userDataContext.toggleLoading()
    setIsFileUploaded(false);
    const response = await postInvoiceAutomatic(userToken, userDataContext.files);
    const ids = response.data.schendules
    console.log(ids)
    
  
    const checkStatus = async () => {
      
      const response = await getSchenduleStatus(userToken, ids);
      const statusResponse = response.status
  
      // Verificar si todos los IDs están en el estado "DONE"
      let allDone = true;
      let loadedCount = 0
      
  
      statusResponse.map((item) => {
        for (const id of ids) {
          const status = item[id.toString()]; // Obtener el estado del ID
          if (status === "DONE") {
            loadedCount =  loadedCount + 1; // Incrementar el contador si el estado es "DONE"
            console.log(loadedCount); // Imprimir el número de IDs con estado "DONE"
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            console.log(percentage)
            userDataContext.updateProgress(percentage)
          }else{
            allDone = false;
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            userDataContext.updateProgress(percentage)
          }
  
        }
      });
      if (!allDone) {
        // Si no todos los IDs están en el estado "DONE", esperar un tiempo y volver a verificar
        setTimeout(checkStatus, 10000); // Esperar 2 segundos (puedes ajustar el tiempo según tus necesidades)
      } else {
        console.log(userDataContext.progress)
        console.log("Procesamiento completo");
      }   
      
    };
    // Iniciar la verificación del estado de los IDs
    await checkStatus();
  
  
   };

   const processFilesEx = async () => {
    console.log("Procesando archivos automáticamente...");
    userDataContext.toggleLoadingEx()
    setIsFileUploadedEx(false);
    const response = await postExpenseTicketAutomatic(userToken, userDataContext.filesEx);
    const ids = response.data.schendules
    console.log(ids)
    
  
    const checkStatus = async () => {
      
      const response = await getSchenduleStatus(userToken, ids);
      const statusResponse = response.status
  
      // Verificar si todos los IDs están en el estado "DONE"
      let allDone = true;
      let loadedCount = 0
      
  
      statusResponse.map((item) => {
        for (const id of ids) {
          const status = item[id.toString()]; // Obtener el estado del ID
          if (status === "DONE") {
            loadedCount =  loadedCount + 1; // Incrementar el contador si el estado es "DONE"
            console.log(loadedCount); // Imprimir el número de IDs con estado "DONE"
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            console.log(percentage)
            userDataContext.updateProgressEx(percentage)
          }else{
            allDone = false;
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            userDataContext.updateProgressEx(percentage)
          }
  
        }
      });
      if (!allDone) {
        // Si no todos los IDs están en el estado "DONE", esperar un tiempo y volver a verificar
        setTimeout(checkStatus, 10000); // Esperar 2 segundos (puedes ajustar el tiempo según tus necesidades)
      } else {
        console.log(userDataContext.progressEx)
        console.log("Procesamiento completo");
      }   
      
    };
    // Iniciar la verificación del estado de los IDs
    await checkStatus();
  
  
   };
  
  
  
   const handleButtonClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleSelect = (date) => {
    if (selectedRange.length === 2) {
      setSelectedRange([date, date]);
    } else if (selectedRange.length === 1) {
      const [startDate] = selectedRange;
      if (date < startDate) {
        setSelectedRange([date, startDate]);
      } else {
        setSelectedRange([startDate, date]);
      }
    }
  };
  const handleButtonViewClick = async () => {

    if (selectedRange || selectedRange.length === 2) {
      // Verificar si selectedRange es nulo o no tiene dos fechas
      const date = selectedRange[0]
      const startDate = date[0]
      const endDate = date[1]
      console.log(startDate)
      console.log(endDate)

      const startYear = startDate.getFullYear(); // Obtener el año (ejemplo: 2023)
      const startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
      const startDay = ('0' + startDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
      const formattedStartDate= `${startYear}-${startMonth}-${startDay}`; // Formatear la fecha en formato yyyy-mm-dd
      console.log(formattedStartDate); // Output: yyyy-mm-dd

      const endYear = endDate.getFullYear(); // Obtener el año (ejemplo: 2023)
      const endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
      const endDay = ('0' + endDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
      const formattedEndDate= `${endYear}-${endMonth}-${endDay}`; // Formatear la fecha en formato yyyy-mm-dd
      console.log(formattedEndDate); // Output: yyyy-mm-dd

      const filters = "?start_date=" + formattedStartDate + "&end_date=" + formattedEndDate;
      console.log(filters)

      if (userToken !== undefined) {
        try {
          await getTotalsEmit(userToken, filters);
          await getCountStatesEmit(userToken, filters);
          await getCountStates(userToken, filters);
          await getCountInvoice(userToken, filters);
          await getCountInvoiceEmit(userToken,filters);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        } 
      }

      setSelectedRange([new Date(), new Date()]);
      
    }
    
  };

  

return (
<>
<div className="root">
    <div>
      <AppBar location={location}/>
    </div>
    <div>
    <button className='filters' onClick={handleButtonClick}>
          Fechas
    </button>
    <button className='filters' onClick={handleButtonViewClick}>
          Mostrar
    </button>
    {showCalendar && (
        <div className='calendar-overlay'>
          <Calendar 
          selectRange
          value={selectedRange}
          onChange={handleSelect}/>
        </div>
      )}
    </div>
    <div  style={{ display: 'flex' }}>
    <div
        className="file-drop-zone" 
        style={{width: '600px', paddingTop:'50px', paddingBottom: '50px', marginRight: '30px'}}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-message">
          {(userDataContext.isLoadingRef && userDataContext.progress < 100) ? (
            <div>
              <FaCircleNotch className="loading-icon" />
              <span className="upload-text">Cargando </span>
            </div>
          ) : isFileUploaded ? (
            <div className="upload-indicator">
              <FaCheckCircle className="upload-icon" />
              <span className="upload-text">Archivos subidos</span>
            </div>
          ) : (
            <div>
              <img src={dragDrop} alt="dragDrop"/>
            </div>
          )}
          
        </div>
      {(!userDataContext.isLoadingRef || userDataContext.progress >= 100) && (
        <button className="process-button" onClick={processFiles}>
          Procesar facturas automáticamente
        </button>
      )}
      </div>

      <div
        className="file-drop-zone"
        style={{width: '600px', paddingTop:'50px', paddingBottom: '50px', backgroundColor: 'rgba(255, 188, 17, 0.1)'}}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEx}
      >
        <div className="drop-message">
          {(userDataContext.isLoadingRefEx && userDataContext.progressEx < 100) ? (
            <div>
              <FaCircleNotch className="loading-icon" />
              <span className="upload-text">Cargando </span>
            </div>
          ) : isFileUploadedEx ? (
            <div className="upload-indicator">
              <FaCheckCircle className="upload-icon" />
              <span className="upload-text">Archivos subidos</span>
            </div>
          ) : (
            <div>
              <img src={cashYellow} alt="dragDrop"/>
            </div>
          )}
          
        </div>
      {(!userDataContext.isLoadingRefEx || userDataContext.progressEx >= 100) && (
        <button className="process-button-yellow" onClick={processFilesEx} >
          Procesar gastos automáticamente
        </button>
      )}
      </div>
      </div>

     <div  style={{ display: 'flex', marginBottom: '30px' }}>
    <div className="panel" style={{width: '600px', marginRight: '30px',  display: 'flex' }}>
    <div style={{ flexBasis: '50%', marginRight: '50px' }}>
      <img src={cashIconBlue} style={{width: '32px', height: '32px'}} alt="dragDrop" />
      <div className="dashboard-titles" > Total gastos</div>
      <div className="dashboard-titles" > Total IVA</div>
      <div className="dashboard-titles" > Total ret. IRPF</div>
    </div>

    <div style={{ flexBasis: '50%', marginRight: '50px' }}>
      <div className="totals" style={{marginTop: '50px'}} > {`${totals.total_amount}  €`}</div>
      <div className="totals" >  {`${totals.total_taxes}  €`}</div>
      <div className="totals" >  {`${totals.total_retention}  €`}</div>
    </div>
    </div>

    

  </div>

    <div  style={{ display: 'flex', marginBottom: '30px' }}>   
        <div className="panel" style={{width: '600px', marginRight: '30px',  display: 'flex' }}>
        <div style={{ flexBasis: '50%', marginRight: '50px' }}>
          <img src={cashIconBlue} style={{width: '32px', height: '32px'}} alt="dragDrop" />
            
          <div className="dashboard-titles" > {`${invoiceCount.count} Facturas `}</div>
          <div className="dashboard-text">SUBIDAS DURANTE</div>
          <div className="dashboard-subtext"> {`${invoiceCount.text}`}</div>
        </div>
            <div style={{ flexBasis: '50%' }}>
            <div style={{ display: 'flex'}}>
              <div className='states pending' style={{marginTop: '20px'}}>
                  PENDIENTE
                </div>
                <div className='count-states' style={{marginTop: '20px'}}>
                    {`${invoiceStates.Pendiente}`}
                </div>
           </div>

           <div  style={{ display: 'flex'}}>
            <div className='states payed'>
              PAGADA
            </div>
            <div className='count-states'>
                  {`${invoiceStates.Pagada}`}
              </div>
            </div>

            <div  style={{ display: 'flex' }}>
              <div className='states received'>
                RECIBIDA
              </div>
              <div className='count-states'>
                    {`${invoiceStates.Recibida}`}
                </div>
              </div>

              <div  style={{ display: 'flex'}}>
        <div className='states reject'>
          RECHAZADA
        </div>
        <div className='count-states'>
              {`${invoiceStates.Rechazado}`}
          </div>
        </div>

          </div>
       
      </div>


      <div className="panel" style={{width: '600px', marginRight: '50px',  display: 'flex' }}>
        <div style={{ flexBasis: '50%', marginRight: '50px' }}>
          <img src={sellIcon} style={{width: '32px', height: '32px'}} alt="dragDrop" />
            
          <div className="dashboard-titles" > {`${invoiceEmitCount.count} Ventas `}</div>
          <div className="dashboard-text">SUBIDAS DURANTE</div>
          <div className="dashboard-subtext">{`${invoiceEmitCount.text}`}</div>
        </div>
            <div style={{ flexBasis: '50%' }}>
            <div style={{ display: 'flex'}}>
              <div className='states pending' style={{marginTop: '20px'}}>
                  PENDIENTE
                </div>
                <div className='count-states' style={{marginTop: '20px'}}>
                    {`${invoiceEmitStates.Pendiente}`}
                </div>
           </div>

           <div  style={{ display: 'flex'}}>
            <div className='states payed'>
              PAGADA
            </div>
            <div className='count-states'>
                  {`${invoiceEmitStates.Pagada}`}
              </div>
            </div>

            <div  style={{ display: 'flex' }}>
              <div className='states received'>
                RECIBIDA
              </div>
              <div className='count-states'>
                    {`${invoiceEmitStates.Recibida}`}
                </div>
              </div>

      <div  style={{ display: 'flex'}}>
        <div className='states reject'>
          RECHAZADA
        </div>
      <div className='count-states'>
              {`${invoiceEmitStates.Rechazado}`}
          </div>
        </div>

          </div>
       
      </div>

  </div>

  </div>
    </> 
)
};
export default Dashboard;