import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './test-connection'
import { router } from './router'

export default function App() {
  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18181B',
            color: '#fff',
            border: '1px solid #27272A',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* App Router */}
      <RouterProvider router={router} />
    </>
  )
}
