import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

// Create the browser router with all routes
export const router = createBrowserRouter(routes);

// Router provider component
export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
