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

  export const postInvoice = async (token, data) => {
    try {
        const response = await axios.post(BASE_URL + API_URL.INVOICE_TO_PAY, data, {
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

  export const postInvoiceAutomatic = async (token, fileList) => {
    try {
        const formData = new FormData();
        
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            formData.append('files', file);
        }
        console.log(formData)
        const response = await axios.post(BASE_URL + API_URL.INVOICE_TO_PAY_AUTOMATIC, formData, {
            headers: { 
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            params: {
                limit: 500,
                offset: 0
            },
        })
        
        return response;
      } catch (error) {console.log(error);
        return console.log('error');
        
      }
  };

  export const getSchenduleStatus = async (token, ids) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.SCHENDULE_STATUS + '?'+ ids.map(id => `id=${id}`).join('&'), {
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