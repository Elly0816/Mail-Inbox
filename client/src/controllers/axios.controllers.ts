import axios, { AxiosInstance } from 'axios';

// config({ path: '../../' });

const BASE = 'http://localhost:5000';

let instance: AxiosInstance | undefined;

if (BASE) {
  instance = axios.create({
    baseURL: BASE,
    timeout: 1000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: JSON.stringify({
        access: `Bearer ${localStorage.getItem('access')}`,
        refresh: `Bearer ${localStorage.getItem('refresh')}`,
      }),
    },
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

instance.interceptors.request.use((config) => {
  console.log('request config');
  console.log(config);
  config.headers['Access-Control-Allow-Origin'] = '*';
  config.headers['withCredentials'] = 'true';
  config.headers['Authorization'] = JSON.stringify({
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
  });

  return config;
});

instance.interceptors.response.use((config) => {
  console.log('Auth');
  console.log(config.headers);
  let auth = config.headers['authorization'];
  auth = JSON.parse(auth) as { access: string; refresh: string };
  const access = auth.access;
  const refresh = auth.refresh;
  console.log('access and refresh');
  console.log(access, refresh);
  console.log('response config');
  console.log(config);
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
  return config;
});

export default instance as AxiosInstance;
