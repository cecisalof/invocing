import { useEffect, useState } from 'react';
import './style.css'
import notificationIcon from '../../assets/icons/Notificacion.png';
import Avatar from '../../assets/icons/avatar.png';
import Context from '../../contexts/context';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  taskStatus
} from "../../pages/invoicesToPay/services";
import { useDispatch, useSelector } from 'react-redux'
import { tasksAdded } from '../../features/tasks/taskSlice'

export const AppBar = (props) => {

  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const userDataContext = useContext(Context);

  const dispatch = useDispatch();

  // Reading tasks global state 
  const tasksState = useSelector(state => state.tasks);

  useEffect(() => {
    if (userDataContext.userData.name !== null) {
      setUserName(userDataContext.userData.name)
    }
    if (userDataContext.userData.photo !== null) {
      setUserPhoto(userDataContext.userData.photo)
    }

  }, [props]);

  const handleNotificationClick = () => {
    setMostrarNotificaciones(!mostrarNotificaciones);
  };

  const getTasksStatus = async () => {
    try {
      const data = await taskStatus(userDataContext.userData.token)
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
    if (tasksState && tasksState.results !== undefined) {
      tasksState && tasksState.results.map((item) => {
        if (new Date(item.created_at).toLocaleDateString() === new Date().toLocaleDateString()) {
          item.result == null && setMostrarNotificaciones(true);
        }
      });
    }
  }, [tasksState])

  const humanizeDuration = (taskCreationDate) => {
    // Make a fuzzy time
    let currentDate = Math.round((new Date() - taskCreationDate) / 1000);

    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let month = day * 30;
    let year = month * 12;

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
    } else if (currentDate < day * 3) {
      textToPrint = 'hace ' + Math.round(currentDate / day) + ' días';
    } else if (currentDate < week) {
      textToPrint = 'hace menos de una semana.';
    } else if (currentDate < week * 2) {
      textToPrint = Math.round(currentDate / week) <= 1 ? 'hace' + Math.round(currentDate / week) + ' semana.' : 'hace' + Math.round(currentDate / week) + ' semanas.' ;
    } else if (currentDate < month) {
      textToPrint = 'hace menos de un mes.';
    } else if (currentDate < month * 2) {
      textToPrint = Math.round(currentDate / month) <= 1 ? 'hace ' + Math.round(currentDate / month) + ' mes' : 'hace ' + Math.round(currentDate / month) + ' meses.';
    } else if (currentDate < year) {
      textToPrint = 'hace menos de un año.';
    } else if (currentDate < year * 2) {
      textToPrint = Math.round(currentDate / year) <= 1 ? 'hace ' + Math.round(currentDate / month) + ' año' : 'hace ' + Math.round(currentDate / month) + ' años.';
    }

    return textToPrint;
  }

  return (
    <>
      <div className="appBarContainer d-flex justify-content-between align-items-center mt-0">
        <h1 className="title mb-0" style={{ color: '#000000' }}>Hola
          {userName !== null && (<span className='userName ms-1' style={{ color: '#005CFF' }}>{userName}</span>)}
        </h1>
        <div className="d-flex justify-content-between align-items-center mt-0">
          <div className='tools'>
            <img src={notificationIcon} alt="Notificatoin icon" onClick={handleNotificationClick} />
            {(userDataContext.isLoadingRef || userDataContext.isLoadingRefEx) && (
              <div className="notification-dot" /> // Agregamos un div con clase para el punto rojo
            )}
            {mostrarNotificaciones && (
              <div className="processes-panel bg-white py-2 px-4">
                <div className="label" htmlFor="taxes_percentage">Notificaciones</div>
                {tasksState && tasksState.results.map((current, index) => {
                  if (new Date(current.created_at).toLocaleDateString() === new Date().toLocaleDateString()) {
                    if (current.result == null) {
                      return <div key={index} className='mt-3'> El archivo <span className='fw-bold'>{current.name}</span> se está procesando.</div>
                    }
                  }
                })}
                <div className='mt-3'> <span className='fw-bold'>Últimos archivos procesados:</span>
                  <ul>
                    {tasksState && tasksState.results.map((item, index) => {
                      // avoid printing unprocessed files
                      if (item.result !== null && item && item.result && !item.result.error) {
                        return <li key={index}>{item.name} <span className='text-secondary fst-italic'>{humanizeDuration(new Date(item.created_at))}</span></li>
                      } else {
                        if (item && item.result && item.result.error) {
                          if (item && item.result && item.result.error.includes('cia_1') || item && item.result && item.result.error.includes('cea_1')) {
                            return <li key={index}>{item.name + ` procesado con errores: ${item && item.result && item.result.error} = Error de lectura de archivo, inténtelo más tarde`} <span className='text-secondary fst-italic'>{humanizeDuration(new Date(item.created_at))}</span></li>
                          } else if (item && item.result && item.result.error.includes('ewi_fff_1') || item && item.result && item.result.error.includes('itp_fff_1')) {
                            return <li key={index}>{item.name + ` procesado con errores: ${item && item.result && item.result.error} = Error al procesar la factura/gasto, inténtelo de nuevo.`} <span className='text-secondary fst-italic'>{humanizeDuration(new Date(item.created_at))}</span></li>
                          } else if (item && item.result && item.result.error.includes('ewi_fff_2') || item && item.result && item.result.error.includes('itp_fff_2')) {
                            return <li key={index}>{item.name + ` procesado con errores: ${item && item.result && item.result.error} = Error al rellenar los datos de la factura/gasto, inténtelo de nuevo.`} <span className='text-secondary fst-italic'>{humanizeDuration(new Date(item.created_at))}</span></li>
                          } else {
                            return <li key={index}>{item.name + ` procesado con errores: Error al procesar la factura/gasto, inténtelo de nuevo.`} <span className='text-secondary fst-italic'>{humanizeDuration(new Date(item.created_at))}</span></li>
                          }
                        }
                      }
                    })
                    }
                  </ul>
                </div>
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
