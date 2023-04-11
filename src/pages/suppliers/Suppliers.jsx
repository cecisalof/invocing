import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getProviders } from "./services";
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

export const Suppliers = () => {
  const location = useLocation();
  
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
 
  const gridStyle = useMemo(() => ({ height: 700, width: '95%', marginTop: 24, marginBottom: 32 }), []);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {field: 'name', filter: true},
    {field: 'activity'},
    {field: 'nif'},
    {field: 'phone_number'},
    {field: 'email'},
    {field: 'adress'},
  ]);

   // Get data
   const getData = async () => {
    try {
      const data = await getProviders();
      setRowData(data || []);
    } catch (error) {
      setRowData([]);
      console.log('No hay datos para mostrar.');
    }
  };
  useEffect(() => { 
    getData();
  }, []);

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      {/* <div>Suppliers</div> */}
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API

          rowData={rowData} // Row Data for Rows

          columnDefs={columnDefs} // Column Defs for Columns
          // defaultColDef={defaultColDef} // Default Column Properties

          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
        />
      </div>
    </>
  )
}