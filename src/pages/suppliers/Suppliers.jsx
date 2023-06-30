import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getProviders, deleteProvider, patchProvider } from "./services";
import Context from '../../contexts/context';
import { useContext } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import '../general-style.css'
import { useNavigate } from 'react-router-dom';
//import filterIcon from '../../assets/icons/Filtrar.png';
import deleteIcon from '../../assets/icons/trash.svg';
import CustomHeader from '../customHeader.jsx';
import PropTypes from 'prop-types';

export const Suppliers = () => {
  const location = useLocation();
  const [userToken, setUserToken] = useState('');

  const navigate = useNavigate();

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const userDataContext = useContext(Context);

  // Each Column Definition results in one Column.
  const [columnDefs] = useState([
    {field: 'name', filter: true,
    headerCheckboxSelection: false,
    headerName: "Nombre jurídico",
    checkboxSelection: true,
    showDisabledCheckboxes: true,
    headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    {field: 'activity', headerName: "Actividad", headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    {field: 'nif', headerName: "NIF", headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    {field: 'phone_number',headerName: "Teléfono", headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    {field: 'email', headerName: "Correo", headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
    {field: 'adress',headerName: "Dirección",
    headerComponent: (props) => (
      <CustomHeader displayName={props.displayName} props={props}/>
    ),},
  ]);

  const handleAddProvider = () => {
    navigate('/add-suppliers'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
  };

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
      const data = await getProviders(userToken);
      console.log(data)
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
  };
  useEffect(() => { 
    getData();
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

  const onGridReady = useCallback((props) => {
    // whenever grid is remounted again API object has to replaced
    const gridRef = props.api;
    return gridRef;
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
    return deleteProvider(obj.uuid, userToken);
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
  const data = { [event.colDef.field]: newValue };
  patchProvider(event.data.uuid, data, userToken).then(() => {
    // Espera a que se complete la solicitud PATCH y luego carga los datos
    getData(userToken);
  });

};


return (
  <>
    <div>
      <AppBar location={location}/>
    </div>
    <div className='mx-1'>
      <button type="button" className="btn btn-primary rounded-pill px-4 mx-2" onClick={handleAddProvider}>Añadir proveedor</button>
      {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
      <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} style={{ marginLeft: '30px', hegiht: '33px'  }} />
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
}
Suppliers.propTypes = {
  value: PropTypes.object.isRequired,
  displayName: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
};