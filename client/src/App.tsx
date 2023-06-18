import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/homepage/homepage';
import LoginPage from './pages/loginpage/loginPage';
import { useState } from 'react';
import { createContext } from 'react';
import { userFromDb } from './models/user.models';

const router = createBrowserRouter([
  {
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/login',
        element: <LoginPage />,
      },
      // {
      //   path: "about",
      //   element: <About />,
      // },
    ],
  },
]);

export interface authContextType {
  user?: userFromDb | undefined;
  auth?: boolean;
  setUser?: React.Dispatch<React.SetStateAction<userFromDb | undefined>>;
  setAuth?: React.Dispatch<React.SetStateAction<boolean>>;
}

function App() {
  const [user, setUser] = useState<userFromDb | undefined>();

  const [auth, setAuth] = useState<boolean>(false);

  return (
    <authContext.Provider value={{ auth, user, setUser, setAuth }}>
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
        fallbackElement={<div>Loading...</div>}
      />
    </authContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<authContextType>({});
// export {authContext};

export default App;
