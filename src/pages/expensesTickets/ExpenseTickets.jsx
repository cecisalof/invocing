import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getExpenseTicket, deleteExpenseTicket, patchExpenseTicket, patchProviderExpenseTicket, expensesTicketsExcel } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import '../general-style.css'
import Context from '../../contexts/context';
import { useContext } from 'react';
import HeaderColumn from '../HeaderColumn';
import { getProviders } from "../suppliers/services";
import CustomElement from '../customElement.jsx';
import { useNavigate } from 'react-router-dom';
import close from '../../assets/icons/close.png';
//import eye from '../../assets/icons/Eye.png';
// import deleteIcon from '../../assets/icons/trash.svg';
// import deleteIconD from '../../assets/icons/trashDeactive.svg';
import { ProgressBar } from 'react-bootstrap';
import { Alert } from '@mui/material';
import { DragAndDropCardComponent } from "../../components/dragAndDropCard/DragAndDrop";
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import Modal from '../../components/modal/Modal';
import ButtonBar from '../../components/buttonBar/ButtonBar';
import { AG_GRID_LOCALE_ES } from '../../locale/es.js';
import AddButton from '../../atoms/AddButton'


export const ExpenseTickets = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const [rowSelection, setRowSelection] = useState(false);
  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const localeText = AG_GRID_LOCALE_ES;

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
    },
    {
      field: 'date',
      headerName: "Fecha",
      sort: 'desc'
    },
    {
      field: 'total', headerName: "Importe",
      valueFormatter: (params) => {
        const value = params.value;
        const currency = params.data.currency;

        let currencySymbol = '';
        if (currency === 'EUR') {
          currencySymbol = '€';
        } else if (currency === 'USD') {
          currencySymbol = '$';
        } else {
          // Otros formatos de moneda
          // Puedes agregar lógica adicional para manejar otras monedas según sea necesario
          currencySymbol = currency; // En caso de que el valor de currency sea directamente el símbolo de la moneda
        }

        return value ? `${value} ${currencySymbol}` : '';
      },
    },
    {
      field: 'sender.name', headerName: "Proveedor",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: rowProviders ? rowProviders.map((provider) => provider.name) : [],
        cellRenderer: providerCellRenderer,
      },
    },
    { field: 'concept', headerName: 'Concepto' },
    {
      field: 'total_pretaxes', headerName: 'Total sin impuestos',
      valueFormatter: (params) => {
        const value = params.value;
        const currency = params.data.currency;

        let currencySymbol = '';
        if (currency === 'EUR') {
          currencySymbol = '€';
        } else if (currency === 'USD') {
          currencySymbol = '$';
        } else {
          // Otros formatos de moneda
          // Puedes agregar lógica adicional para manejar otras monedas según sea necesario
          currencySymbol = currency; // En caso de que el valor de currency sea directamente el símbolo de la moneda
        }

        return value ? `${value} ${currencySymbol}` : '';
      },
    },
    {
      field: 'taxes_percentage', headerName: '% Impuestos', valueFormatter: (params) => {
        const value = params.value;
        return value ? `${value} %` : '';
      },
    },
    {
      field: 'total_taxes', headerName: 'Total impuestos',
      valueFormatter: (params) => {
        const value = params.value;
        const currency = params.data.currency;

        let currencySymbol = '';
        if (currency === 'EUR') {
          currencySymbol = '€';
        } else if (currency === 'USD') {
          currencySymbol = '$';
        } else {
          // Otros formatos de moneda
          // Puedes agregar lógica adicional para manejar otras monedas según sea necesario
          currencySymbol = currency; // En caso de que el valor de currency sea directamente el símbolo de la moneda
        }

        return value ? `${value} ${currencySymbol}` : '';
      },
    },
    {
      field: 'file',
      headerName: 'Descargar',
      cellRenderer: CustomElement
    },
  ]);

  useEffect(() => {
    getPanelData('?year=1');
  }, [userDataContext.userData.token]);

  let isLoading = false; // Class variable to avoid taking too long to save that we are loading (state is not enough to control this). Also avoids multiple request under 1 second

  const getPanelData = async (filters = null) => {
    if (!userDataContext.userData.token || isLoading) return
    isLoading = true
    await getDataProviders();
    await getDataExpenseTicket(filters);
    setTimeout(() => { isLoading = false }, 1000)
  }

  // Get data
  const getDataExpenseTicket = async (filters = null) => {
    try {
      const data = await getExpenseTicket(userDataContext.userData.token, filters);
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
  };

  const getDataProviders = async () => {
    try {
      const data = await getProviders(userDataContext.userData.token);
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
        },
        {
          field: 'date',
          headerName: "Fecha",
          sort: 'asc'
        },
        {
          field: 'total', headerName: "Importe",
          valueFormatter: (params) => {
            const value = params.value;
            const currency = params.data.currency;

            let currencySymbol = '';
            if (currency === 'EUR') {
              currencySymbol = '€';
            } else if (currency === 'USD') {
              currencySymbol = '$';
            } else {
              // Otros formatos de moneda
              // Puedes agregar lógica adicional para manejar otras monedas según sea necesario
              currencySymbol = currency; // En caso de que el valor de currency sea directamente el símbolo de la moneda
            }

            return value ? `${value} ${currencySymbol}` : '';
          },
        },
        {
          field: 'sender.name', headerName: "Proveedor",
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: rowProviders ? rowProviders.map((provider) => provider.name) : [],
            cellRenderer: providerCellRenderer,
          },
        },
        { field: 'concept', headerName: 'Concepto' },
        {
          field: 'total_pretaxes', headerName: 'Total sin impuestos',
          valueFormatter: (params) => {
            const value = params.value;
            const currency = params.data.currency;

            let currencySymbol = '';
            if (currency === 'EUR') {
              currencySymbol = '€';
            } else if (currency === 'USD') {
              currencySymbol = '$';
            } else {
              // Otros formatos de moneda
              // Puedes agregar lógica adicional para manejar otras monedas según sea necesario
              currencySymbol = currency; // En caso de que el valor de currency sea directamente el símbolo de la moneda
            }

            return value ? `${value} ${currencySymbol}` : '';
          },
        },
        {
          field: 'taxes_percentage', headerName: '% Impuestos', valueFormatter: (params) => {
            const value = params.value;
            return value ? `${value} %` : '';
          },
        },
        {
          field: 'total_taxes', headerName: 'Total impuestos',
          valueFormatter: (params) => {
            const value = params.value;
            const currency = params.data.currency;

            let currencySymbol = '';
            if (currency === 'EUR') {
              currencySymbol = '€';
            } else if (currency === 'USD') {
              currencySymbol = '$';
            } else {
              // Otros formatos de moneda
              // Puedes agregar lógica adicional para manejar otras monedas según sea necesario
              currencySymbol = currency; // En caso de que el valor de currency sea directamente el símbolo de la moneda
            }

            return value ? `${value} ${currencySymbol}` : '';
          },
        },
        {
          field: 'file',
          headerName: 'Descargar',
          cellRenderer: CustomElement,
          sortable: false,
          filter: false
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
      'Pagada': 'paid',
      'Rechazado': 'rejected'
    };

    if (event.colDef.field === 'state') {
      newValue = stateMappings[newValue] || newValue;
    }
    let data = { [event.colDef.field]: newValue };

    if (event.colDef.field === 'sender.name') {
      let updateSender = null;
      rowProviders.forEach((row) => {
        if (row && row.name === newValue) {
          updateSender = row.uuid
        }
      });
      data = { "uuid": updateSender };
      patchProviderExpenseTicket(event.data.uuid, data, userDataContext.userData.token).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getPanelData();
      });
    } else {
      patchExpenseTicket(event.data.uuid, data, userDataContext.userData.token).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getPanelData();
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
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 300,
      filter: true,
      resizable: true,
      cellStyle: { color: '#999999', fontSize: '15px' },
      headerComponentParams: {
        menuIcon: 'bi-list',
      },
      floatingFilter: true
    };
  }, []);


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

  function getRowStyle(props) {
    if (props.node.rowIndex % 2 === 0) {
      // Fila par
      return { background: '#F7FAFF' };
    } else {
      // Fila impar
      return { background: '#ffffff' };
    }
  }

  function handleTrashClick() {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    // Crear una Promesa que se resuelva cuando se hayan eliminado todas las facturas
    const deletePromises = selectedData.map((obj) => {
      return deleteExpenseTicket(obj.uuid, userDataContext.userData.token);
    });

    Promise.all(deletePromises)
      .then(() => {
        // Llamada a getData() después de que se hayan eliminado todas las facturas
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

  const handleAddExpenses = () => {
    navigate('/add-expenses'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
  };

  function handleCloseClick() {
    userDataContext.updateProgressEx(0)
    userDataContext.updateFilesEx([])
    userDataContext.toggleLoadingEx()
  }

  const handleDownloadFile = async () => {
    try {
      // getting excel file from backend
      const response = await expensesTicketsExcel(userDataContext.userData.token);
      // Reading Blob file
      if (response.data) {
        saveAs(response.data, 'gastos.xlsx');
      }
    } catch (error) {
      console.log('Error', error);
    }
  }

  return (
    <>
      <div>
        <AppBar location={location} subtitle="Añade o edita los gastos de los que no se contarán IVA o IRPF"/>
      </div>
      <ButtonBar
        getPanelData={getPanelData}
        userToken={userDataContext.userData.token}
      />
      {isError && (
        <Alert severity="error" className="custom-alert" onClose={() => { setIsError(false) }}>
          Hubo un error al subir los ficheros
        </Alert>)}

      {/* yellow card */}
      <DragAndDropCardComponent
        type="ticket"
        userToken={userDataContext.userData.token}
        setIsError={(newValue) => { setIsError(newValue) }}
        getPanelData={getPanelData}
      />

      {userDataContext.isLoadingRefEx && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <ProgressBar
            now={userDataContext.progressEx}
            label={userDataContext.progressEx === 0 ? "0%" : `${userDataContext.progressEx}%`}
            animated={userDataContext.progressEx === 0}
            variant="custom-color"
            className="mb-3 custom-width-progess custom-progress"
          />
          <img src={close} alt="Close icon" onClick={handleCloseClick} style={{ marginRight: '20px', width: '20px', height: '20px', marginTop: '-2px' }} />
        </div>)}
      <div className='d-flex mt-4'>
        <div className='mx-3'>
          <AddButton 
            handleAdd={handleAddExpenses}
            text={'Añadir ticket de gasto'} />
        </div>
        <div className='mx-1'>
          <button type="button" id="trash" disabled={!rowSelection} className={"btn bi mx-3 " + (rowSelection ? "btn-outline-primary bi-trash3-fill" : "btn-outline-secondary bi-trash3")} data-bs-toggle="modal" data-bs-target="#mainModal"></button>
        </div>
        <Modal handleTrashClick={handleTrashClick} page={'tickets'}/>
        <div className='mx-1'>
          <button type="button" className="btn btn-outline-primary bi bi-download" onClick={handleDownloadFile}></button>
        </div>
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
          onRowSelected={onRowSelected}
          onSelectionChanged={onSelectionChanged}
          localeText={localeText}
        />
      </div>
    </>
  )
};

ExpenseTickets.propTypes = {
  displayName: PropTypes.object,
  api: PropTypes.object,
  node: PropTypes.object,
};
export default ExpenseTickets;