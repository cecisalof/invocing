import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getIncome, deleteIncome, patchIncome } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import '../general-style.css'
import Context from '../../contexts/context';
import { useContext } from 'react';
import filterIcon from '../../assets/icons/Filtrar.png';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../../assets/icons/Papelera.png';
// import CustomHeader from '../customHeader.jsx';
import CustomElement from '../customElement.jsx';
import 'ag-grid-enterprise';


export const Income = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [userToken, setUserToken] = useState('');

  const [visible, setVisible] = useState(false);

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row


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

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'number',
      headerName: 'Nº Factura',
      headerCheckboxSelection: false,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      filter: 'agTextColumnFilter', 
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'total', 
      headerName: "Importe",
      filter: 'agTextColumnFilter',
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'name', 
      headerName: "Empresa",
      filter: 'agTextColumnFilter', 
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'nif', 
      headerName: "NIF",
      filter: 'agTextColumnFilter',
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'address', 
      headerName: "Dirección",
      filter: 'agTextColumnFilter',
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'payment_type', 
      headerName: "Tipo de pago",
      filter: 'agTextColumnFilter',
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'invoice_amount', 
      headerName: "Base Imponible",
      filter: 'agTextColumnFilter',
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
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
      filter: 'agTextColumnFilter',
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props} />
      // ),

      cellStyle: { color: 'white', fontSize: '10px' },// agregar estilo al texto de la celda
    },
    {
      field: 'date', 
      headerName: "Fecha",
      filter: 'agDateColumnFilter',
      // filterParams: dateFilterParams,
      // headerComponent: (props) => (
      //   <CustomHeader displayName={props.displayName} props={props}/>
      // ),
    },
    {
      field: 'file',
      headerName: 'Factura',
      cellRenderer: CustomElement
    },
    { field: 'concept', 
      headerName: 'Concepto',
      filter: 'agTextColumnFilter',
    },
    { field: 'retention_percentage', 
      headerName: '% Retención',
      filter: 'agTextColumnFilter',
    },
    { field: 'taxes_percentage', 
      headerName: '% Impuestos',
      filter: 'agTextColumnFilter',
    },
    { field: 'total_pretaxes', 
      headerName: 'Total sin Impuestos',
      filter: 'agTextColumnFilter',
    },
    { field: 'total_retention', 
      headerName: 'Total Retenciones',
      filter: 'agTextColumnFilter',
    },
    { field: 'total_taxes', 
      headerName: 'Total Impuestos',
      filter: 'agTextColumnFilter',
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
      'PENDIENTE': 'pending',
      'RECIBIDA': 'received',
      'PAGADA': 'payed',
      'RECHAZADO': 'rejected'
    };

    if (event.colDef.field === 'state') {
      newValue = stateMappings[newValue] || newValue;
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


  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
      hiddenByDefault: true,
    };
  }, []);

  const openToolPanel = useCallback((key) => {
    gridRef.current.api.openToolPanel(key);
  }, []);

  const setSideBarVisible = useCallback((value) => {
    gridRef.current.api.setSideBarVisible(value);
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      enableValue: true,
      editable: true,
      floatingFilter: true, // column filters
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true, // supress floating filter icon
      },
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
  
  function handleFilterClick() {
    setVisible((current) => !current);
    setSideBarVisible(visible);
    openToolPanel('filters')
  }

  function handleTrashClick() {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    console.log(selectedData);

    // Crear una Promesa que se resuelva cuando se hayan eliminado todas las facturas
    const deletePromises = selectedData.map((obj) => {
      console.log(obj.uuid);
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
          <button type="button" className="btn btn-primary rounded-pill px-4" onClick={handleAddIncome} style={{ marginRight: '30px' }}>Añadir Venta</button>
          <button type="button" className="btn btn-link icon-btn" onClick={handleFilterClick}><img src={filterIcon} alt="Filter icon" /></button>
          <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} style={{ marginRight: '30px' }} />
        </div>
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
            sideBar={sideBar}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
    </>
  )
};
export default Income;