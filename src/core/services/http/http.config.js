import axios from 'axios';

export const getBaseUrl = () => "https://employees.codepremium.es/doc/?format=openapi";
export const getBaseHeaders = () => ({ 'Content-type': 'application/json' });
export const getTimeout = () => 60000;
export const successHandler = (response) => response;
export const errorHandler = async (error) => {
  if (error?.response?.status === 401) {
    // logoutProcess();
  }
  return Promise.reject(error);
};

const httpInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: { ...getBaseHeaders() },
  timeout: getTimeout(),
});


export default httpInstance;