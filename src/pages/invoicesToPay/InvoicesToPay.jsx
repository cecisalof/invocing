import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getInvoices, deleteInvoice, patchInvoice, patchProviderInvoice } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import Context from '../../contexts/context';
import { useContext } from 'react';
import filterIcon from '../../assets/icons/Filtrar.png';
import deleteIcon from '../../assets/icons/Papelera.png';
import CustomHeader from '../customHeader.jsx';
import CustomElement from '../customElement.jsx';
import { getProviders } from "../suppliers/services";
import { useNavigate } from 'react-router-dom';

export const InvoicesToPay = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState('');
  
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);

  const gridStyle = useMemo(() => ({ height: '70vh', width: '95%', marginTop: 24, marginBottom: 32 }), []);

  const userDataContext = useContext(Context);

  const ragRenderer = (props) => {
    return <span className="rag-element">{props.value}</span>;
  };

  const ragCellClassRules = {
    'rag-green-outer': (props) => props.value === 'payed' || props.value === 'PAGADA',
    'rag-yellow-outer': (props) => props.value === 'received' || props.value === 'RECIBIDA',
    'rag-red-outer': (props) => props.value === 'rejected' || props.value === 'RECHAZADO',
    'rag-orange-outer': (props) => props.value === 'pending' || props.value === 'PENDIENTE',
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
        values: ['RECIBIDA', 'PAGADA', 'RECHAZADO', 'PENDIENTE'],
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
    {
      field: 'file',
      headerName: 'Factura',
      cellRenderer: CustomElement
    },
    {field: 'concept', headerName: 'Concepto'},
    {field: 'retention_percentage', headerName: '% Retención'}, 
    {field: 'taxes_percentage', headerName: '% Impuestos'},
    {field: 'total_pretaxes', headerName: 'Total sin Impuestos'},
    {field: 'total_retention', headerName: 'Total Retenciones'},
    {field: 'total_taxes', headerName: 'Total Impuestos'},
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
            values: ['RECIBIDA', 'PAGADA', 'RECHAZADO', 'PENDIENTE'],
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
        {
          field: 'file',
          headerName: 'Factura',
          cellRenderer: CustomElement
        },
        {field: 'concept', headerName: 'Concepto'},
        {field: 'retention_percentage', headerName: '% Retención'}, 
        {field: 'taxes_percentage', headerName: '% Impuestos'},
        {field: 'total_pretaxes', headerName: 'Total sin Impuestos'},
        {field: 'total_retention', headerName: 'Total Retenciones'},
        {field: 'total_taxes', headerName: 'Total Impuestos'},
      ];
  
      setColumnDefs(updatedColumnDefs);
    }
  }, [providersLoaded, rowProviders]);
  

  // Get data
  const getData = async (userToken) => {
    try {
      console.log(userToken)
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
      'PENDIENTE': 'pending',
      'RECIBIDA': 'received',
      'PAGADA': 'payed',
      'RECHAZADO': 'rejected'
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


  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleAddInvoice}>Añadir Factura</button>
      <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} />
      <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} style={{ marginRight: '30px'  }} />
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
export default InvoicesToPay;