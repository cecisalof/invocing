import { useEffect, useState } from 'react';
import './style.css'
// import settingsIcon from '../../assets/icons/Ajustes.png';
import notificationIcon from '../../assets/icons/Notificacion.png';
// import SearchIcon from '../../assets/icons/Buscar.png';
import Avatar from '../../assets/icons/avatar.png';
import Context from '../../contexts/context';
import { useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';


export const AppBar = (props)  => {
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const userDataContext = useContext(Context);

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

  return (
    <>
        <div className="appBarContainer">
          {userName !== null ? ( 
            <h1 className="title" style={{ color: '#000000' }}>Hola <span className='userName' style={{ color: '#005CFF' }}>{userName}</span></h1>
            ) : (
              <h1 className="title" style={{ color: '#000000' }}>Hola</h1>
            )
          }
        
          {/* <form className="d-flex searchBar" role="search" onSubmit={handleSubmit}>
            <img src={SearchIcon} alt="Search icon" style={{ marginRight: '10px' } } />
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          </form> */}

          <div className='tools d-none'>
          <img src={notificationIcon} alt="Notificatoin icon" onClick={handleNotificationClick} />
          {(userDataContext.isLoadingRef || userDataContext.isLoadingRefEx) && (
          <div className="notification-dot" /> // Agregamos un div con clase para el punto rojo
      )}
          {mostrarNotificaciones && (
        <div className="processes-panel">
          <label className="label" htmlFor="taxes_percentage">Notificaciones</label>
          {userDataContext.isLoadingRef && (<label style={{ fontFamily: 'Nunito', color: '#999999', fontSize: '12px'}} >Procesando facturas</label>)}
              {userDataContext.isLoadingRef && (

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                
                <ProgressBar
                  now={userDataContext.progress}
                  label={userDataContext.progress === 0 ? "0%" : `${userDataContext.progress}%`}
                  animated={userDataContext.progress === 0}
                  variant="custom-color"
                  className="mb-3"
                  style={{ width: '200px' }}
                />
                </div>)}
                {userDataContext.isLoadingRefEx && (<label style={{fontFamily: 'Nunito', color: '#999999', fontSize: '12px'}} >Procesando gastos</label>)}
                {userDataContext.isLoadingRefEx && (
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    
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
              <img src={Avatar} alt="General"/>
            )
          }
          </div>
        </div>
    </>

  )
}
