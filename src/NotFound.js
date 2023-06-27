import React from 'react';
import notFound from './assets/icons/404.png';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <img src={notFound}/>
            <div id="info">
                <h3>This page could not be found</h3>
            </div>
        </div >
    )
};

export default NotFound;

// Estilos CSS
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  text: {
    fontSize: '16px',
  },
};
