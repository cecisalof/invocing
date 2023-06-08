import React from 'react';

export default React.createContext({
  userData: {},
  files: [],
  progress: 0,
  isLoadingRef: false,
  filesEx: [],
  progressEx: 0,
  isLoadingRefEx: false,
  removeUser: () => {},
  updateUserData: (newUserData) => {},
  updateFiles: (newFiles) => [],
  updateProgress: (newProgress) => 0,
  toggleLoading: () => false,
  updateFilesEx: (newFilesEx) => [],
  updateProgressEx: (newProgressEx) => 0,
  toggleLoadingEx: () => false,
});