import { useState, useEffect } from 'react';

export interface localStorageType {
  //   item: string | undefined;
  //   setItem: React.Dispatch<React.SetStateAction<string>>;
  items: Array<
    | string
    | undefined
    | React.Dispatch<React.SetStateAction<useLocalStorageProps>>
  >;
}

export interface useLocalStorageProps {
  name: string;
  value?: string;
}

const useLocalStorage = ({
  name,
  value,
}: useLocalStorageProps): localStorageType['items'] => {
  const [item, setItem] = useState<string>();

  const [currName, setCurrName] = useState<useLocalStorageProps>({
    name,
    value,
  });
  useEffect(() => {
    if (!value) {
      const newItem = localStorage.getItem(name);
      if (newItem) {
        setItem(newItem);
      } else {
        setItem(undefined);
      }
    } else {
      localStorage.setItem(name, value);
      const newItem = localStorage.getItem(name);
      setItem(newItem as string);
    }
  }, [currName, name, value]);

  return [item, setCurrName];
};

export default useLocalStorage;
