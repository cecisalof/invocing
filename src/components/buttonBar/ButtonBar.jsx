import React, { useState, useRef, useEffect } from 'react';
import DatePicker from "react-datepicker";
import 'react-calendar/dist/Calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../pages/general-style.css';
import PropTypes from 'prop-types';

export default function ButtonBar(props) {

    const { getPanelData } = props;

    const [active, setActive] = useState("year");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const getDataWithFilter = async (filters, event) => {
        await getPanelData(filters);
        setActive(event.target.id);
    };

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        selectRange(start, end);
    };

    const selectRange = async (startDate, endDate) => {

        const startYear = startDate.getFullYear(); // Obtener el año (ejemplo: 2023)
        const startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
        const startDay = ('0' + startDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
        const formattedStartDate = `${startYear}-${startMonth}-${startDay}`; // Formatear la fecha en formato yyyy-mm-dd

        if (endDate !== null) {
            const endYear = endDate.getFullYear(); // Obtener el año (ejemplo: 2023)
            const endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
            const endDay = ('0' + endDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
            const formattedEndDate = `${endYear}-${endMonth}-${endDay}`; // Formatear la fecha en formato yyyy-mm-dd
            const filters = "?start_date=" + formattedStartDate + "&end_date=" + formattedEndDate;
            await getPanelData(filters);
        } else {
            const filters = "?start_date=" + formattedStartDate + "&end_date=" + formattedStartDate;
            await getPanelData(filters);
        }

    };

    const handleButtonClick = (e) => {
      e.preventDefault();
      setIsOpen(!isOpen);
    };

    const ref = useRef();

    const handleClickOutside = event => {
        console.log(ref);
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(!isOpen); // Close calendar
        }
      };
      
      useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
          document.removeEventListener("click", handleClickOutside, true);
        };
      });
    

    return (
        <div className='mx-2 my-3'>
            <button className='filters' onClick={handleButtonClick}>
                Fechas
            </button>
            <button className={active === "year" ? "active-filters" : "filters"} id={"year"} onClick={(event) => { getDataWithFilter("?year=1", event) }}>
                Anual
            </button>
            <button className={active === "month-1" ? "active-filters" : "filters"} id={"month-1"} onClick={(event) => { getDataWithFilter("?month=1", event) }}>
                Último mes
            </button>
            <button className={active === "quarter-1" ? "active-filters" : "filters"} id={"quarter-1"} onClick={(event) => { getDataWithFilter("?quarter=1", event) }}>
                1erTrimestre
            </button>
            <button className={active === "quarter-2" ? "active-filters" : "filters"} id={"quarter-2"} onClick={(event) => { getDataWithFilter("?quarter=2", event) }}>
                2ºTrimestre
            </button>
            <button className={active === "quarter-3" ? "active-filters" : "filters"} id={"quarter-3"} onClick={(event) => { getDataWithFilter("?quarter=3", event) }}>
                3erTrimestre
            </button>
            <button className={active === "quarter-4" ? "active-filters" : "filters"} id={"quarter-4"} onClick={(event) => { getDataWithFilter("?quarter=4", event) }}>
                4ºTrimestre
            </button>
            {isOpen && (

                <div className='calendar-overlay' ref={ref}>
                    <DatePicker
                        selected={startDate}
                        // minDate={new Date()}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        isClearable={true}
                    />
                </div>
            )}
        </div>
    )
}

ButtonBar.propTypes = {
    getPanelData: PropTypes.func,
};
