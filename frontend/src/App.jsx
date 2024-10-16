import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import SpotTiles from './components/SpotTiles/SpotTiles';
import SpotDetailsPage from './components/SpotDetailsPage/SpotDetailsPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotTiles />
      },
      {
        path: '/spots/:spotid',
        element: <SpotDetailsPage />
      },
      {
        path: '/reviews',
        element: <h1>Reviews!</h1>
      },
      {
        path: '*',
        element: <h1>Page Does Not Exist</h1>
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;