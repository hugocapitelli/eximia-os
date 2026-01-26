import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from './types';

// Views
import StudentDashboard from './views/StudentDashboard';
import StudentAchievements from './views/StudentAchievements';
import StudentHistory from './views/StudentHistory';
import CourseList from './views/CourseList';
import CourseDetails from './views/CourseDetails';
import CourseEdit from './views/CourseEdit';
import ChapterDetail from './views/ChapterDetail';
import ChapterReader from './views/ChapterReader';
import InstructorList from './views/InstructorList';
import InstructorDetail from './views/InstructorDetail';
import ContentCreation from './views/ContentCreation';
import ContentRevision from './views/ContentRevision';
import AdminConsole from './views/AdminConsole';
import AdminClassManagement from './views/AdminClassManagement';
import UserManagement from './views/UserManagement';
import SystemSettings from './views/SystemSettings';
import UserProfile from './views/UserProfile';
import AccountSettings from './views/AccountSettings';
import DisciplineEdit from './views/DisciplineEdit';

interface AppRoutesProps {
  userRole: UserRole;
  gamificationEnabled: boolean;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ userRole, gamificationEnabled }) => {
  // Pagina inicial baseada no role
  const getHomePage = () => {
    switch (userRole) {
      case 'ADMIN': return '/admin';
      case 'INSTRUCTOR': return '/instructor';
      default: return '/dashboard';
    }
  };

  return (
    <Routes>
      {/* Redireciona raiz para pagina inicial correta */}
      <Route path="/" element={<Navigate to={getHomePage()} replace />} />

      {/* ========== STUDENT ROUTES ========== */}
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/achievements" element={
        gamificationEnabled ? <StudentAchievements /> : <Navigate to="/dashboard" replace />
      } />
      <Route path="/history" element={<StudentHistory />} />
      <Route path="/courses" element={<CourseList userRole={userRole} />} />

      {/* ========== COURSE ROUTES ========== */}
      <Route path="/course/:courseId" element={<CourseDetails userRole={userRole} />} />
      <Route path="/course/:courseId/edit" element={<CourseEdit />} />
      <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterDetail />} />
      <Route
        path="/course/:courseId/chapter/:chapterId/content/:contentId"
        element={<ChapterReader userRole={userRole} />}
      />
      <Route
        path="/course/:courseId/chapter/:chapterId/new-content"
        element={<ContentCreation />}
      />
      <Route
        path="/course/:courseId/chapter/:chapterId/content/:contentId/revision"
        element={<ContentRevision />}
      />

      {/* ========== INSTRUCTOR ROUTES ========== */}
      <Route path="/instructor" element={<InstructorList />} />
      <Route path="/instructor/class/:classId" element={<InstructorDetail />} />
      <Route path="/instructor/discipline/:disciplineId/edit" element={<DisciplineEdit />} />

      {/* ========== ADMIN ROUTES ========== */}
      <Route path="/admin" element={<AdminConsole />} />
      <Route path="/admin/classes" element={<AdminClassManagement />} />
      <Route path="/admin/class/:classId" element={<InstructorDetail />} />
      <Route path="/admin/discipline/:disciplineId/edit" element={<DisciplineEdit />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/settings" element={<SystemSettings />} />

      {/* ========== USER ROUTES ========== */}
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/account" element={<AccountSettings />} />

      {/* ========== 404 ========== */}
      <Route path="*" element={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-gray-500">Pagina nao encontrada</p>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
