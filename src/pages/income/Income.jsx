import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getIncome, deleteIncome, patchIncome } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import '../general-style.css'
import Context from '../../contexts/context';
import { useContext } from 'react';
//import filterIcon from '../../assets/icons/Filtrar.png';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../../assets/icons/trash.svg';
import CustomHeader from '../customHeader.jsx';
import CustomElement from '../customElement.jsx';
import PropTypes from 'prop-types';


export const Income = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [userToken, setUserToken] = useState('');

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const userDataContext = useContext(Context);

  const ragRenderer = (props) => {
    return <span className="rag-element">{props.value}</span>;
  };

  const ragCellClassRules = {
    'rag-green-outer': (props) => props.value === 'payed' || props.value === 'Pagada',
    'rag-yellow-outer': (props) => props.value === 'received' || props.value === 'Recibida',
    'rag-red-outer': (props) => props.value === 'rejected' || props.value === 'Rechazado',
    'rag-orange-outer': (props) => props.value === 'pending' || props.value === 'Pendiente',
  };

  const [columnDefs] = useState([
    {
      field: 'number',
      headerName: 'Nº Factura',
      headerCheckboxSelection: false,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },
    {
      field: 'total', headerName: "Importe",
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },
    {
      field: 'name', headerName: "Empresa",
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },
    {
      field: 'nif', headerName: "NIF",
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },
    {
      field: 'address', headerName: "Dirección",
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },
    {
      field: 'invoice_amount', headerName: "Base imponible",
      headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },
    {
      field: 'state',
      headerName: 'Estado',
      cellRenderer: ragRenderer,
      cellClassRules: ragCellClassRules,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Recibida', 'Pagada', 'Rechazado', 'Pendiente'],
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
    {
      field: 'date', headerName: "Fecha", headerComponent: (props) => (
        <CustomHeader displayName={props.displayName} props={props} />
      ),
    },

    { field: 'concept', headerName: 'Concepto' },
    { field: 'retention_percentage', headerName: '% Retención' },
    { field: 'taxes_percentage', headerName: '% Impuestos' },
    { field: 'total_pretaxes', headerName: 'Total sin impuestos' },
    { field: 'total_retention', headerName: 'Total retenciones' },
    { field: 'total_taxes', headerName: 'Total impuestos' },
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
      const data = await getIncome(userToken);
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
      'Rechazado': 'rejected'
    };

    const paymentMapping = {
      'Domiciliación': 'direct_debit',
      'Cheque': 'cheque',
      'Transferencia': 'transfer',
      'Efectivo': 'cash',
      'Tarjeta': 'card'
    }

    if (event.colDef.field === 'state') {
      newValue = stateMappings[newValue] || newValue;
    }

    if (event.colDef.field === 'payment_type') {
      newValue = paymentMapping[newValue] || newValue;
    }
    const data = { [event.colDef.field]: newValue };
    patchIncome(event.data.uuid, data, userToken).then(() => {
      // Espera a que se complete la solicitud PATCH y luego carga los datos
      getData(userToken);
    });

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
      editable: true,
      sideBar: true,
      cellStyle: { color: '#999999', fontSize: '15px' }
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
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    // Crear una Promesa que se resuelva cuando se hayan eliminado todas las facturas
    const deletePromises = selectedData.map((obj) => {
      return deleteIncome(obj.uuid, userToken);
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

  const handleAddIncome = () => {
    navigate('/add-income'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
  };


  return (
    <>
      <div className="root">
        <div>
          <AppBar location={location} />
        </div>

        <div>
          <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleAddIncome}>Añadir venta</button>
          {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
          <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} className='trashIcon' />
        </div>
        <div className="ag-theme-alpine gridStyle">
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
      </div>
    </>
  )
};
Income.propTypes = {
  value: PropTypes.object,
  displayName: PropTypes.object,
  api: PropTypes.object,
  node: PropTypes.object,
};
export default Income;