import axios from 'axios';

export const getProviders = async () => {
    try {
        const response = await axios.get( 'https://data.tramitgo.com/api/providers/', {
            headers: { 
                'accept': 'application/json', 
                'Authorization': 'Token f787712d52229f4ee1744079b33a6f5c5a93e38e', 
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