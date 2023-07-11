import React from 'react';

export default React.createContext({
  userData: {},
  isInitialLoading: true,
  removeUser: () => {},
  updateUserData: () => {},
});