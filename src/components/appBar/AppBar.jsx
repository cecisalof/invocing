import { useEffect, useState } from 'react';
import './style.css'

export const AppBar = (props)  => {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    if (props.location.state !== null) {
      setUserName(props.location.state.name)
    }
  }, [props]);

  return (
    <>
        <div className="appBarContainer">
          {userName !== null ? ( 
            <h1 className="title">Hola <span className='userName'>{userName}</span></h1>
            ) : (
              <h1 className="title">Hola</h1>
            )
          }
          <form className="d-flex searchBar" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          <div className='tools'>
            <div className='settings'>Settings</div>
            <div className='notifications'>Notificactions</div>
            <div className='avatar'>Avatar</div>
          </div>
        </div>
    </>

  )
}
