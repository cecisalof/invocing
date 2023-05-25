import axios from 'axios';
import {
    API_URL, BASE_URL
  } from '../../axios/config';

export const getInvoices = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_PAY, {
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

export const deleteInvoice = async (uuid, token) => {
    try {
        const response = await axios.delete( BASE_URL + API_URL.INVOICE_TO_PAY + uuid, {
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


  export const patchInvoice = async (uuid, data, token) => {
    try {
        const response = await axios.patch( BASE_URL + API_URL.INVOICE_TO_PAY + uuid, data, {
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

  export const patchProviderInvoice = async (uuid, data, token) => {
    try {
        const response = await axios.patch( BASE_URL + API_URL.PATCH_PROVIDER + uuid, data, {
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