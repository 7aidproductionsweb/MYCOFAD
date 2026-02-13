import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import PinScreen from './components/PinScreen';
import LanguageToggle from './components/LanguageToggle';
import Home from './components/Home';
import DocumentView from './components/DocumentView';
import DocumentEdit from './components/DocumentEdit';
import './styles.css';

function AppContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="app">
        <LanguageToggle />
        <PinScreen />
      </div>
    );
  }

  return (
    <div className="app">
      <LanguageToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/document/view/:id" element={<DocumentView />} />
          <Route path="/document/edit/:id" element={<DocumentEdit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
