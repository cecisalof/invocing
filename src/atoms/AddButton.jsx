import React from 'react';
import PropTypes from 'prop-types';

export default function AddButton(props) {
    const {handleAdd, text} = props;
    return (
        <div className=''>
            <button type="button" className="btn btn-primary rounded-pill px-4 opacity-hover-05" onClick={handleAdd}>{text}</button>
            {/* <img src={filterIcon} alt="Filter icon" onClick={handleFilterClick} style={{ marginRight: '20px',  marginLeft: '50px'  }} /> */}
            {/* <img type="button" disabled src={rowSelection ? deleteIcon : deleteIconD} alt="Delete icon" data-bs-toggle="modal" data-bs-target="#mainModal" className='trashIcon' /> */}
        </div>
    )
}

AddButton.propTypes = {
    handleAdd: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };
