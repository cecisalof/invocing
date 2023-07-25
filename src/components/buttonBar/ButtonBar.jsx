import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import 'react-calendar/dist/Calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../pages/general-style.css';
import PropTypes from 'prop-types';

export default function ButtonBar(props) {

    const { getPanelData } = props;

    const [active, setActive] = useState('year');
    console.log('active', active);
    const [filters, setFilters] = useState("?year=1");
    console.log('filters', filters);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const getDataWithFilter = async (filters, event) => {
        await getPanelData(filters);
        setActive(event.target.id);
        setFilters(filters);
    };

    useEffect( () => {
        if (startDate == null && endDate == null) { // if there is no date range selected, active year filter by default
            getPanelData(filters);
            setActive(active);
        } else { // id there is a date range selected, clear/desactivate button period filter
            selectRange(startDate, endDate);
            setActive(null);
            setFilters(null);
        }
    }, [startDate, endDate])


    useEffect( () => {
        if (active !== null && filters !== null) { // if a button period is selected, clear date range
            setStartDate(null);
            setEndDate(null);
        }
    }, [active, filters])


    const selectRange = async (startDate, endDate) => {

        if (startDate !== null && endDate !== null) {
            const startYear = startDate.getFullYear(); // Obtener el año (ejemplo: 2023)
            const startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
            const startDay = ('0' + startDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
            const formattedStartDate = `${startYear}-${startMonth}-${startDay}`; // Formatear la fecha en formato yyyy-mm-dd

            const endYear = endDate.getFullYear(); // Obtener el año (ejemplo: 2023)
            const endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2); // Obtener el mes, agregando 1 al índice base 0 y asegurándose de tener dos dígitos (ejemplo: 06)
            const endDay = ('0' + endDate.getDate()).slice(-2); // Obtener el día y asegurarse de tener dos dígitos (ejemplo: 05)
            const formattedEndDate = `${endYear}-${endMonth}-${endDay}`; // Formatear la fecha en formato yyyy-mm-dd
            const filters = "?start_date=" + formattedStartDate + "&end_date=" + formattedEndDate;
            await getPanelData(filters);
        }
    };

    return (
        <div className='mx-2 my-3'>
            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                    const [start, end] = update;
                    setStartDate(start);
                    setEndDate(end);
                }}
                dateFormat="yyyy/MM/dd"
                isClearable={true}
                placeholderText="Buscar por fecha"
            />
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
        </div>
    )
}

ButtonBar.propTypes = {
    getPanelData: PropTypes.func,
};
