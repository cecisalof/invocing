
import { useLocation } from 'react-router-dom'
import { AppBar } from "../components/appBar/AppBar";

export const Home = (props) => {
  const location = useLocation();
  console.log(props)

  return (
    <>
      <div>
        <AppBar location={location}/>
      </div>
      {/* <div>Home</div> */}
    </>
  )
}
