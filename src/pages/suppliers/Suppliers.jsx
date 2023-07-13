import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getProviders, deleteProvider, patchProvider } from "./services";
import Context from '../../contexts/context';
import { useContext } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
// import './style.css';
import '../general-style.css'
import { useNavigate } from 'react-router-dom';
//import filterIcon from '../../assets/icons/Filtrar.png';
// import deleteIcon from '../../assets/icons/trash.svg';
// import deleteIconD from '../../assets/icons/trashDeactive.svg';
import PropTypes from 'prop-types';
import HeaderColumn from '../HeaderColumn';
import Modal from '../../components/modal/Modal';

export const Suppliers = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [rowSelection, setRowSelection] = useState(false);

  const userDataContext = useContext(Context);

  // Each Column Definition results in one Column.
  const [columnDefs] = useState([
    {
      field: 'name', filter: true,
      headerCheckboxSelection: false,
      headerName: "Nombre jurídico",
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      sort: 'asc'
    },
    {
      field: 'activity', headerName: "Actividad"
    },
    {
      field: 'nif', headerName: "NIF"
    },
    {
      field: 'phone_number', headerName: "Teléfono"
    },
    {
      field: 'email', headerName: "Correo"
    },
    {
      field: 'adress', headerName: "Dirección"
    },
  ]);

  const handleAddProvider = () => {
    navigate('/add-suppliers'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
  };

  useEffect(() => {
    getPanelData();
  }, [userDataContext.userData.token]);

  let isLoading = false; // Class variable to avoid taking too long to save that we are loading (state is not enough to control this). Also avoids multiple request under 1 second
  const getPanelData = async () => {
    if (!userDataContext.userData.token || isLoading) return
    isLoading = true
    try {
      const data = await getProviders(userDataContext.userData.token);
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
    setTimeout(() => { isLoading = false }, 1000)
  }

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
      sideBar: true,
      cellStyle: { color: '#999999', fontSize: '15px' },
      headerComponentParams: {
        menuIcon: 'bi-list',
      },
      floatingFilter: true,
      minWidth: 300
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

  const onRowSelected = (event) => {
    if (event.node.selected) {
      setRowSelection(true);
    }
  }

  const onSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedNodes();
    if (selectedRows.length == 0) {
      setRowSelection(false);
    }
  }

  useEffect(() => {
    const getTrashButton = document.getElementById('trash');
    if (rowSelection) {
      getTrashButton.removeAttribute("disabled", "");
    } else {
      getTrashButton.setAttribute("disabled", "");
    }
  }, [rowSelection])

  function handleTrashClick() {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    // Crear una Promesa que se resuelva cuando se hayan eliminado todas las facturas
    const deletePromises = selectedData.map((obj) => {
      return deleteProvider(obj.uuid, userDataContext.userData.token);
    });

    Promise.all(deletePromises)
      .then(() => {
        // Llamada a getPanelData() después de que se hayan eliminado todas las facturas
        getPanelData();
        // Wait one second until the data is reloaded after deleting the row, to display disabled trash icon again.
        setTimeout(() => {
          setRowSelection(false);
        }, 1000);
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

    if (event.colDef.field === 'state') {
      newValue = stateMappings[newValue] || newValue;
    }
    const data = { [event.colDef.field]: newValue };
    patchProvider(event.data.uuid, data).then(() => {
      // Espera a que se complete la solicitud PATCH y luego carga los datos
      getPanelData();
    });

  };

  return (
    <>
      <div>
        <AppBar location={location} />
      </div>
      <div className='d-flex mt-4'>
        <div className='mx-3'>
          <button type="button" className="btn btn-primary rounded-pill px-4 opacity-hover-05" onClick={handleAddProvider}>Añadir factura</button>
          {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
          {/* <img type="button" disabled src={rowSelection ? deleteIcon : deleteIconD} alt="Delete icon" data-bs-toggle="modal" data-bs-target="#exampleModal" className='trashIcon' /> */}
        </div>
        <div className='mx-1'>
          <button type="button" id="trash"  disabled className={rowSelection ? "btn btn-outline-primary bi bi-trash3-fill mx-3" : "btn btn-outline-primary bi bi-trash3 mx-3"} data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
        </div>
        <Modal handleTrashClick={handleTrashClick} />
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
          components={{ agColumnHeader: HeaderColumn }}
          onSelectionChanged={onSelectionChanged}
          onRowSelected={onRowSelected}
        />
      </div>
    </>
  )
}
Suppliers.propTypes = {
  value: PropTypes.object,
  displayName: PropTypes.object,
  api: PropTypes.object,
  node: PropTypes.object,
};