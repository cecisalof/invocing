import { useLocation } from 'react-router-dom'
import { AppBar } from "../components/appBar/AppBar";

export const Documents = () => {
  const location = useLocation();

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      <div>Documents</div>
    </>
  )
}
