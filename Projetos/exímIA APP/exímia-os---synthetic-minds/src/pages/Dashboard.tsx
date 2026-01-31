import { useAuth } from '../hooks/useAuth'

export function Dashboard() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleSignOut} className="button button-outline">
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h2>Bem-vindo ao exímIA!</h2>
        <p>Você está autenticado com sucesso.</p>
      </main>
    </div>
  )
}
