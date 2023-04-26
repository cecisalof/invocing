import { useEffect, useState } from 'react';
import './style.css'
import settingsIcon from '../../assets/icons/Ajustes.png';
import notificationIcon from '../../assets/icons/Notificacion.png';
import SearchIcon from '../../assets/icons/Buscar.png';
import Avatar from '../../assets/icons/avatar.png';
import Context from '../../contexts/context';
import { useContext } from 'react';

export const AppBar = (props)  => {
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const userDataContext = useContext(Context);

  
  useEffect(() => {
    if (userDataContext.userData.name !== null) {
      setUserName(userDataContext.userData.name)
    }
    if (userDataContext.userData.photo !== null) {
      setUserPhoto(userDataContext.userData.photo)
    }

  }, [props]);

  function handleSettingsClick() {
    console.log('Botón de ajustes clickeado');
    

  }

  function handleNotificationClick() {
    console.log('Botón de notificaciones clickeado');
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Search');
    // Aquí puedes agregar la lógica para manejar la búsqueda
  }

  return (
    <>
        <div className="appBarContainer">
          {userName !== null ? ( 
            <h1 className="title" style={{ color: '#000000' }}>Hola <span className='userName' style={{ color: '#005CFF' }}>{userName}</span></h1>
            ) : (
              <h1 className="title" style={{ color: '#000000' }}>Hola</h1>
            )
          }
          <form className="d-flex searchBar" role="search" onSubmit={handleSubmit}>
            <img src={SearchIcon} alt="Search icon" style={{ marginRight: '10px' } } />
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          </form>

          <div className='tools'>
          <img src={notificationIcon} alt="Notificatoin icon" onClick={handleNotificationClick} style={{ marginRight: '30px',  marginLeft: '50px'  }} />
          <img src={settingsIcon} alt="Setting icon" onClick={handleSettingsClick} />
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
