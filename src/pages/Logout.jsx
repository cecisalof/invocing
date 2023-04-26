import { useContext } from 'react';
import Context from '../contexts/context';
import React, { useEffect } from 'react';

export const Logout = () => {
  const userDataContext = useContext(Context);

  useEffect( () => { // Check if user is already logged in
    userDataContext.removeUser()
  }, [userDataContext])

  return (
    <>
      <div>Log out..</div>
    </>
  )
}
