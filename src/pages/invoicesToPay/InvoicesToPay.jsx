import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getInvoices, deleteInvoice, patchInvoice, patchProviderInvoice, postInvoiceAutomatic, getSchenduleStatus } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import '../general-style.css'
import Context from '../../contexts/context';
import { useContext } from 'react';
//import filterIcon from '../../assets/icons/Filtrar.png';
import deleteIcon from '../../assets/icons/Papelera.png';
import CustomHeader from '../customHeader.jsx';
import CustomElement from '../customElement.jsx';
import { getProviders } from "../suppliers/services";
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import close from '../../assets/icons/close.png';
import { ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';


export const InvoicesToPay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState('');

  
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [updatePercentage, setUpdatePercentage] = useState(false);

  const userDataContext = useContext(Context);

  const ragRenderer = (props) => {
    return <span className="rag-element">{props.value}</span>;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userDataContext.progress < 100 && updatePercentage) {
        userDataContext.updateProgress(userDataContext.progress + 2);
      }
    }, 10000); // 1 second interval

    return () => {
      clearInterval(intervalId);
    };
  }, [userDataContext]);

  const ragCellClassRules = {
    'rag-payed-outer': (props) => props.value === 'payed' || props.value === 'Pagada',
    'rag-received-outer': (props) => props.value === 'received' || props.value === 'Recibida',
    'rag-rejected-outer': (props) => props.value === 'rejected' || props.value === 'Rechazado',
    'rag-pending-outer': (props) => props.value === 'pending' || props.value === 'Pendiente',
    'rag-undefined-outer': (props) => props.value === 'undefined' || props.value === 'Sin definir',
  };
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
    {
      field: 'state',
      headerName: 'Estado',
      cellRenderer: ragRenderer,
      cellClassRules: ragCellClassRules,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Recibida', 'Pagada', 'Rechazado', 'Pendiente', 'Sin definir'],
        cellRenderer: ragRenderer,
      },
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
      
      cellStyle: { color: 'white', fontSize: '10px' },// agregar estilo al texto de la celda
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
        {
          field: 'state',
          headerName: 'Estado',
          cellRenderer: ragRenderer,
          cellClassRules: ragCellClassRules,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['Recibida', 'Pagada', 'Rechazado', 'Pendiente', 'Sin definir'],
            cellRenderer: ragRenderer,
          },
          headerComponent: (props) => (
            <CustomHeader displayName={props.displayName} props={props} />
          ),
          
          cellStyle: { color: 'white', fontSize: '10px' },// agregar estilo al texto de la celda
        },

        {
          field: 'payment_type',
          headerName: 'Tipo de pago',
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['Domiciliación', 'Cheque', 'Transferencia', 'Efectivo', 'Tarjeta'],
          },
          headerComponent: (props) => (
            <CustomHeader displayName={props.displayName} props={props} />
          ),
          
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
  

  // Get data
  const getData = async (userToken) => {
    try {
      const data = await getInvoices(userToken);
      console.log(data)
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
  };

  const onCellValueChanged = (event) => {
    let newValue = event.newValue
    
    const stateMappings = {
      'Pendiente': 'pending',
      'Recibida': 'received',
      'Pagada': 'payed',
      'Rechazado': 'rejected',
      'Sin definir': 'undefined',
    };

    const paymentMapping = {
      'Domiciliación': 'direct_debit',
      'Cheque': 'cheque',
      'Transferencia': 'transfer',
      'Efectivo': 'cash',
      'Tarjeta': 'card'
    }
    
    if (event.colDef.field === 'payment_type'){
      newValue = paymentMapping[newValue] || newValue;
    }

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
      patchProviderInvoice(event.data.uuid, data, userToken).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getData(userToken);
      });
    }else{
      patchInvoice(event.data.uuid, data, userToken).then(() => {
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
// function handleFilterClick() {
//   console.log('Botón de filtro clickeado');
  

// }

function handleTrashClick() {
  console.log('Botón de basura clickeado');
  const selectedNodes = gridRef.current.api.getSelectedNodes();
  const selectedData = selectedNodes.map((node) => node.data);
  console.log(selectedData);
  
  // Crear una Promesa que se resuelva cuando se hayan eliminado todas las facturas
  const deletePromises = selectedData.map((obj) => {
    console.log(obj.uuid);
    return deleteInvoice(obj.uuid, userToken);
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

const handleAddInvoice = () => {
  navigate('/add-invoices-to-pay'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
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
  if (userDataContext.isLoadingRef && userDataContext.progress < 100){
    console.log("Se está cargando otros archivos")
  }else{
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.remove('file-drop-zone-dragging');
  
  const files = event.dataTransfer.files;
  userDataContext.updateFiles(files)
  if (files.length > 10){
    setIsFileUploaded(true);
    userDataContext.toggleProcessBotton()
  }
  else{
    if (userDataContext.processBotton){
      userDataContext.toggleProcessBotton()
    }
    setUpdatePercentage(true)
    processFiles(files)
    
  }}
  
};

const processFiles = async (files) => {
  console.log("Procesando archivos automáticamente...");
  userDataContext.toggleLoading();
  setIsFileUploaded(false);
  console.log(files);
  const response = await postInvoiceAutomatic(userToken, files);
  const ids = response.data.schendules;
  console.log(ids);
  

  const checkStatus = async () => {
    const response = await getSchenduleStatus(userToken, ids);
    const statusResponse = response.status;

    let allDone = true;
    let loadedCount = 0;

    statusResponse.map((item) => {
      const totalCount = ids.length;
      for (const id of ids) {
        const status = item[id.toString()]; // Obtener el estado del ID
        console.log(status);
        if (status === "DONE") {
          loadedCount = loadedCount + 1; // Incrementar el contador si el estado es "DONE"

          const percentage = Math.round((loadedCount * 100) / totalCount);
          userDataContext.updateProgress(percentage);
        } else {
          allDone = false;
        }
      }
    });



    if (!allDone) {
      setTimeout(checkStatus, 10000); // Esperar 10 segundos y volver a verificar
    } else {
      console.log("Procesamiento completo");
      setUpdatePercentage(false)
      getData(userToken);
    }
  };

  await checkStatus();

};






   function handleCloseClick() {
    userDataContext.updateProgress(0)
    userDataContext.updateFiles([])
    userDataContext.toggleLoading()
  }

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      <div
        className="file-drop-zone-full"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-message">
          {userDataContext.isLoadingRef && userDataContext.progress < 100 ? (
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
      {userDataContext.processBotton && (
        <button className="process-button" onClick={processFiles}>
          Procesar automáticamente
        </button>
      )}
      </div>
  {userDataContext.isLoadingRef && (
  <div style={{display: 'flex', justifyContent: 'space-between'}}>
    
  <ProgressBar
    now={userDataContext.progress}
    label={userDataContext.progress === 0 ? "0%" : `${userDataContext.progress}%`}
    animated={userDataContext.progress === 0}
    variant="custom-color"
    className="mb-3 custom-width-progess custom-progress"
  />
  <img src={close} alt="Close icon" onClick={handleCloseClick} style={{ marginRight: '100px', width: '20 px', height: '20px'}} />
  </div>)}

      <div className='mx-3'>
        <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleAddInvoice}>Añadir factura</button>
        {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
        <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} style={{ marginLeft: '30px'  }} />
      </div>
      <div className="ag-theme-alpine mx-3 gridStyle">
        <AgGridReact
          onGridReady={onGridReady}
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
          getRowStyle={getRowStyle}
          pagination={false}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </>
  )
};
InvoicesToPay.propTypes = {
  value: PropTypes.object.isRequired,
  displayName: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
};
export default InvoicesToPay;