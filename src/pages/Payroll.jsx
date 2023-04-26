import { useLocation } from 'react-router-dom'
import { AppBar } from "../components/appBar/AppBar";

export const Payroll = () => {
  const location = useLocation();

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      <div>Payroll</div>
    </>
  )
}