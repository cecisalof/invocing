import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './general-style.css';

const CustomHeader = ( props ) => {
  const { displayName } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [originalData, setOriginalData] = useState(null);

  const onSearch = (e) => {
    if (e.key === 'Enter') {
      const tableData = props?.api?.rowModel?.rowsToDisplay?.map((node) => node.data);
      if (originalData === null) {
        setOriginalData([...tableData]);
      }

      const columnParts = props.column.colId.split('.');
      let columnData = tableData;

      for (let part of columnParts) {
        columnData = columnData.map((row) => row[part]);
      }

      if (searchTerm === '') {
        props.api.setRowData(originalData);
      } else {
        const filteredData = tableData.filter((row) => {
          let cellData = row;
          for (let part of columnParts) {
            if (cellData && typeof cellData === 'object') {
              cellData = cellData[part];
            } else {
              cellData = null;
              break;
            }
          }
          if (cellData && searchTerm) {
            const cellDataValue = typeof cellData === 'string' ? cellData.toLowerCase() : cellData;
            const searchTermValue = searchTerm.toLowerCase();
            return cellDataValue.includes(searchTermValue);
          }
          return false;
        });

        props.api.setRowData(filteredData);
      }
    }
  };

  return (
    <div className="custom-header">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{displayName}</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar"
          style={{
            borderRadius: '100px',
            padding: '5px',
            marginTop: '10px',
            backgroundColor: '#F7FAFF',
            border: 'none',
            outline: 'none',
            height: '20px',
            width: '120px',
            fontSize: '10px',
          }}
          onKeyPress={onSearch}
        />
      </div>
    </div>
  );
};

CustomHeader.propTypes = {
  displayName: PropTypes.string,
  props: PropTypes.object,
  api: PropTypes.object,
  column: PropTypes.object,
};

CustomHeader.displayName = 'CustomHeader';

export default CustomHeader;