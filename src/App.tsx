import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LeasingApplicationsPage } from './pages/LeasingApplicationsPage';
import { CreateLeasingApplicationPage } from './pages/CreateLeasingApplicationPage';
import { LeasingApplicationDetailPage } from './pages/LeasingApplicationDetailPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/leasing/applications" element={<LeasingApplicationsPage />} />
      <Route path="/leasing/applications/new" element={<CreateLeasingApplicationPage />} />
      <Route
        path="/leasing/applications/:applicationId"
        element={<LeasingApplicationDetailPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
