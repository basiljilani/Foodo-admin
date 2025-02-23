import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Restaurants from './pages/Restaurants'
import Menus from './pages/Menus'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import './index.css'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="menus" element={<Menus />} />
          <Route path="offers" element={<Offers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
