import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import PageWrapper from './components/PageWrapper';
import Perfis from './pages/Perfis';
import Dashboard from './pages/Dashboard';
import Estudos from './pages/Estudos';
import Treino from './pages/Treino';
import Sono from './pages/Sono';
import Alimentacao from './pages/Alimentacao';
import Cronograma from './pages/Cronograma';
import Metas from './pages/Metas';
import Habitos from './pages/Habitos';
import Configuracoes from './pages/Configuracoes';
import CalendarioPage from './pages/CalendarioPage';
import './App.css';
import './styles/responsive.css';

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/perfis' && location.hash !== '#/perfis';

  return (
    <div className="app">
      {showHeader && <Header />}
      <Toast />
      <main className="main-content" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/perfis" element={<Perfis />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Dashboard />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estudos"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Estudos />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/treino"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Treino />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sono"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Sono />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alimentacao"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Alimentacao />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cronograma"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Cronograma />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metas"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Metas />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habitos"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Habitos />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendario"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <CalendarioPage />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Configuracoes />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
          <Route path="*" element={<Navigate to="/perfis" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}

export default App;

