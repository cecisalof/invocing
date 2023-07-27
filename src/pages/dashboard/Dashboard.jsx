import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import '../general-style.css'
import './calendar.css'
import { DragAndDropCardComponent } from "../../components/dragAndDropCard";
import { getInvoicesCount, getInvoicesStates, getInvoicesTotals } from "./services";
import Context from '../../contexts/context';
import { useContext } from 'react';
import cashIconBlue from '../../assets/icons/Cash.png';
import dragDrop from '../../assets/icons/drag-and-drop.png';
//import sellIcon from '../../assets/icons/sellout.png';
import 'react-calendar/dist/Calendar.css';
import { Alert } from '@mui/material';
import ButtonBar from '../../components/buttonBar/ButtonBar';
//import { getIncome } from "./../income/services";
//import { AgChartsReact } from 'ag-charts-react';


export const Dashboard = () => {
  const location = useLocation();

  const [invoiceCount, setInvoiceCount] = useState({});
  const [invoiceStates, setInvoiceStates] = useState({});
  //const [invoiceEmitCount, setInvoiceEmitCount] = useState({});
  //const [invoiceEmitStates, setInvoiceEmitStates] = useState({});
  const [totals, setTotals] = useState({});
  const [isError, setIsError] = useState(false);

  const userDataContext = useContext(Context);

  const getCountInvoice = async (filters = null) => {
    try {
      const data = await getInvoicesCount(userDataContext.userData.token, filters);
      if (data !== undefined) {
        setInvoiceCount(data);
      }

    } catch (error) {
      setInvoiceCount({});
      console.log('No hay datos para mostrar.');
    }
  };

  const getCountStates = async (filters = null) => {
    try {
      const data = await getInvoicesStates(userDataContext.userData.token, filters);
      if (data !== undefined) {
        setInvoiceStates(data);
      }

    } catch (error) {
      setInvoiceStates({});
      console.log('No hay datos para mostrar.');
    }
  };

  const getTotals = async (filters = null) => {
    try {
      const data = await getInvoicesTotals(userDataContext.userData.token, filters);
      if (data !== undefined) {
        setTotals(data);
      }

    } catch (error) {
      setTotals({});
      console.log('No hay datos para mostrar.');

    }
  };

  let isLoading = false; // Class variable to avoid taking too long to save that we are loading (state is not enough to control this). Also avoids multiple request under 1 second
  
  const getPanelData = async (filters = null) => {
    if (!userDataContext.userData.token || isLoading) return
    isLoading = true
    await getTotals(filters);
    await getCountInvoice(filters);
    await getCountStates(filters);
    setTimeout(() => { isLoading = false }, 1000)
  }

  useEffect(() => {
    getPanelData('?year=1');
  }, [userDataContext.userData.token]);


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
          <AppBar location={location} subtitle="Bienvenido a tu panel de control" />
        </div>
        <ButtonBar 
          getPanelData={getPanelData} />
        {isError && (
          <Alert severity="error" className="custom-alert" onClose={() => { setIsError(false) }}>
            Hubo un error al subir los ficheros
          </Alert>)}
        <div className='row'>
          <div className="col-12 col-md-6">
            {/* Blue card */}
            <DragAndDropCardComponent
              type="invoice"
              userToken={userDataContext.userData.token}
              setIsError={(newValue) => { setIsError(newValue) }}
              onFinishedUploading={() => { () => { getPanelData() } }}
            />
          </div>
          <div className="col-12 col-md-6 mt-3 mt-md-0">
            {/* Yellow card */}
            <DragAndDropCardComponent
              type="ticket"
              userToken={userDataContext.userData.token}
              setIsError={(newValue) => { setIsError(newValue) }}
              onFinishedUploading={() => { () => { getPanelData() } }}
            />
          </div>
        </div>
        <div className='d-flex mt-4'>
          <div className="card mx-2">
            {/* Total sales card */}
            <div className="container text-left">
              <img src={cashIconBlue} alt="dragDrop" className='card-img' />
              <div className="row align-items-left">
                <div className="col">
                  <div className="card-container">
                    <div className="dashboard-titles mx-lg-4 mx-md-0">Total gastos</div>
                    <div className="dashboard-titles mx-lg-4 mx-md-0">Total IVA</div>
                    <div className="dashboard-titles mx-lg-4 mx-md-0">Total ret. IRPF</div>
                  </div>
                </div>
                <div className="col">
                  <div className="card-container">
                    <div className="totals">{`${totals.total_amount || 0} €`}</div>
                    <div className="totals">{`${totals.total_taxes || 0} €`}</div>
                    <div className="totals">{`${totals.total_retention || 0} €`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Invoice card */}
          <div className="card mx-2">
            <div className="container text-left">
              <img src={dragDrop} alt="dragDrop" className='card-img' />
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-4">
                  <div className='card-container'>

                    <div className="dashboard-titles-invoices mx-lg-4 mx-md-0" > {`${invoiceCount.count || 0} Facturas `}</div>
                    <div className="dashboard-text mx-lg-4 mx-md-0">SUBIDAS {`${invoiceCount.text}`}</div>
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
                    <div>
                      <p className='states undefined'>SIN DEFINIR</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card-container">
                    <div>
                      <p className='count-states'>{`${invoiceStates.Pendiente || 0}`}</p>
                    </div>
                    <div>
                      <p className='count-states'>{`${invoiceStates.Pagada || 0}`}</p>
                    </div>
                    <div>
                      <p className='count-states'>{`${invoiceStates.Recibida || 0}`}</p>
                    </div>
                    <div>
                      <p className='count-states'>{`${invoiceStates.Rechazado || 0}`}</p>
                    </div>
                    <div>
                      <p className='count-states'>{`${invoiceStates.SinDefinir || 0}`}</p>
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