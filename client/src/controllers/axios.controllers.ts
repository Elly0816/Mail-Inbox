import axios, { AxiosInstance } from 'axios';

// config({ path: '../../' });

const BASE = 'http://localhost:5000';

let instance: AxiosInstance | undefined;

if (BASE) {
  instance = axios.create({
    baseURL: BASE,
    timeout: 1000,
    withCredentials: true,
  });
  if (!instance) {
    console.log('There was an error axios create');
    console.error(instance);
  }
} else {
  throw new Error('No Env variable base');
}
console.log('instance');
console.log(instance);

export default instance as AxiosInstance;
