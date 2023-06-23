import axios from 'axios';
import {
    API_URL, BASE_URL
  } from '../../axios/config';



export const getInvoicesStates = async (token, filters=null) => {
    try {

        let url = BASE_URL + API_URL.INVOICE_TO_PAY_STATES
        if (filters){
            url = url + filters}
        
        const response = await axios.get(url, {
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

export const getInvoicesCount = async (token, filters=null) => {
    try {
        let url = BASE_URL + API_URL.INVOICE_TO_PAY_COUNT
        if (filters){
            url = url + filters}
        const response = await axios.get(url, {
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

export const getInvoicesTotals = async (token, filters=null) => {
    let url = BASE_URL + API_URL.INVOICE_TO_PAY_TOTALS
        if (filters){
            url = url + filters}
    try {
        const response = await axios.get(url, {
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

  export const getInvoicesEmitStates = async (token, filters=null) => {
    try {
        let url = BASE_URL + API_URL.INVOICE_TO_EMIT_STATES
        if (filters){
            url = url + filters}
        const response = await axios.get(url, {
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

export const getInvoicesEmitCount = async (token, filters=null) => {
    try {
        let url = BASE_URL + API_URL.INVOICE_TO_EMIT_COUNT
        if (filters){
            url = url + filters}
        const response = await axios.get(url, {
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

export const getInvoicesEmitTotals = async (token, filters=null) => {
    try {
        let url =  BASE_URL + API_URL.INVOICE_TO_EMIT_TOTALS
        if (filters){
            url = url + filters}
        console.log(url)
        const response = await axios.get(url, {
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