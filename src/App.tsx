import { AuthProvider, useAuth } from './lib/AuthContext';
import { DataProvider } from './lib/DataContext';
import { Login } from './components/Login';
import { UserDashboard } from './components/UserDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  switch (user.role) {
    case 'user':
      return <UserDashboard />;
    case 'owner':
      return <OwnerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Login />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
}
