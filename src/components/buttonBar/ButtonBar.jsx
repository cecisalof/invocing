import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import 'react-calendar/dist/Calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../pages/general-style.css';
import PropTypes from 'prop-types';
import {
    taskStatus
} from "../../pages/invoicesToPay/services";
import { useSelector, useDispatch } from 'react-redux'
import { tasksAdded } from '../../store/slice'

export default function ButtonBar(props) {
    const { getPanelData, userToken } = props;

    const [active, setActive] = useState('year');
    const [filters, setFilters] = useState("?year=1");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tasksState, setTasksState] = useState([
        // {
        //   "uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //   "success": 0,
        //   "fail": 1,
        //   "total": 1,
        //   "items": [
        //     {
        //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //       "result": null,
        //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
        //       "created_at": "2023-07-18T13:13:10.248578Z"
        //     },
        //     {
        //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //       "success": true,
        //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
        //       "created_at": "2023-07-18T13:13:10.248578Z"
        //     }, {
        //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //       "error": true,
        //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
        //       "created_at": "2023-07-18T13:13:10.248578Z"
        //     }
        //   ]
        // },
        // {
        //   "uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //   "success": 0,
        //   "fail": 1,
        //   "total": 1,
        //   "items": [
        //     {
        //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //       "result": null,
        //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
        //       "created_at": "2023-07-18T13:13:10.248578Z"
        //     },
        //     {
        //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //       "success": true,
        //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
        //       "created_at": "2023-07-18T13:13:10.248578Z"
        //     }, {
        //       "bulk_uuid": "690d6d4a-8d99-4f07-b2d2-fe0f511688c4",
        //       "error": true,
        //       "name": "typeform_invoice_BTLYoRTkMTvz5VGv.pdf",
        //       "created_at": "2023-07-18T13:13:10.248578Z"
        //     }
        //   ]
        // },
    ])

    // BRING INITIAL REDUX STATE 
    useSelector(state => state.tasks);

    // DISPATCH NEW TASKSTATE TO GLOBAL REDUX STATE
    const dispatch = useDispatch();
    dispatch(tasksAdded(tasksState));
    
    const getDataWithFilter = async (filters, event) => {
        await getPanelData(filters);
        setActive(event.target.id);
        setFilters(filters);
    };

    useEffect(() => {
        if (startDate == null && endDate == null) { // if there is no date range selected, year filter will be activated by default
            getPanelData(filters);
            setActive(active);
        } else { // if there is a date range selected, clear/desactivate button period filter
            selectRange(startDate, endDate);
            setActive(null);
            setFilters(null);
        }
    }, [startDate, endDate])

    const getTasksStatus = async () => {
        try {
            const data = await taskStatus(userToken)
            setTasksState(data.data)
            dispatch(tasksAdded(data.data.map(task => task )));
        } catch (error) {
            setTasksState([])
            console.log('No hay datos para mostrar.')
        }
    };

    // const updateBarPercentage = () => {
    //     for (const [i, fileQueue] of tasksState.entries()) { // fileQueue represents each file queue in getTasksStatus().

    //         // fileQueue.items is an array with processed files in each file queue
    //         i == 0 && fileQueue.items.map((item) => {
    //             console.log(item);
    //             // checkingLoadedFiles(item);
    //             if (item.result == null) {
    //                 console.log('getTasksStatus again!')
    //                 setTimeout(() => {
    //                     getTasksStatus() // Wait 10 secs & re-run getTasksStatus()
    //                 }, 10000);

    //             } else if (item.result.success) {
    //                 console.log('Archivo procesado y subido:', item.name)

    //                 // change bar percentage first
    //                 setSuccessProgressBarPercentage(Math.round((fileQueue.success * 100) / fileQueue.total))

    //                 // TO DO: acumular en un arreglo y comporbar si existe en taskState. Si existe, sacarlo de taskState para que no se repita su comprobación.       

    //             } else if (item.result.error) {
    //                 console.log(`El archivo ${item.name} ha fallado:`, item.result.detail);

    //                 // reset successProgressBarPercentage first!
    //                 setSuccessProgressBarPercentage(0)
    //                 // set failProgressBarPercentage
    //                 setFailProgressBarPercentage(Math.round((fileQueue.fail * 100) / fileQueue.total));
    //             }
    //         })
    //     }
    // }


    useEffect(() => {
        if (active !== null && filters !== null) { // if a button period is selected, clear date range
            setStartDate(null);
            setEndDate(null);
        }
    }, [active, filters])

    useEffect(() => {
        //Implementing the setInterval method
        const interval = setInterval(() => {
            getTasksStatus();
        }, 10000);
        //Clearing the interval: stop the interval when the component unmounts.
        return () => clearInterval(interval);
    }, []);


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
    userToken: PropTypes.string.isRequired,
};
