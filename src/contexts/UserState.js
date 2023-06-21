import React from 'react';
import Context from './context';

export default class UserState extends React.Component{
  

  state = {
    userData: {},
    files: [],
    progress: 0,
    isLoadingRef: false,
    processBotton: false,
    filesEx: [],
    progressEx: 0,
    isLoadingRefEx: false,
    processBottonEx: false,
    isSuccess: false,
    isError: false,
    isSuccessEx: false,
    isErrorEx: false,

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


  toggleProcessBotton = () => {
    this.setState((prevState) => ({
      processBotton: !prevState.processBotton,
    }));
    window.localStorage.setItem('processBotton', JSON.stringify(this.state.processBotton));
  };

  toggleProcessBottonEx = () => {
    this.setState((prevState) => ({
      processBottonEx: !prevState.processBottonEx,
    }));
    window.localStorage.setItem('processBottonEx', JSON.stringify(this.state.processBottonEx));
  };


  toggleSuccess = () => {
    this.setState((prevState) => ({
      isSuccess: !prevState.isSuccess,
    }));
    window.localStorage.setItem('isSuccess', JSON.stringify(this.state.isSuccess));
  };

  toggleError = () => {
    this.setState((prevState) => ({
      isError: !prevState.isError,
    }));
    window.localStorage.setItem('isError', JSON.stringify(this.state.isError));
  };

  toggleSuccessEx = () => {
    this.setState((prevState) => ({
      isSuccessEx: !prevState.isSuccessEx,
    }));
    window.localStorage.setItem('isSuccessEx', JSON.stringify(this.state.isSuccessEx));
  };

  toggleErrorEx = () => {
    this.setState((prevState) => ({
      isErrorEx: !prevState.isErrorEx,
    }));
    window.localStorage.setItem('isErrorEx', JSON.stringify(this.state.isErrorEx));
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
          processBotton: this.state.processBotton,
          filesEx: this.state.filesEx,
          progressEx: this.state.progressEx,
          isLoadingRefEx: this.state.isLoadingRefEx,
          processBottonEx: this.state.processBottonEx,
          isSuccess: this.state.isSuccess,
          isError: this.state.isError,
          isSuccessEx: this.state.isSuccessEx,
          isErrorEx: this.state.isErrorEx,
          removeUser: this.removeUser,
          updateUserData: this.updateUserData,
          updateFiles: this.updateFiles,
          updateProgress: this.updateProgress,
          toggleLoading: this.toggleLoading,
          updateFilesEx: this.updateFilesEx,
          updateProgressEx: this.updateProgressEx,
          toggleLoadingEx: this.toggleLoadingEx,
          toggleError: this.toggleError,
          toggleErrorEx: this.toggleErrorEx,
          toggleSuccess:this.toggleSuccess,
          toggleSuccessEx: this.toggleSuccessEx,
          toggleProcessBotton: this.toggleProcessBotton,
          toggleProcessBottonEx: this.toggleProcessBottonEx,

        }}
      >
        {this.props.children}
      </Context.Provider>
    );
 }
}