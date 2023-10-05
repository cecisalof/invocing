import { useEffect, useState } from 'react';
import './style.css'
// import settingsIcon from '../../assets/icons/Ajustes.png';
import notificationIcon from '../../assets/icons/Notificacion.png';
// import SearchIcon from '../../assets/icons/Buscar.png';
import Avatar from '../../assets/icons/avatar.png';
import Context from '../../contexts/context';
import { useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  taskStatus
} from "../../pages/invoicesToPay/services";
import { useDispatch, useSelector } from 'react-redux'
import { tasksAdded } from '../../features/tasks/taskSlice'

export const AppBar = (props) => {

  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [currentTask, setCurrentTask] = useState({});
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const userDataContext = useContext(Context);

  const dispatch = useDispatch();

  // Reading tasks global state 
  const tasksState = useSelector(state => state.tasks);

  // getting current task state
  const processedFiles = useSelector(state => state.processedFiles);

  useEffect(() => {
    if (userDataContext.userData.name !== null) {
      setUserName(userDataContext.userData.name)
    }
    if (userDataContext.userData.photo !== null) {
      setUserPhoto(userDataContext.userData.photo)
    }

  }, [props]);

  // function handleSettingsClick() {
  //   console.log('Botón de ajustes clickeado');
  // }

  const handleNotificationClick = () => {
    setMostrarNotificaciones(!mostrarNotificaciones);
  };

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   console.log('Search');
  //   // Aquí puedes agregar la lógica para manejar la búsqueda
  // }

  const getTasksStatus = async () => {
    try {
      const data = await taskStatus(userDataContext.userData.token)
      // setTaskResponse(data.data);
      dispatch(tasksAdded(data.data));
    } catch (error) {
      dispatch(tasksAdded([]));
      console.log('No hay datos para mostrar.')
    }
  };


  useEffect(() => {
    getTasksStatus();
    // Implementing the setInterval method
    const interval = setInterval(() => {
      getTasksStatus();
    }, 10000);
    // Clearing the interval: stop the interval when the component unmounts.
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    processedFiles.processed.success.map((item) => {
      setCurrentTask(JSON.parse(item));
    });
  }, [processedFiles])

  // if (processedFiles && processedFiles.processed && processedFiles.processed.success.length > 1) {
  //   setTimeout(() => {
  //     setMostrarNotificaciones(!mostrarNotificaciones);
  //   }, 4000);
  // }

  const humanizeDuration = (taskCreationDate) => {
    // Make a fuzzy time
    let currentDate = Math.round((new Date() - taskCreationDate) / 1000);

    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    // let month = day * 30;
    // let year = month * 12;

    let textToPrint;

    if (currentDate < 30) {
      textToPrint = 'ahora mismo.';
    } else if (currentDate < minute) {
      textToPrint = 'hace ' + currentDate + ' segundos';
    } else if (currentDate < 2 * minute) {
      textToPrint = 'hace un minuto.'
    } else if (currentDate < hour) {
      textToPrint = 'hace ' + Math.floor(currentDate / minute) + ' minutos.';
    } else if (Math.floor(currentDate / hour) == 1) {
      textToPrint = 'hace 1 hora.'
    } else if (currentDate < day) {
      textToPrint = 'hace ' + Math.floor(currentDate / hour) + ' horas';
    } else if (currentDate < day * 2) {
      textToPrint = 'ayer';
    } else if(currentDate < day * 3){
      textToPrint = 'hace más de dos días';
    } else if (currentDate < week * 2) {  // needs review!
      textToPrint = Math.floor(currentDate / week) + ' semanas.';
    } else if (currentDate < week * 4) {  // needs review!
      textToPrint = 'hace un mes.';
    } else if (currentDate < week * 5) { // needs review!
      textToPrint = 'hace más de un mes.';
    }

    return textToPrint;
  }

  return (
    <>
      <div className="appBarContainer d-flex justify-content-between align-items-center mt-0">
        <h1 className="title mb-0" style={{ color: '#000000' }}>Hola
          {userName !== null && (<span className='userName ms-1' style={{ color: '#005CFF' }}>{userName}</span>)}
        </h1>
        {/* <form className="d-flex searchBar" role="search" onSubmit={handleSubmit}>
            <img src={SearchIcon} alt="Search icon" style={{ marginRight: '10px' } } />
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          </form> */}

        <div className="d-flex justify-content-between align-items-center mt-0">
          <div className='tools'>
            <img src={notificationIcon} alt="Notificatoin icon" onClick={handleNotificationClick} />
            {(userDataContext.isLoadingRef || userDataContext.isLoadingRefEx) && (
              <div className="notification-dot" /> // Agregamos un div con clase para el punto rojo
            )}
            {mostrarNotificaciones && (
              <div className="processes-panel bg-white py-2 px-4">
                <div className="label" htmlFor="taxes_percentage">Notificaciones</div>
                {processedFiles && processedFiles.processed && processedFiles.processed.success.length > 1 &&
                  <div className='mt-3'> El archivo <span className='fw-bold'>{currentTask.name}</span> se ha procesado {currentTask.result.success === true ? 'exitosamente' : 'con fallos'}</div>
                }
                {/* {processedFiles && processedFiles.processed && processedFiles.processed.success.length === 1 && */}
                <div className='mt-3'> <span className='fw-bold'>Últimos archivos procesados:</span>
                  <ul>
                    {tasksState && tasksState.results.map((item, index) => {
                      if (index < 20) {
                        return <li key={index}>{item.name} <span className='text-secondary fst-italic'>{humanizeDuration(new Date(item.created_at))}</span></li>
                      }
                    })
                    }
                  </ul>
                </div>
                {/* } */}
                {userDataContext.isLoadingRefEx && (<label style={{ fontFamily: 'Nunito', color: '#999999', fontSize: '12px' }} >Procesando gastos</label>)}
                {userDataContext.isLoadingRefEx && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <ProgressBar
                      now={userDataContext.progressEx}
                      label={userDataContext.progressEx === 0 ? "0%" : `${userDataContext.progressEx}%`}
                      animated={userDataContext.progressEx === 0}
                      variant="custom-color"
                      className="mb-3"
                      style={{ width: '200px' }}
                    />
                  </div>)}
              </div>

            )}


          </div>

          <div className="circle">
            {userPhoto[0] !== null ? (
              <img src={userPhoto} alt="Avatar icon" />
            ) : (
              <img src={Avatar} alt="General" />
            )
            }
          </div>
        </div>
      </div>
      <p className="mb-3">{props.subtitle}</p>
    </>
  )
}

AppBar.propTypes = {
  subtitle: PropTypes.string,
};
