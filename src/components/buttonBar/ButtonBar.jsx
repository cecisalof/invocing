import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PropTypes from 'prop-types';

export default function ButtonBar(props) {

    const { getPanelData } = props;

    const [selectedRange, setSelectedRange] = useState([new Date(), new Date()]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [active, setActive] = useState("year");

    const getDataWithFilter = async (filters, event) => {
        await getPanelData(filters);
        setActive(event.target.id);
    };

    const selectRange = async (dateParam) => {

        //if (selectedRange || selectedRange.length === 2) {
        // Verificar si selectedRange es nulo o no tiene dos fechas
        const startDate = dateParam[0][0]
        const endDate = dateParam[0][1]
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

        setSelectedRange([new Date(), new Date()]);

        //}

    };

    const handleSelect = (date) => {
        if (selectedRange.length === 2) {
            setSelectedRange([date, date]);
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

    const handleButtonClick = () => {
        setSelectedRange([new Date(), new Date()]);
        setShowCalendar(!showCalendar);
    };

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
            {showCalendar && (

                <div className='calendar-overlay'>
                    <Calendar
                        selectRange
                        value={selectedRange}
                        onChange={handleSelect} />
                </div>
            )}
        </div>
    )
}

ButtonBar.propTypes = {
    getPanelData: PropTypes.func,
};
