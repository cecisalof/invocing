import axios from 'axios';
import {
    API_URL, BASE_URL
  } from '../../axios/config';

export const getIncome = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_EMIT, {
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

export const deleteIncome = async (uuid, token) => {
    try {
        const response = await axios.delete( BASE_URL + API_URL.INVOICE_TO_EMIT + uuid, {
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


  export const patchIncome = async (uuid, data, token) => {
    console.log(token)
    try {
        const response = await axios.patch( BASE_URL + API_URL.INVOICE_TO_EMIT + uuid, data, {
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

  export const postIncome = async (token, data) => {
    try {
        const response = await axios.post(BASE_URL + API_URL.INVOICE_TO_EMIT_PDF, data, {
            headers: { 
                'accept': 'application/json', 
                'Authorization': `Token ${token}`
            },
            params: {
                limit: 500,
                offset: 0
            },
        });
        return response;
      } catch (error) {
        return console.log('error');
      }
  };