import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getExpenseTicket, deleteExpenseTicket, patchExpenseTicket, patchProviderExpenseTicket, postExpenseTicketAutomatic, getSchenduleStatus } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import '../general-style.css'
import Context from '../../contexts/context';
import { useContext } from 'react';
import deleteIcon from '../../assets/icons/Papelera.png';
import CustomHeader from '../customHeader.jsx';
import { getProviders } from "../suppliers/services";
import CustomElement from '../customElement.jsx';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import close from '../../assets/icons/close.png';
import eye from '../../assets/icons/Eye.png';
import { ProgressBar } from 'react-bootstrap';


export const ExpenseTickets = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [viewFiles, setViewFiles] = useState(false);


 
  const gridStyle = useMemo(() => ({ height: '70vh', width: '95%', marginTop: 24, marginBottom: 32, fontFamily: 'Nunito' }), []);

  const userDataContext = useContext(Context);
  const providerCellRenderer = (params) => {
    if (params.value) {
      return params.value.name; // Mostrar el nombre del proveedor
    }
    return '';
  };


  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'number',
      headerName: 'Nº Factura',
      headerCheckboxSelection: false,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props}/>
      ),
    },
    {field: 'total', headerName: "Importe", 
    headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    {field: 'sender.name', headerName: "Proveedor",
        headerComponent: (props) => (
          <CustomHeader displayName={props.displayName} props={props}/>
        ),
        cellEditor: 'agSelectCellEditor',
        cellEditorParams:{
          values: rowProviders ? rowProviders.map((provider) => provider.name) : [],
          cellRenderer: providerCellRenderer,
        },
      },
    {field: 'date',headerName: "Fecha",headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    
    {field: 'concept', headerName: 'Concepto'},
    {field: 'retention_percentage', headerName: '% Retención'}, 
    {field: 'taxes_percentage', headerName: '% Impuestos'},
    {field: 'total_pretaxes', headerName: 'Total sin impuestos'},
    {field: 'total_retention', headerName: 'Total retenciones'},
    {field: 'total_taxes', headerName: 'Total impuestos'},
    {
      field: 'file',
      headerName: 'Descargar',
      cellRenderer: CustomElement
    },
  ]);

  useEffect(() => {
    let token = userDataContext.userData.token;
    if (token !== null) {
      setUserToken(token);
    }
  }, [userDataContext.userData.token]);
  
  useEffect(() => {
    if (userToken !== undefined) {
      getData(userToken);
    }
  }, [userToken]);

  // Get data
  const getData = async (userToken) => {
    try {
      console.log(userToken)
      const data = await getExpenseTicket(userToken);
      console.log(data)
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
  };

  useEffect(() => {
    if (userToken !== undefined) {
      getDataProviders(userToken);
    }
  }, [userToken]);

  const getDataProviders = async (userToken) => {
    try {
      const data = await getProviders(userToken);
      setrowProviders(data || []);
      setProvidersLoaded(true);
    } catch (error) {
      setrowProviders([]);
      console.log('No hay datos para mostrar.');
      setProvidersLoaded(true); // Si ocurre un error, también establece providersLoaded como true para continuar con la configuración de columnDefs
    }
  };

  useEffect(() => {
    if (providersLoaded) {
      const updatedColumnDefs = [
        {
          field: 'number',
          headerName: 'Nº Factura',
          headerCheckboxSelection: false,
          checkboxSelection: true,
          showDisabledCheckboxes: true,
          headerComponent: (props) => (
            <CustomHeader displayName={props.displayName} props={props}/>
          ),
        },
        {field: 'total', headerName: "Importe", 
        headerComponent: (props) => (
          <CustomHeader displayName={props.displayName} props={props}/>
        ),},
        {field: 'sender.name', headerName: "Proveedor",
            headerComponent: (props) => (
              <CustomHeader displayName={props.displayName} props={props}/>
            ),
            cellEditor: 'agSelectCellEditor',
            cellEditorParams:{
              values: rowProviders ? rowProviders.map((provider) => provider.name) : [],
              cellRenderer: providerCellRenderer,
            },
          },
        {field: 'date',headerName: "Fecha",headerComponent: (props) => (
          <CustomHeader displayName={props.displayName} props={props}/>
        ),},
        
        {field: 'concept', headerName: 'Concepto'},
        {field: 'retention_percentage', headerName: '% Retención'}, 
        {field: 'taxes_percentage', headerName: '% Impuestos'},
        {field: 'total_pretaxes', headerName: 'Total sin impuestos'},
        {field: 'total_retention', headerName: 'Total retenciones'},
        {field: 'total_taxes', headerName: 'Total impuestos'},
        {
          field: 'file',
          headerName: 'Descargar',
          cellRenderer: CustomElement
        },
      ];
  
      setColumnDefs(updatedColumnDefs);
    }
  }, [providersLoaded, rowProviders]);

  const onCellValueChanged = (event) => {
    let newValue = event.newValue
    
    const stateMappings = {
      'Pendiente': 'pending',
      'Recibida': 'received',
      'Pagada': 'payed',
      'Rechazado': 'rejected'
    };
    
    if (event.colDef.field === 'state'){
      newValue = stateMappings[newValue] || newValue;
    }
    let data = { [event.colDef.field]: newValue };
    
    if (event.colDef.field === 'sender.name'){
      let updateSender= null;
      rowProviders.forEach((row) => {
        if (row && row.name === newValue) {
          updateSender = row.uuid
        }
      });
      data = { "uuid": updateSender };
      patchProviderExpenseTicket(event.data.uuid, data, userToken).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getData(userToken);
      });
    }else{
      patchExpenseTicket(event.data.uuid, data, userToken).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getData(userToken);
      });
    }

  };

  const onGridReady = useCallback((props) => {
    // whenever grid is remounted again API object has to replaced
    const gridRef = props.api;
    return gridRef;
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      editable: true,
      sideBar: true,
      cellStyle: {color: '#999999',  fontSize: '15px'}
    };
  }, []);


  function getRowStyle(props) {
    if (props.node.rowIndex % 2 === 0) {
        // Fila par
        return { background: '#F7FAFF' };
    } else {
        // Fila impar
        return { background: '#ffffff' };
    }
}
function handleFilterClick() {
  console.log('Botón de filtro clickeado');
  

}

function handleTrashClick() {
  console.log('Botón de basura clickeado');
  const selectedNodes = gridRef.current.api.getSelectedNodes();
  const selectedData = selectedNodes.map((node) => node.data);
  console.log(selectedData);
  
  // Crear una Promesa que se resuelva cuando se hayan eliminado todas las facturas
  const deletePromises = selectedData.map((obj) => {
    console.log(obj.uuid);
    return deleteExpenseTicket(obj.uuid, userToken);
  });
  
  Promise.all(deletePromises)
    .then(() => {
      // Llamada a getData() después de que se hayan eliminado todas las facturas
      getData(userToken);
    })
    .catch((error) => {
      console.log(error);
    });
}
const handleAddExpenses = () => {
  navigate('/add-expenses'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
};

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
  userDataContext.updateFilesEx(files)

  if (files.length > 10){
    setIsFileUploaded(true);
    userDataContext.toggleProcessBottonEx()
  }
  else{
    if (userDataContext.processBottonEx){
      userDataContext.toggleProcessBottonEx()
    }
    processFiles()
    
  }
};

function handleCloseClick() {
  userDataContext.updateProgressEx(0)
  userDataContext.updateFilesEx([])
  userDataContext.toggleLoadingEx()
}

const processFiles = async () => {
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
      getData(userToken);
    }   
    
  };
  // Iniciar la verificación del estado de los IDs
  await checkStatus();

 };

 function handleViewClick() {
  setViewFiles(!viewFiles)
  console.log(userDataContext.filesEx)
}


  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>

      <div
        className="file-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        
      >
        <div className="eye-icon">
        <img src={eye} alt="Eye" onClick={handleViewClick} />

        {viewFiles && (
        <div style={{ position: 'absolute', zIndex: 9999 }}>
          <label >Archivos</label>
          <ul>
          {Array.from(userDataContext.filesEx).map((file, index) => (
            <li key={index}  style={{ fontSize: '10px', fontFamily: 'Nunito' }}> {file.name}</li>
          ))}
        </ul>
          
        </div>
        
          )}

        </div>

        <div className="drop-message">
          {userDataContext.isLoadingRefEx && userDataContext.progressEx < 100 ? (
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
      {userDataContext.processBottonEx && (
        <button className="process-button" onClick={processFiles}>
          Procesar automáticamente
        </button>
      )}
      </div>

      {userDataContext.isLoadingRefEx && (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          
        <ProgressBar
          now={userDataContext.progressEx}
          label={userDataContext.progressEx === 0 ? "0%" : `${userDataContext.progressEx}%`}
          animated={userDataContext.progressEx === 0}
          variant="custom-color"
          className="mb-3 custom-width-progess custom-progress"
        />
        <img src={close} alt="Close icon" onClick={handleCloseClick} style={{ marginRight: '100px', width: '20 px', height: '20px'}} />
        </div>)}

      <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleAddExpenses}>Añadir gasto</button>
      {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
      <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} style={{ marginLeft: '30px'  }} />
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          onGridReady={onGridReady}
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
          getRowStyle={getRowStyle}
          pagination={true}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </>
  )
};
export default ExpenseTickets;