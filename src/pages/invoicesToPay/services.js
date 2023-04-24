import axios from 'axios';

export const getInvoices = async (token) => {
    try {
        const response = await axios.get( 'https://data.tramitgo.com/api/invoice-to-pay/', {
            headers: { 
                'accept': 'application/json', 
                'Authorization': `Token ${token}`
                //'Authorization': 'Token ab501632ab4cde6d6b923ba427d341cbbbc69480', 
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