import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { LoginForm } from '../components/organisms/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { signIn, loading, session } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, navigate])

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)

    if (!error) {
      // Navigation will happen via useEffect when session updates
      return { error: null }
    }

    return { error }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <h2>exímIA</h2>
          <p>Plataforma de Aprendizado</p>
        </div>

        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  )
}
