import React from 'react';
import Context from './context';

export default class UserState extends React.Component{
  

  state = {
    userData: {},
    files: [],
    progress: 0,
    isLoadingRef: false,
    filesEx: [],
    progressEx: 0,
    isLoadingRefEx: false,
  }

  updateFiles = (newFiles) => {
    this.setState({ files: newFiles });
    window.localStorage.setItem('files', JSON.stringify(newFiles));
  };

  updateProgress = (newProgress) => {
    this.setState({ progress: newProgress });
    window.localStorage.setItem('progress', JSON.stringify(newProgress));
  };

  toggleLoading = () => {
    this.setState((prevState) => ({
      isLoadingRef: !prevState.isLoadingRef,
    }));
    window.localStorage.setItem('isLoadingRef', JSON.stringify(this.state.isLoadingRef));
  };

  updateFilesEx = (newFilesEx) => {
    this.setState({ filesEx: newFilesEx });
    window.localStorage.setItem('filesEx', JSON.stringify(newFilesEx));
  };

  updateProgressEx = (newProgressEx) => {
    this.setState({ progressEx: newProgressEx });
    window.localStorage.setItem('progressEx', JSON.stringify(newProgressEx));
  };

  toggleLoadingEx = () => {
    this.setState((prevState) => ({
      isLoadingRefEx: !prevState.isLoadingRefEx,
    }));
    window.localStorage.setItem('isLoadingRefEx', JSON.stringify(this.state.isLoadingRefEx));
  };

  componentDidMount() {
    console.log('Mirando state!')
    this.readFromMemory()
 }
  
  removeUser = () => {
      this.setState({userData: {}});
      window.localStorage.setItem('userData', JSON.stringify({}));
  };

  updateUserData = (newUserData) => {
    console.log('Se va a guardar,,,', newUserData)
      this.setState({userData: newUserData});
      window.localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  readFromMemory = async () => {
    try{
      let storedValues = window.localStorage.getItem('userData');
      // console.log('stored', storedValues)
      storedValues = JSON.parse(storedValues)
      console.log('parsed', storedValues)
      this.setState({userData: storedValues});
    } catch(error) { 
      console.error(error)
    }  
  };

  render(){
    return (
      <Context.Provider 
        value={{
          userData: this.state.userData,
          files: this.state.files,
          progress: this.state.progress,
          isLoadingRef: this.state.isLoadingRef,
          filesEx: this.state.filesEx,
          progressEx: this.state.progressEx,
          isLoadingRefEx: this.state.isLoadingRefEx,
          removeUser: this.removeUser,
          updateUserData: this.updateUserData,
          updateFiles: this.updateFiles,
          updateProgress: this.updateProgress,
          toggleLoading: this.toggleLoading,
          updateFilesEx: this.updateFilesEx,
          updateProgressEx: this.updateProgressEx,
          toggleLoadingEx: this.toggleLoadingEx,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
 }
}