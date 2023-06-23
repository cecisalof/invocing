import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import React, { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import '../general-style.css'
import './calendar.css'
import { postInvoiceAutomatic, getSchenduleStatus } from "../invoicesToPay/services";
import { postExpenseTicketAutomatic } from "../expensesTickets/services";
import { getInvoicesCount, getInvoicesStates, getInvoicesTotals } from "./services";
import Context from '../../contexts/context';
import { useContext } from 'react';
import cashIconBlue from '../../assets/icons/Cash.png';
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import cashYellow from '../../assets/icons/cashYellow.png';
//import sellIcon from '../../assets/icons/sellout.png';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import { getIncome } from "./../income/services";
//import { AgChartsReact } from 'ag-charts-react';


export const Dashboard = () => {
  const location = useLocation();


  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileUploadedEx, setIsFileUploadedEx] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState({});
  const [invoiceStates, setInvoiceStates] = useState({});
  //const [invoiceEmitCount, setInvoiceEmitCount] = useState({});
  //const [invoiceEmitStates, setInvoiceEmitStates] = useState({});
  const [totals, setTotals] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState([new Date(), new Date()]);

  //const [income, setIncome] = useState([]);
  const [userToken, setUserToken] = useState('');

  const userDataContext = useContext(Context);

  const getCountInvoice = async (userToken, filters = null) => {
    try {
      const data = await getInvoicesCount(userToken, filters);
      if (data !== undefined) {
        setInvoiceCount(data);
      }

    } catch (error) {
      setInvoiceCount({});
      console.log('No hay datos para mostrar.');
    }
  };


  // const getCountInvoiceEmit = async (userToken, filters = null) => {
  //   try {
  //     const data = await getInvoicesEmitCount(userToken, filters);
  //     if (data !== undefined) {
  //       setInvoiceEmitCount(data);
  //     }

  //   } catch (error) {
  //     setInvoiceEmitCount({});
  //     console.log('No hay datos para mostrar.');
  //   }
  // };

  const getCountStates = async (userToken, filters = null) => {
    try {
      const data = await getInvoicesStates(userToken, filters);
      if (data !== undefined) {
        setInvoiceStates(data);
      }

    } catch (error) {
      setInvoiceStates({});
      console.log('No hay datos para mostrar.');
    }
  };

  // const getCountStatesEmit = async (userToken, filters = null) => {
  //   try {
  //     const data = await getInvoicesEmitStates(userToken, filters);
  //     if (data !== undefined) {
  //       setInvoiceEmitStates(data);
  //     }

  //   } catch (error) {
  //     setInvoiceEmitStates({});
  //     console.log('No hay datos para mostrar.');
  //   }
  // };

  const getTotals = async (userToken, filters = null) => {
    try {
      const data = await getInvoicesTotals(userToken, filters);
      if (data !== undefined) {
        console.log(data)
        setTotals(data);
      }

    } catch (error) {
      setTotals({});
      console.log('No hay datos para mostrar.');

    }
  };

  // const getData = async (userToken, filters=null) => {
  //   try {
  //     const data = await getIncome(userToken, filters);
  //     setIncome(data || []);
  //   } catch (error) {
  //     setIncome([]);
  //     console.log('No hay datos para mostrar.');
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getTotals(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        }
      }
    };

    fetchData();
  }, [userToken]);


  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getCountInvoice(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        }
      }
    };

    fetchData();
  }, [userToken]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (userToken !== undefined) {
  //       try {
  //         await getCountInvoiceEmit(userToken);
  //       } catch (error) {
  //         console.log('Error al obtener el dato de invoiceCount:', error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [userToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (userToken !== undefined) {
        try {
          await getCountStates(userToken);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceStates:', error);
        }
      }
    };

    fetchData();
  }, [userToken]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (userToken !== undefined) {
  //       try {
  //         await getCountStatesEmit(userToken);
  //       } catch (error) {
  //         console.log('Error al obtener el dato de invoiceStates:', error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [userToken]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (userToken !== undefined) {
  //       try {
  //         await getData(userToken);
  //       } catch (error) {
  //         console.log('Error al obtener el dato de invoiceStates:', error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [userToken]);


  useEffect(() => {
    let token = userDataContext.userData.token;
    if (token !== null) {
      setUserToken(token);
    }
  }, [userDataContext.userData.token]);

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
    userDataContext.updateFiles(files)
    if (files.length > 10){
      setIsFileUploaded(true);
      userDataContext.toggleProcessBotton()
    }
    else{
      if (userDataContext.processBotton){
        userDataContext.toggleProcessBotton()
      }
      processFiles()
      
    }
  };

  const handleDropEx = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('file-drop-zone-dragging');

    const files = event.dataTransfer.files;
    userDataContext.updateFiles(files)
    if (files.length > 10){
      setIsFileUploaded(true);
      userDataContext.toggleProcessBottonEx()
    }
    else{
      if (userDataContext.processBottonEx){
        userDataContext.toggleProcessBottonEx()
      }
      processFilesEx()
      
    }
  };

  const processFiles = async () => {
    console.log("Procesando archivos automáticamente...");
    userDataContext.toggleLoading()
    setIsFileUploaded(false);
    const response = await postInvoiceAutomatic(userToken, userDataContext.files);
    const ids = response.data.schendules;

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
            loadedCount = loadedCount + 1; // Incrementar el contador si el estado es "DONE"
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            userDataContext.updateProgress(percentage)
          } else {
            allDone = false;
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            userDataContext.updateProgress(percentage)
          }

        }
      });
      if (!allDone) {
        // Si no todos los IDs están en el estado "DONE", esperar un tiempo y volver a verificar
        setTimeout(checkStatus, 10000); // Esperar 2 segundos (puedes ajustar el tiempo según tus necesidades)
      } else {
        // console.log(userDataContext.progress)
        console.log("Procesamiento completo");
      }

    };
    // Iniciar la verificación del estado de los IDs
    await checkStatus();


  };

  const processFilesEx = async () => {
    console.log("Procesando archivos automáticamente...");
    userDataContext.toggleLoadingEx()
    setIsFileUploadedEx(false);
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
            loadedCount = loadedCount + 1; // Incrementar el contador si el estado es "DONE"
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            userDataContext.updateProgressEx(percentage)
          } else {
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
        console.log("Procesamiento completo");
      }

    };
    // Iniciar la verificación del estado de los IDs
    await checkStatus();

  
  
   };
  
  
  
   const handleButtonClick = () => {
    setSelectedRange([new Date(), new Date()]);
    setShowCalendar(!showCalendar);
  };


  // const chartData = (income) => {
  //   const groupedData = {};
  
  //   income.forEach((element) => {
  //     const month = element.month;
  //     const total = parseInt(element.total);
  
  //     if (!groupedData[month]) {
  //       groupedData[month] = {
  //         month,
  //         total: 0,
  //       };
  //     }
  //     groupedData[month].total += total;
  //   });
  
  //   return Object.values(groupedData);
  // };



  const handleSelect = (date) => {
    if (selectedRange.length === 2) {
      setSelectedRange([date, date]);
      console.log("1")
      selectRange([date, date])
    } else if (selectedRange.length === 1) {
      const [startDate] = selectedRange;
      if (date < startDate) {
        setSelectedRange([date, startDate]);
      } else {
        setSelectedRange([startDate, date]);
        
        
      }
    }
  };
  const handleAnualClick = async () => {
    const filters = "?year=1";
    if (userToken !== undefined) {
      try {
        await getTotals(userToken, filters);
        //await getCountStatesEmit(userToken, filters);
        await getCountStates(userToken, filters);
        await getCountInvoice(userToken, filters);
        //await getCountInvoiceEmit(userToken, filters);
        //await getData(userToken, filters);
      } catch (error) {
        console.log('Error al obtener el dato de invoiceCount:', error);
      }
    }
  };
  const handle1TrimClick = async () => {
    const filters = "?quarter=1";
    if (userToken !== undefined) {
      try {
        await getTotals(userToken, filters);
        //await getCountStatesEmit(userToken, filters);
        await getCountStates(userToken, filters);
        await getCountInvoice(userToken, filters);
        //await getCountInvoiceEmit(userToken, filters);
        //await getData(userToken, filters);
      } catch (error) {
        console.log('Error al obtener el dato de invoiceCount:', error);
      }
    }
  };

  const handle2TrimClick = async () => {
    const filters = "?quarter=2";
    if (userToken !== undefined) {
      try {
        await getTotals(userToken, filters);
        //await getCountStatesEmit(userToken, filters);
        await getCountStates(userToken, filters);
        await getCountInvoice(userToken, filters);
        //await getCountInvoiceEmit(userToken, filters);
        //await getData(userToken, filters);
      } catch (error) {
        console.log('Error al obtener el dato de invoiceCount:', error);
      }
    }
  };

  const handle3TrimClick = async () => {
    const filters = "?quarter=3";
    if (userToken !== undefined) {
      try {
        await getTotals(userToken, filters);
        //await getCountStatesEmit(userToken, filters);
        await getCountStates(userToken, filters);
        await getCountInvoice(userToken, filters);
        //await getCountInvoiceEmit(userToken, filters);
        //await getData(userToken, filters);
      } catch (error) {
        console.log('Error al obtener el dato de invoiceCount:', error);
      }
    }
  };

  const handle4TrimClick = async () => {
    const filters = "?quarter=4";
    if (userToken !== undefined) {
      try {
        await getTotals(userToken, filters);
        //await getCountStatesEmit(userToken, filters);
        await getCountStates(userToken, filters);
        await getCountInvoice(userToken, filters);
        //await getCountInvoiceEmit(userToken, filters);
      } catch (error) {
        console.log('Error al obtener el dato de invoiceCount:', error);
      }
    }
  };


  const selectRange = async (dateParam) => {

    //if (selectedRange || selectedRange.length === 2) {
      // Verificar si selectedRange es nulo o no tiene dos fechas
      const startDate = dateParam[0][0]
      const endDate =  dateParam[0][1]
      console.log(startDate)
      console.log(endDate)
      const startYear = startDate.getFullYear(); // Obtener el año (ejemplo: 2023)
      const startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
      const startDay = ('0' + startDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
      const formattedStartDate = `${startYear}-${startMonth}-${startDay}`; // Formatear la fecha en formato yyyy-mm-dd

      const endYear = endDate.getFullYear(); // Obtener el año (ejemplo: 2023)
      const endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
      const endDay = ('0' + endDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
      const formattedEndDate = `${endYear}-${endMonth}-${endDay}`; // Formatear la fecha en formato yyyy-mm-dd

      const filters = "?start_date=" + formattedStartDate + "&end_date=" + formattedEndDate;

      if (userToken !== undefined) {
        try {
          await getTotals(userToken, filters);
          //await getCountStatesEmit(userToken, filters);
          await getCountStates(userToken, filters);
          await getCountInvoice(userToken, filters);
          //await getCountInvoiceEmit(userToken, filters);
          //await getData(userToken, filters);
        } catch (error) {
          console.log('Error al obtener el dato de invoiceCount:', error);
        }
      }

      setSelectedRange([new Date(), new Date()]);

    //}

  };

  // const options = {
  //   autoSize: true,
  //   data: chartData(income),
  //   theme: {
  //     overrides: {
  //       column: {
  //         series: {
  //           highlightStyle: {
  //             item: {
  //               fill: '#FFBC11',
  //               strokeWidth: 0,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       type: 'column',
  //       xKey: 'month',
  //       yKey: 'total',
  //       fill: '#005CFF',
  //       strokeWidth: 0,
  //       tooltip: {
  //         renderer: ({ yValue, xValue }) => {
  //           return { title: xValue, content: yValue + ' €' };
  //         },
  //       },
  //     },
  //   ],
  //   axes: [
  //     {
  //       type: 'category',
  //       position: 'bottom',
  //       title: {
  //         text: 'Meses', // Cambiar el título a 'Month'
  //         fontSize: 14,
  //         fontFamily: 'Nunito',
  //       },
  //     },
  //     {
  //       type: 'number',
  //       position: 'left',
  //       title: {
  //         text: 'Total ventas',
  //         fontSize: 14,
  //         fontFamily: 'Nunito',
  //       },
  //     },
  //   ],
  // };
  
    return (
      <>
        <div className="root">
          <div>
            <AppBar location={location} />
          </div>
          <div className='mx-2'>
            <button className='filters' onClick={handleButtonClick}>
              Fechas
            </button>
            <button className='filters' onClick={handleAnualClick}>
              Anual
            </button>
            <button className='filters' onClick={handle1TrimClick}>
              1erTrimestre
            </button>
            <button className='filters' onClick={handle2TrimClick}>
              2ºTrimestre
            </button>
            <button className='filters' onClick={handle3TrimClick}>
              3erTrimestre
            </button>
            <button className='filters' onClick={handle4TrimClick}>
              4ºTrimestre
            </button>
            {showCalendar && (
              
              <div className='calendar-overlay'>
                <Calendar
                  selectRange
                  value={selectedRange}
                  onChange={handleSelect} />
                  
              </div>
            )}
          </div>
          <div style={{ display: 'flex' }}>
            <div
              className="file-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Blue card */}
              <div className="drop-message">
                {(userDataContext.isLoadingRef && userDataContext.progress < 100) ? (
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
              {!userDataContext.processBotton && (
                <div>
                  <span className="text-drop color-drop-blue">
                    Procesar facturas automáticamente
                  </span>
                </div>
              )}
              {userDataContext.processBotton && (
                <button className="process-button" onClick={processFiles}>
                  Procesar facturas automáticamente
                </button>
              )}
              </div>
              {/* Yellow card */}
              <div
              className="file-drop-zone"
              style={{backgroundColor: 'rgba(255, 188, 17, 0.1)' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropEx}
            >
              <div className="drop-message">
                {(userDataContext.isLoadingRefEx && userDataContext.progressEx < 100) ? (
                  <div>
                    <FaCircleNotch className="loading-icon" />
                    <span className="upload-text">Cargando </span>
                  </div>
                ) : isFileUploadedEx ? (
                  <div className="upload-indicator">
                    <FaCheckCircle className="upload-icon" />
                    <span className="upload-text">Archivos subidos</span>
                  </div>
                ) : (
                  <div>
                    <img src={cashYellow} alt="dragDrop" />
                  </div>
                )}
  
              </div>
              {!userDataContext.processBottonEx && (
                <span className="text-drop color-drop-yellow">
                  Procesar gasto automáticamente
                </span>
              )}
              {userDataContext.processBottonEx && (
                <button className="process-button-yellow" onClick={processFilesEx} >
                  Procesar gastos automáticamente
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div
              className="card"
            >
              {/* Total sales card */}
              <div className="container text-left">
                <img src={cashIconBlue} alt="dragDrop" className='card-img' />
                <div className="row align-items-left">
                  <div className="col">
                    <div className="card-container">
                      <div className="dashboard-titles">Total gastos</div>
                      <div className="dashboard-titles">Total IVA</div>
                      <div className="dashboard-titles">Total ret. IRPF</div>
                    </div>
                  </div>
                  <div className="col">
                  <div className="card-container">
                    <div className="totals" > {`${totals.total_amount}  €`}</div>
                    <div className="totals" >  {`${totals.total_taxes}  €`}</div>
                    <div className="totals" >  {`${totals.total_retention}  €`}</div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
              {/* Invoice card */}
              <div
              className="card"
            >
              <div className="container text-left">
                <img src={dragDrop} alt="dragDrop" className='card-img' />
                <div className="row align-items-center">
                  <div className="col-6">
                    <div className='card-container'>  
                      <div className="dashboard-titles-invoices" > {`${invoiceCount.count} Facturas `}</div>
                      <div className="dashboard-text">SUBIDAS {`${invoiceCount.text}`}</div>
                    </div>
                  </div>
                  <div className="col">
                    <div className='card-container'>
                      <div>
                        <p className='states pending'>PENDIENTE</p>
                      </div>
                      <div>
                        <p className='states payed'>PAGADA</p>
                      </div>
                      <div>
                        <p className='states received '>RECIBIDA</p>
                      </div>
                      <div>
                        <p className='states reject'>RECHAZADA</p>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card-container">
                      <div>
                        <p className='count-states'>{`${invoiceStates.Pendiente}`}</p>
                      </div>
                      <div>
                        <p className='count-states'>{`${invoiceStates.Pagada}`}</p>
                      </div>
                      <div>
                        <p className='count-states'>{`${invoiceStates.Recibida}`}</p>
                      </div>
                      <div>
                        <p className='count-states'>{`${invoiceStates.Rechazado}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div style={{ display: 'flex', marginBottom: '30px' }}>
            <div style={{ display: 'flex' }}>
            {/* Sales Chart */}
            <div
              style={{ width: '40vw', paddingBottom: '30px', marginRight: '30px' }}
            >
              {/* <div className="panel" style={{ width: '40vw', marginRight: '30px', display: 'flex', marginLeft: '60px' }}>
              <div style={{ flexBasis: '50%', marginRight: '50px' }}>
                <img src={cashIconBlue} style={{ width: '32px', height: '32px' }} alt="dragDrop" />
  
                <div className="dashboard-titles" > {`${invoiceCount.count} Facturas `}</div>
                <div className="dashboard-text">SUBIDAS DURANTE</div>
                <div className="dashboard-subtext"> {`${invoiceCount.text}`}</div>
              </div>
              <div style={{ flexBasis: '50%' }}>
                <div style={{ display: 'flex' }}>
                  <div className='states pending' style={{ marginTop: '20px' }}>
                    PENDIENTE
                  </div>
                  <div className='count-states' style={{ marginTop: '20px' }}>
                    {`${invoiceStates.Pendiente}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states payed'>
                    PAGADA
                  </div>
                  <div className='count-states'>
                    {`${invoiceStates.Pagada}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states received'>
                    RECIBIDA
                  </div>
                  <div className='count-states'>
                    {`${invoiceStates.Recibida}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states reject'>
                    RECHAZADA
                  </div>
                  <div className='count-states'>
                    {`${invoiceStates.Rechazado}`}
                  </div>
                </div>
  
              </div>
  
            </div> */}
                {/* <AgChartsReact options={options} /> */}
            </div>
            
          </div>
  
  
  
          </div>
  
          {/* <div style={{ display: 'flex', marginBottom: '30px' }}>
            <div className="panel" style={{ width: '40vw', marginRight: '30px', display: 'flex' }}>
              <div style={{ flexBasis: '50%', marginRight: '50px' }}>
                <img src={cashIconBlue} style={{ width: '32px', height: '32px' }} alt="dragDrop" />
  
                <div className="dashboard-titles" > {`${invoiceCount.count} Facturas `}</div>
                <div className="dashboard-text">SUBIDAS DURANTE</div>
                <div className="dashboard-subtext"> {`${invoiceCount.text}`}</div>
              </div>
              <div style={{ flexBasis: '50%' }}>
                <div style={{ display: 'flex' }}>
                  <div className='states pending' style={{ marginTop: '20px' }}>
                    PENDIENTE
                  </div>
                  <div className='count-states' style={{ marginTop: '20px' }}>
                    {`${invoiceStates.Pendiente}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states payed'>
                    PAGADA
                  </div>
                  <div className='count-states'>
                    {`${invoiceStates.Pagada}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states received'>
                    RECIBIDA
                  </div>
                  <div className='count-states'>
                    {`${invoiceStates.Recibida}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states reject'>
                    RECHAZADA
                  </div>
                  <div className='count-states'>
                    {`${invoiceStates.Rechazado}`}
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="panel" style={{ width: '40vw', marginRight: '50px', display: 'flex' }}>
              <div style={{ flexBasis: '50%', marginRight: '50px' }}>
                <img src={sellIcon} style={{ width: '32px', height: '32px' }} alt="dragDrop" />
  
                <div className="dashboard-titles" > {`${invoiceEmitCount.count} Ventas `}</div>
                <div className="dashboard-text">SUBIDAS DURANTE</div>
                <div className="dashboard-subtext">{`${invoiceEmitCount.text}`}</div>
              </div>
              <div style={{ flexBasis: '50%' }}>
                <div style={{ display: 'flex' }}>
                  <div className='states pending' style={{ marginTop: '20px' }}>
                    PENDIENTE
                  </div>
                  <div className='count-states' style={{ marginTop: '20px' }}>
                    {`${invoiceEmitStates.Pendiente}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states payed'>
                    PAGADA
                  </div>
                  <div className='count-states'>
                    {`${invoiceEmitStates.Pagada}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states received'>
                    RECIBIDA
                  </div>
                  <div className='count-states'>
                    {`${invoiceEmitStates.Recibida}`}
                  </div>
                </div>
  
                <div style={{ display: 'flex' }}>
                  <div className='states reject'>
                    RECHAZADA
                  </div>
                  <div className='count-states'>
                    {`${invoiceEmitStates.Rechazado}`}
                  </div>
                </div>
              </div>
            </div>
            
          </div> */}
        </div>
      </>
    )
  };
  export default Dashboard;