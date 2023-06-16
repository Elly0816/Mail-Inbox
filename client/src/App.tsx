import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/homepage/homepage';
import LoginPage from './pages/loginpage/loginPage';

const router = createBrowserRouter([
  {
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // {
      //   path: "about",
      //   element: <About />,
      // },
    ],
  },
]);

function App() {
  return (
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
      fallbackElement={<div>Loading...</div>}
    />
  );
}

export default App;
