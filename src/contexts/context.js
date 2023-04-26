import React from 'react';

export default React.createContext({
  userData: {},
  removeUser: () => {},
  updateUserData: (newUserData) => {},
});