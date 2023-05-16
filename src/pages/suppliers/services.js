

  import axios from 'axios';
  import {
      API_URL, BASE_URL
    } from '../../axios/config';
  
  export const getProviders = async (token) => {
      try {
          const response = await axios.get(BASE_URL + API_URL.PROVIDER, {
              headers: { 
                  'accept': 'application/json', 
                  'Authorization': `Token ${token}`
              },
              params: {
                  limit: 500,
                  offset: 0
              },
          });
          return response.data;
        } catch (error) {
          return console.log('error');
        }
    };
  
  export const deleteProvider = async (uuid, token) => {
      try {
          const response = await axios.delete( BASE_URL + API_URL.PROVIDER + uuid, {
              headers: { 
                  'accept': 'application/json', 
                  'Authorization': `Token ${token}`
              },
              params: {
                  limit: 500,
                  offset: 0
              },
          });
          return response.data;
        } catch (error) {
          return console.log(error);
        }
    };
  
  
    export const patchProvider = async (uuid, data, token) => {
      console.log(token)
      try {
          const response = await axios.patch( BASE_URL + API_URL.PROVIDER + uuid, data, {
              headers: { 
                  'accept': 'application/json', 
                  'Authorization': `Token ${token}`
              },
              params: {
                  limit: 500,
                  offset: 0
              },
          });
          return response.data;
        } catch (error) {
          return console.log(error);
        }
    };