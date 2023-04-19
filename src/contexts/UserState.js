import React from 'react';
import Context from './context';

export default class UserState extends React.Component{

  state = {
    userData: {},
  }

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
            removeUser: this.removeUser,
            updateUserData: this.updateUserData,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
 }
}