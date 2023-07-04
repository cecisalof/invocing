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
import deleteIcon from '../../assets/icons/trash.svg';
// import CustomHeader from '../customHeader.jsx';
import HeaderColumn from '../HeaderColumn';
import { getProviders } from "../suppliers/services";
import CustomElement from '../customElement.jsx';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import close from '../../assets/icons/close.png';
//import eye from '../../assets/icons/Eye.png';
import { ProgressBar } from 'react-bootstrap';
import { Alert } from '@mui/material';
import PropTypes from 'prop-types';


export const ExpenseTickets = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [updatePercentage, setUpdatePercentage] = useState(false);

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  // const [viewFiles, setViewFiles] = useState(false);


  const userDataContext = useContext(Context);
  const providerCellRenderer = (params) => {
    if (params.value) {
      return params.value.name; // Mostrar el nombre del proveedor
    }
    return '';
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userDataContext.progressEx < 90 && updatePercentage) {
        userDataContext.updateProgressEx(userDataContext.progressEx +  Math.floor(Math.random() * 4) + 1);
      }
    }, 10000); // 1 second interval

    return () => {
      clearInterval(intervalId);
    };
  }, [userDataContext]);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'number',
      headerName: 'Nº Factura',
      headerCheckboxSelection: false,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    {
      field: 'total', headerName: "Importe",
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
    { field: 'date', 
      headerName: "Fecha",
      sort: 'asc' 
    },
    { field: 'concept', headerName: 'Concepto' },
    {
      field: 'retention_percentage', headerName: '% Retención', valueFormatter: (params) => {
        const value = params.value;
        return value ? `${value} %` : '';
      },
    },
    {
      field: 'taxes_percentage', headerName: '% Impuestos', valueFormatter: (params) => {
        const value = params.value;
        return value ? `${value} %` : '';
      },
    },
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
    getPanelData();
  }, [userDataContext.userData.token]);

  let isLoading = false; // Class variable to avoid taking too long to save that we are loading (state is not enough to control this). Also avoids multiple request under 1 second
  const getPanelData = async () => {
    if (!userDataContext.userData.token || isLoading) return
    isLoading = true
    await getDataProviders();
    await getDataExpenseTicket();
    setTimeout(() => { isLoading = false }, 1000)
  }

  // Get data
  const getDataExpenseTicket = async () => {
    try {
      const data = await getExpenseTicket(userDataContext.userData.token);
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
          field: 'total', headerName: "Importe",
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
        { field: 'date', 
          headerName: "Fecha",
          sort: 'asc' 
        },
        { field: 'concept', headerName: 'Concepto' },
        {
          field: 'retention_percentage', headerName: '% Retención', valueFormatter: (params) => {
            const value = params.value;
            return value ? `${value} %` : '';
          },
        },
        {
          field: 'taxes_percentage', headerName: '% Impuestos', valueFormatter: (params) => {
            const value = params.value;
            return value ? `${value} %` : '';
          },
        },
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
      patchProviderExpenseTicket(event.data.uuid, data).then(() => {
        // Espera a que se complete la solicitud PATCH y luego carga los datos
        getPanelData();
      });
    } else {
      patchExpenseTicket(event.data.uuid, data).then(() => {
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
      minWidth: 250,
      filter: true,
      resizable: true,
      cellStyle: { color: '#999999', fontSize: '15px' },
      headerComponentParams: {
        menuIcon: 'bi-list',
      },
      floatingFilter: true
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
    if (userDataContext.isLoadingRef && userDataContext.progress < 100) {
      console.log("Se está cargando otros archivos")
    } else {
      event.preventDefault();
      event.stopPropagation();
      event.target.classList.remove('file-drop-zone-dragging');

      const files = event.dataTransfer.files;
      userDataContext.updateFilesEx(files)
      if (files.length > 10) {
        setIsFileUploaded(true);
        userDataContext.toggleProcessBottonEx()
      }
      else {
        if (userDataContext.processBotton) {
          userDataContext.toggleProcessBottonEx()
        }
        setUpdatePercentage(true)
        processFiles(files)

      }
    }

  };

  const processFiles = async (files) => {
    console.log("Procesando archivos automáticamente...");
    const response = await postExpenseTicketAutomatic(userDataContext.userData.token, files);
    if (response !== undefined){
      userDataContext.toggleLoadingEx();
      setIsFileUploaded(false);
      const ids = response.data.schendules;

      const checkStatus = async () => {
        const response = await getSchenduleStatus(userDataContext.userData.token, ids);
        const statusResponse = response.status;

        let allDone = true;
        let loadedCount = 0;
        let notPending = 0;

        statusResponse.map((item) => {
          const totalCount = ids.length;
          for (const id of ids) {
            const status = item[id.toString()]; // Obtener el estado del ID
            console.log(status);
            if (status === "DONE") {
              loadedCount = loadedCount + 1; // Incrementar el contador si el estado es "DONE"

              const percentage = Math.round((loadedCount * 100) / totalCount);
              userDataContext.updateProgressEx(percentage);
              notPending = notPending + 1
            } else if (status === "ERROR") {
              notPending = notPending + 1
            }
            else {
              allDone = false;
            }
          }
        });



        if (allDone) {
          console.log("Procesamiento completo");
          setUpdatePercentage(false)
          getPanelData();
        } else if (notPending === ids.length) {
          console.log("Proceso con errores");
          setUpdatePercentage(false)
          handleCloseClick()
        }
        else {
          setTimeout(checkStatus, 10000);
        }
      };

      await checkStatus();
    }
    else{
      setIsError(true)
    }

  };

  function handleCloseClick() {
    userDataContext.updateProgressEx(0)
    userDataContext.updateFilesEx([])
    userDataContext.toggleLoadingEx()
  }


  //  function handleViewClick() {
  //   setViewFiles(!viewFiles)
  //   console.log(userDataContext.filesEx)
  // }


  return (
    <>
      <div>
        <AppBar location={location} />
      </div>

      {isError && (
        <Alert severity="error" className="custom-alert" onClose={() => { setIsError(false) }}>
          Hubo un error al subir los ficheros
        </Alert>)}

      <div
        className="file-drop-zone-full"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}

      >
        {/* <div className="eye-icon">
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

        </div> */}

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
              <img src={dragDrop} alt="dragDrop" />
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

          <ProgressBar
            now={userDataContext.progressEx}
            label={userDataContext.progressEx === 0 ? "0%" : `${userDataContext.progressEx}%`}
            animated={userDataContext.progressEx === 0}
            variant="custom-color"
            className="mb-3 custom-width-progess custom-progress"
          />
          <img src={close} alt="Close icon" onClick={handleCloseClick} style={{ marginRight: '100px', width: '20 px', height: '20px' }} />
        </div>)}
      <div className='mx-3'>
        <button type="button" className="btn btn-primary rounded-pill px-4 opacity-hover-05" onClick={handleAddExpenses}>Añadir gasto</button>
        {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
        <img src={deleteIcon} alt="Delete icon" onClick={handleTrashClick} className='trashIcon' />
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
          accentedSort={true}
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