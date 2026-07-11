import AppRoutes from './routes/AppRoutes'
import ToastProvider from './components/Toast/ToastProvider'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
