import axios from 'axios';
import {
    API_URL, BASE_URL
  } from '../../axios/config';

export const getExpenseTicket = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.EXPENSE_TICKET, {
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

export const deleteExpenseTicket = async (uuid, token) => {
    try {
        const response = await axios.delete( BASE_URL + API_URL.EXPENSE_TICKET + uuid, {
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


  export const patchExpenseTicket = async (uuid, data, token) => {
    try {
        const response = await axios.patch( BASE_URL + API_URL.EXPENSE_TICKET + uuid, data, {
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

  export const patchProviderExpenseTicket = async (uuid, data, token) => {
    try {
        const response = await axios.patch( BASE_URL + API_URL.EXPENSE_TICKET + uuid, data, {
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

  export const postExpenseTicket = async (token, data) => {
    try {
        const response = await axios.post(BASE_URL + API_URL.EXPENSE_TICKET, data, {
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

  export const postExpenseTicketAutomatic = async (token, fileList) => {
    try {
        const formData = new FormData();
        
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            formData.append('files', file);
        }
        const response = await axios.post(BASE_URL + API_URL.EXPENSE_TICKET_AUTOMATIC, formData, {
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

  export const expensesTicketsExcel = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.EXPENSES_TICKETS_EXCEL, {
            headers: { 
                'accept': 'application/json', 
                'Authorization': `Token ${token}`,
            },
            params: {
                limit: 500,
                offset: 0
            },
            responseType: 'blob'
        });
        return response;
      } catch (error) {
        return console.log('error');
      }
  };