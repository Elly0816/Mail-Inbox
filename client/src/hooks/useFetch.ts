import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import instance from '../controllers/axios.controllers';
import useLocalStorage from './useLocalStorage';
import { AxiosError, AxiosResponse } from 'axios';
import { user, message } from '../utils/types/types.utils';
import { useNavigate } from 'react-router-dom';

export interface Usefetch {
  loading: boolean;
  error: Error | undefined;
  setCurrent: React.Dispatch<React.SetStateAction<UseFetchProps>>;
  data: object | undefined;
}

export interface UseFetchProps {
  path: string | undefined;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | undefined;
  formdata?: user | message | undefined;
}

const BASE = 'http://localhost:5000';

const useFetch = ({ path, method, formdata }: UseFetchProps): Usefetch => {
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState<UseFetchProps>({
    path,
    method,
    formdata,
  });

  const location = useLocation();
  //   console.log(current);
  // const [access] = useLocalStorage({
  //   name: 'access',
  // });
  // const [refresh] = useLocalStorage({
  //   name: 'refresh',
  // });
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState();

  if (method && method != 'get' && !formdata) {
    setError(new Error('There was no data given'));
  }

  const navigate = useNavigate();

  useEffect(() => {
    console.log('current');
    console.log(current);
    const controller = new AbortController();
    const config = {
      method: current.method,
      url: current.path,
      signal: controller.signal,
      data: current.formdata,
    };
    // console.log(config);
    // const headers = new Headers ({
    //   'Content-Type': 'application/json;charset=utf-8',
    //   'Authorization':JSON.stringify({access:access?access:"", refresh:refresh?refresh:""},
    //   )
    // });
    // const config = {
    //   method: current.method?.toUpperCase(),
    //   body: current.formdata,
    //   signal:controller.signal,
    //   url: BASE+path,
    //   headers: headers
    // }
    switch (current.method) {
      case 'get':
        // fetch(config.url, ).then()

        // try {
        instance(config)
          .then(async (res: AxiosResponse) => {
            console.log(res);
            if (res.status.toString()[0] !== '2') {
              setError(new Error(res.statusText));
              setLoading(false);
              setData(res.data);
            } else {
              const resData = await res.data();
              setData(resData);
              setLoading(false);
              setError(undefined);
            }
          })
          .catch((err: AxiosError) => {
            console.log('error');
            console.log(err);
            const text = err.response?.statusText;
            setError(new Error(err.message + '\n' + text));
            setData(undefined);
            setLoading(false);
          });
        break;
      case 'post':
      case 'put':
      case 'patch':
        instance(config)
          .then(async (res: AxiosResponse) => {
            console.log(res.headers);
            const resData = await res.data;
            // const access = res.config
            console.log(res);
            if (res.status.toString()[0] !== '2') {
              setError(new Error(res.statusText));
              setLoading(false);
              setData(resData);
            } else {
              setData(resData);
              setLoading(false);
              setError(undefined);
            }
          })
          .catch((err: AxiosError) => {
            console.log('error');
            console.log(err);
            const text = err.response?.statusText;
            setError(new Error(err.message + '\n' + text));
            setData(undefined);
            setLoading(false);
          });

        break;
      case 'delete':
      default:
        setLoading(false);
        setError(undefined);
        setData(undefined);
        break;
    }
    return () => controller.abort();
  }, [current]);

  console.log({
    loading: loading,
    error: error,
    data: data,
    setCurrent: setCurrent,
  });

  useEffect(() => {
    error?.message.toLowerCase().includes('unauthorized') &&
      !location.pathname.includes('/login') &&
      navigate('/login');
  });

  return { loading, error, data, setCurrent };
};

export default useFetch;
