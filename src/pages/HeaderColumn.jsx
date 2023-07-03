import React, {useState, useEffect}  from 'react';
import PropTypes from 'prop-types';
import '../pages/general-style.css'

const HeaderColumn = (props) => {
    const { displayName, column, setSort, enableSorting } = props;
    
    const [ascSort, setAscSort] = useState('active');
    const [descSort, setDescSort] = useState('inactive');
    const [noSort, setNoSort] = useState('inactive');

  //   const refButton = useRef(null);

  // const onMenuClicked = () => {
  //   showColumnMenu(refButton.current);
  // };

  const onSortChanged = () => {
    setAscSort(column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column.isSortDescending() ? 'active' : 'inactive');
    setNoSort(
      !column.isSortAscending() && !column.isSortDescending()
        ? 'active'
        : 'inactive'
    );
  };

  const onSortRequested = (order, event) => {
    setSort(order, event.shiftKey);
  };

  useEffect(() => {
    if (column !== undefined) {
      column.addEventListener('sortChanged', onSortChanged);
      onSortChanged();
    }
  }, [column]);

  // let menu = null;
  // if (enableMenu) {
  //   menu = (
  //      <button
  //      type="button"
  //      ref={refButton}
  //      onClick={() => onMenuClicked()}
  //      className="customHeaderMenuButton"
  //    >
  //     <span className={`bi ${menuIcon}`}></span>
  //    </button>
  //   );
  // }

  let sort = null;
  if (enableSorting) {
    sort = (
      <div className='sortButtonsContainer'>
        <button
          type="button"
          onClick={(event) => onSortRequested('asc', event)}
          onTouchEnd={(event) => onSortRequested('asc', event)}
          className={`customSortDownLabel ${ascSort}`}
        >
         <span className="bi bi-arrow-up"></span>
        </button>
        <button
          onClick={(event) => onSortRequested('desc', event)}
          onTouchEnd={(event) => onSortRequested('desc', event)}
          className={`customSortUpLabel ${descSort}`}
        >
          <i className="bi bi-arrow-down"></i>
        </button>
        <button
          onClick={(event) => onSortRequested('', event)}
          onTouchEnd={(event) => onSortRequested('', event)}
          className={`customSortRemoveLabel ${noSort}`}
        >
          <i className="bi bi-x"></i>
        </button>
      </div>
    );
  }

  return (
    <div style={{display: 'flex'}}>
      <div className="customHeaderLabel">{displayName}</div>
      {sort}
      {/* {menu} */}
    </div>
  );

};
// 
HeaderColumn.propTypes = {
    displayName: PropTypes.string.isRequired,
    api: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    showColumnMenu: PropTypes.func.isRequired,
    // enableMenu: PropTypes.bool.isRequired,
    setSort: PropTypes.func.isRequired,
    enableSorting: PropTypes.bool.isRequired,
    // menuIcon: PropTypes.string.isRequired
  };
  
export default HeaderColumn;