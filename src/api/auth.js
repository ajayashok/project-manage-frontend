import axios from './axios';

export const login = async (email, password) => {
  return axios.post('/login', { email, password });
};

export const register = async (name,email, password) => {
    return axios.post('/register', { name,email, password });
};

export const logout = async () => {
  return axios.post('/logout');
};