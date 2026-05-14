import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadDataset from './pages/UploadDataset';
import Forecast from './pages/Forecast';
import Reports from './pages/Reports';

function App() {

  return (

     <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/upload"
          element={<UploadDataset />}
        />

        <Route
          path="/forecast"
          element={<Forecast />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;