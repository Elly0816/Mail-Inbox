import { useEffect, useState } from 'react';
import instance from '../controllers/axios.controllers';
import useLocalStorage from './useLocalStorage';
import { AxiosError, AxiosResponse } from 'axios';
import { user, message } from '../utils/types/types.utils';

export interface Usefetch {
  loading: boolean;
  error: Error | undefined;
  setCurrent: React.Dispatch<React.SetStateAction<UseFetchProps>>;
  data: object | undefined;
}

export interface UseFetchProps {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  formdata?: user | message | undefined;
}

const useFetch = ({ path, method, formdata }: UseFetchProps): Usefetch => {
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState<UseFetchProps>({
    path,
    method,
    formdata,
  });
  //   console.log(current);
  const [access] = useLocalStorage({
    name: 'access',
  });
  const [refresh] = useLocalStorage({
    name: 'refresh',
  });
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState();

  if (method != 'get' && !formdata) {
    setError(new Error('There was no data given'));
  }

  useEffect(() => {
    const controller = new AbortController();
    const config = {
      method: method,
      url: path,
      Headers: [{ access: access }, { refresh: refresh }],
      signal: controller.signal,
    };
    switch (current.method) {
      case 'get':
        // try {
        instance(config)
          .then(async (res: AxiosResponse) => {
            console.log(res);
            if (res.status.toString()[0] !== '2') {
              setError(new Error(res.status.toString()));
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
            console.log(err.message);
            setError(new Error(err.message));
            setData(undefined);
            setLoading(false);
          });
        break;

      // catch (e) {
      //   console.log('error');
      //   console.log(e);
      //   setError(e as Error);
      //   setData(undefined);
      //   setLoading(false);
      // }
      // break;
      case 'post':
      case 'put':
      case 'patch':
      case 'delete':
      default:
        break;
    }
    return () => controller.abort();
  }, [access, current, method, path, refresh]);

  console.log({
    loading: loading,
    error: error,
    data: data,
    setCurrent: setCurrent,
  });
  return { loading, error, data, setCurrent };
};

export default useFetch;
