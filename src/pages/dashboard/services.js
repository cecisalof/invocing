import axios from 'axios';
import {
    API_URL, BASE_URL
  } from '../../axios/config';



export const getInvoicesStates = async (token) => {
    try {
        
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_PAY_STATES, {
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

export const getInvoicesMonth = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_PAY_MONTH, {
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

export const getInvoicesTotals = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_PAY_TOTALS, {
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

  export const getInvoicesEmitStates = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_EMIT_STATES, {
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

export const getInvoicesEmitMonth = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_EMIT_MONTH, {
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

export const getInvoicesEmitTotals = async (token) => {
    try {
        const response = await axios.get(BASE_URL + API_URL.INVOICE_TO_EMIT_TOTALS, {
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