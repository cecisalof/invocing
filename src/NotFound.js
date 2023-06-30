import React from 'react';
import notFound from './assets/icons/404-tg.svg';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <img src={notFound} style={{width: '25%'}}/>
            <div style={styles.text_h}>
            Oops!
            </div>
            <div style={styles.overlayContainer}>
            <div style={styles.text}>
            Parece que te has perdido. La página que buscas no ha sido encontrada. Por favor, regresa a nuestra página principal y sigue explorando. ¡Gracias!
            </div>
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
  overlayContainer: {
    width: '522px', // Ancho determinado del contenedor
    backgroundColor: 'transparent', // Fondo transparente
    padding: '10px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  text_h: {
    fontSize: '27px',
    fontFamily: 'Nunito',
    color: '#ADB9FB',
    fontWeight: '700',
    marginTop: '10px'
  },
  text: {
    fontSize: '20px',
    fontFamily: 'Nunito',
    color: '#ADB9FB',
    fontWeight: '400',
    
  },
};
