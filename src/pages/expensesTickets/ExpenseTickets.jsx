import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getInvoices } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import './style.css';
import Context from '../../contexts/context';
import { useContext } from 'react';

export const ExpenseTickets = (props) => {
  const location = useLocation();

  const [userToken, setUserToken] = useState('');
  
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 
  const gridStyle = useMemo(() => ({ height: '60vh', width: '95%', marginTop: 24, marginBottom: 32 }), []);

  const userDataContext = useContext(Context);

  const [columnDefs, setColumnDefs] = useState([
    {field: 'number'},
    {field: 'sender.name'},
    {field: 'concept'},
    {field: 'date'},
    {field: 'retention_percentage'},
    {field: 'state'},
    {field: 'taxes_percentage'},
    {field: 'total'},
    {field: 'total_pretaxes'},
    {field: 'total_retention'},
    {field: 'total_taxes'},
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
      console.log(userToken)
      const data = await getInvoices(userToken);
      console.log(data)
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sideBar: true,
    };
  }, []);

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      <button type="button" class="btn btn-primary rounded-pill px-4">Añadir Factura</button>
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
        />
      </div>
    </>
  )
}
