import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import '../general-style.css'
import { postInvoiceAutomatic, getSchenduleStatus } from "../invoicesToPay/services";
import { postExpenseTicketAutomatic } from "../expensesTickets/services";
import { getInvoicesMonth} from "./services";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import cashIconBlue from '../../assets/icons/Cash.png';
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import dragDrop from '../../assets/icons/drag-and-drop.png';


export const Dashboard = (props) => {
  const location = useLocation();


  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  

  const [userToken, setUserToken] = useState('');

  const userDataContext = useContext(Context);

  const ragRenderer = (props) => {
    return <span class="rag-element">{props.value}</span>;
  };

  const ragCellClassRules = {
    'rag-green-outer': (props) => props.value === 'payed' || props.value === 'Pagada',
    'rag-yellow-outer': (props) => props.value === 'received' || props.value === 'Recibida',
    'rag-red-outer': (props) => props.value === 'rejected' || props.value === 'Rechazado',
    'rag-orange-outer': (props) => props.value === 'pending' || props.value === 'Pendiente',
  };

  const getCountInvoice = async (userToken) => {
    try {
      const data = await getInvoicesMonth(userToken);
      if (data !== undefined) {
        setInvoiceCount(data.count);
      }

    } catch (error) {
    setInvoiceCount();
      console.log('No hay datos para mostrar.');
      setIsLoadingData(true); // Si ocurre un error, también establece providersLoaded como true para continuar con la configuración de columnDefs
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          const response = await getCountInvoice(userToken);
          console.log("AQUIII");
          console.log(response);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        } finally {
          setIsLoadingData(false);
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
    setIsFileUploaded(false);
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
  
  
  


return (
<>
<div className="root">
    <div>
      <AppBar location={location}/>
    </div>
    <div
        className="file-drop-zone"
        style={{width: '500px', paddingTop:'50px', paddingBottom: '50px'}}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-message">
          {((userDataContext.isLoadingRef && userDataContext.progress < 100) || (userDataContext.isLoadingRefEx && userDataContext.progressEx < 100))? (
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
      {((!userDataContext.isLoadingRef || userDataContext.progress >= 100) && (!userDataContext.isLoadingRefEx || userDataContext.progressEx >= 100))&& (
        <button className="process-button" onClick={processFiles}>
          Procesar facturas automáticamente
        </button>
      )}

        {((!userDataContext.isLoadingRef || userDataContext.progress >= 100) && (!userDataContext.isLoadingRefEx || userDataContext.progressEx >= 100)) && (
        <button className="process-button" style= {{marginTop: '20px'}}onClick={processFilesEx}>
          Procesar gastos automáticamente
        </button>
      )}
      </div>
    
    <div className="title">Resumen de facturas</div>
    <div  style={{ display: 'flex' }}>   
        <div className="panel" style={{width: '300px', marginRight: '50px'}}>
        <div>
            <img src={dragDrop} style={{width: '32px', height: '32px'}} alt="dragDrop" />
        </div>
            <div className="dashboard-titles" style={{marginLeft:'20px'}}> {`${invoiceCount} Facturas `}</div>
            <div className="dashboard-text" style={{marginLeft:'20px'}}> SUBIDAS ESTE MES</div>

        </div>
        <div className="panel" style={{width: '300px', marginRight: '50px'}}>
        <div>
            <img src={cashIconBlue} style={{width: '32px', height: '32px'}} alt="cashIconBlue" />
        </div>

        </div>
    </div>


    
    

  </div>
    </> 
)
};
export default Dashboard;