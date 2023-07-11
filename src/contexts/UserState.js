import React from 'react';
import Context from './context';
import PropTypes from 'prop-types';

export default class UserState extends React.Component{
  

  state = {
    userData: {},
    isInitialLoading: true
  }

  componentDidMount() {
    this.readFromMemory()
  }
  
  removeUser = () => {
      this.setState({userData: {}});
      window.localStorage.setItem('userData', JSON.stringify({}));
  };

  updateUserData = (newUserData) => {
      this.setState({userData: newUserData});
      window.localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  readFromMemory = async () => {
    try{
      let storedValues = window.localStorage.getItem('userData');
      storedValues = JSON.parse(storedValues)
      this.setState({userData: storedValues, isInitialLoading: false});
    } catch(error) { 
      console.error(error)
    }  
  };

  render(){
    return (
      <Context.Provider 
        value={{
          userData: this.state.userData,
          isInitialLoading: this.state.isInitialLoading,
          removeUser: this.removeUser,
          updateUserData: this.updateUserData,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
 }
}
UserState.propTypes = {
  children: PropTypes.node.isRequired,
};