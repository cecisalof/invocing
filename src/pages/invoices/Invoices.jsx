import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";

export const Invoices = () => {
  console.log("Entro")
  const location = useLocation();
  

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      <div>Aquí facturas!!</div>
    </>
  )
}
