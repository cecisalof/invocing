import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  getInvoices,
  patchInvoice,
  deleteInvoice,
  patchProviderInvoice,
  invoiceToPayExcel,
} from "./services";
import { AG_GRID_LOCALE_ES } from '../../locale/es.js';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import '../general-style.css'
import Context from '../../contexts/context';
import { useContext } from 'react';
//import filterIcon from '../../assets/icons/Filtrar.png';
// import deleteIcon from '../../assets/icons/trash.svg';
// import deleteIconD from '../../assets/icons/trashDeactive.svg';
import HeaderColumn from '../HeaderColumn';
import CustomElement from '../customElement.jsx';
import { getProviders } from "../suppliers/services";
import { useNavigate } from 'react-router-dom';
import AddButton from '../../atoms/AddButton'
// import close from '../../assets/icons/close.png';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';
import { DragAndDropCardComponent } from "../../components/dragAndDropCard/DragAndDrop";
import { saveAs } from 'file-saver';
import Modal from '../../components/modal/Modal';
import ButtonBar from '../../components/buttonBar/ButtonBar';
import { useSelector } from 'react-redux'

export const InvoicesToPay = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [rowProviders, setRowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [rowSelection, setRowSelection] = useState(false);
  const userDataContext = useContext(Context);

  const localeText = AG_GRID_LOCALE_ES;

  // Reading filters global state 
  const filterState = useSelector(state => state.filters);

  // Reading tasks global state 
  const tasksState = useSelector(state => state.tasks);


  const ragRenderer = (props) => {
    return <span className="rag-element">{props.value}</span>;
  };

  const ragCellClassRules = {
    'rag-paid-outer': (props) => props.value === 'paid' || props.value === 'Pagada',
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
      cellStyle: { color: 'white', fontSize: '10px' },// agregar estilo al texto de la celda
    },
    // {
    //   field: 'payment_type',
    //   headerName: 'Tipo de pago',
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: {
    //     values: ['Domiciliación', 'Cheque', 'Transferencia', 'Efectivo', 'Tarjeta'],
    //   },
    // },
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
      field: 'retention_percentage', headerName: '% Retención',
      valueFormatter: (params) => {
        const value = params.value;
        return value ? `${value} %` : '';
      },
    },
    {
      field: 'total_retention', headerName: 'Total retenciones',
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
      field: 'taxes_percentage', headerName: '% Impuestos',
      valueFormatter: (params) => {
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
    },
  ]);

  useEffect(() => {
    getPanelData('?year=1');
  }, [userDataContext.userData.token]);

  // Update grid data when all tasks in taskState are processed
  useEffect(() => {
    if (tasksState && tasksState.results !== undefined) {
      tasksState && tasksState.results.map((item) => {
        if (new Date(item.created_at).toLocaleDateString() === new Date().toLocaleDateString()) {
          item.result !== null && getPanelData(filterState);
        }
      });
    }
  }, [tasksState])


  let isLoading = false; // Class variable to avoid taking too long to save that we are loading (state is not enough to control this). Also avoids multiple request under 1 second

  const getPanelData = async (filters = null) => {
    if (!userDataContext.userData.token || isLoading) return
    isLoading = true
    await getDataProviders();
    await getDataInvoices(filters);
    setTimeout(() => { isLoading = false }, 1000)
  }

  const getDataProviders = async () => {
    try {
      const data = await getProviders(userDataContext.userData.token);
      setRowProviders(data || []);
      setProvidersLoaded(true);
    } catch (error) {
      setRowProviders([]);
      console.log('No hay datos para mostrar.');
      setProvidersLoaded(true); // Si ocurre un error, también establece providersLoaded como true para continuar con la configuración de columnDefs
    }
  };

  const getDataInvoices = async (filters = null) => {
    try {
      const data = await getInvoices(userDataContext.userData.token, filters);
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
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
          showDisabledCheckboxes: true
        },
        {
          field: 'date', headerName: "Fecha"
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
          cellStyle: { color: 'white', fontSize: '10px' },// agregar estilo al texto de la celda
        },

        // {
        //   field: 'payment_type',
        //   headerName: 'Tipo de pago',
        //   cellEditor: 'agSelectCellEditor',
        //   cellEditorParams: {
        //     values: ['Domiciliación', 'Cheque', 'Transferencia', 'Efectivo', 'Tarjeta'],
        //   },
        // },

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
          field: 'retention_percentage', headerName: '% Retención',
          valueFormatter: (params) => {
            const value = params.value;
            return value ? `${value} %` : '';
          },
        },
        {
          field: 'total_retention', headerName: 'Total retenciones',
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
          field: 'taxes_percentage', headerName: '% Impuestos',
          valueFormatter: (params) => {
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

    if (event.colDef.field === 'payment_type') {
      newValue = paymentMapping[newValue] || newValue;
    }

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
      patchProviderInvoice(event.data.uuid, data, userDataContext.userData.token).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getPanelData();
      });
    } else {
      patchInvoice(event.data.uuid, data, userDataContext.userData.token).then(() => {
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
      minWidth: 300,
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

  function getRowStyle(props) {
    if (props.node.rowIndex % 2 === 0) {
      // Fila par
      return { background: '#F7FAFF' };
    } else {
      // Fila impar
      return { background: '#ffffff' };
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
      return deleteInvoice(obj.uuid, userDataContext.userData.token);
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

  const handleAddInvoice = () => {
    navigate('/add-invoices-to-pay'); // Reemplaza '/ruta-del-formulario' con la ruta de tu formulario
  };

  // function handleCloseClick() {
  //   userDataContext.updateProgress(0)
  //   userDataContext.updateFiles([])
  //   userDataContext.toggleLoading()
  // }

  const handleDownloadFile = async () => {
    try {
      // getting excel file from backend
      const response = await invoiceToPayExcel(userDataContext.userData.token);
      // Reading Blob file
      if (response.data) {
        saveAs(response.data, 'facturas.xlsx');
      }
    } catch (error) {
      console.log('Error', error);
    }
  }

  return (
    <>
      <div>
        <AppBar
          location={location}
          subtitle="Añade o edita las facturas con sus impuestos correspondientes" />
      </div>

      <ButtonBar
        getPanelData={getPanelData}
      />

      {(error != false && error != "") && (
        <Alert severity="error" className="custom-alert mt-1 mb-3" onClose={() => { setError(false) }}>
          {error}
        </Alert>)}

      {/* Blue card */}
      <DragAndDropCardComponent
        type="invoice"
        userToken={userDataContext.userData.token}
        setError={(newValue) => { setError(newValue) }}
        getPanelData={getPanelData}
      />
      <div className='d-flex mt-4'>
        <div className='mx-3'>
          <AddButton
            handleAdd={handleAddInvoice}
            text={'Añadir factura'} />
        </div>
        <div className='mx-1'>
          <button type="button" id="trash" disabled={!rowSelection} className={"btn bi mx-3 " + (rowSelection ? "btn-outline-primary bi-trash3-fill" : "btn-outline-secondary bi-trash3")} data-bs-toggle="modal" data-bs-target="#mainModal"></button>
        </div>
        <Modal handleTrashClick={handleTrashClick} page={'invoices'} />
        <div className='mx-1'>
          <button type="button" className="btn btn-outline-primary bi bi-download" onClick={handleDownloadFile}></button>
        </div>
      </div>
      <div className="ag-theme-alpine m-3 gridStyle">
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

InvoicesToPay.propTypes = {
  value: PropTypes.object,
  displayName: PropTypes.object,
  api: PropTypes.object,
  node: PropTypes.object,
};

export default InvoicesToPay;