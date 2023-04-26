import React, { useState} from 'react';

export default ({ displayName, props }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [originalData, setOriginalData] = useState(null); // variable de estado para los datos originales

  

  
  const onSearch = (e) => {
    if (e.key === 'Enter') {
      console.log(searchTerm);
      searchTerm = e.target.value
      const tableData = props?.api?.rowModel?.rowsToDisplay?.map((node) => node.data);
      if (originalData === null) {
        setOriginalData([...tableData]);
      }
  
      const columnParts = props.column.colId.split('.');
      let columnData = tableData;
  
      for (let part of columnParts) {
        columnData = columnData.map(row => row[part]);
      }
  
      if (searchTerm === '') {
        props.api.setRowData(originalData);
      } else {
        const filteredData = tableData.filter(row => {
          let cellData = row;
          for (let part of columnParts) {
            cellData = cellData[part];
          }
          return cellData.toLowerCase().includes(searchTerm.toLowerCase());
        });
  
        props.api.setRowData(filteredData);
      }
    }
  };
  
  

  return (
    <div className="custom-header">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      
        <span>{displayName}</span>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar" style={{ 
            borderRadius: '100px',
            padding: '5px',
            marginTop: '10px',
            backgroundColor: '#F7FAFF',
            border: 'none',
            outline: 'none',
            height: '20px', // altura del input
            width: '120px', // anchura del input
            fontSize: '10px',

          }} onKeyPress={onSearch} />
          
      </div>
    </div>
  );
};
