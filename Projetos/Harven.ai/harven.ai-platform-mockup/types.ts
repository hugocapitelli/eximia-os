
export type ViewType = 
  | 'STUDENT_DASHBOARD' 
  | 'STUDENT_ACHIEVEMENTS'
  | 'STUDENT_HISTORY'
  | 'COURSE_LIST'
  | 'COURSE_DETAILS' 
  | 'COURSE_EDIT'
  | 'CHAPTER_DETAIL'
  | 'CHAPTER_READER' 
  | 'INSTRUCTOR_LIST' 
  | 'INSTRUCTOR_DETAIL' 
  | 'DISCIPLINE_EDIT'
  | 'CONTENT_CREATION'
  | 'CONTENT_REVISION'
  | 'ADMIN_CONSOLE'
  | 'ADMIN_CLASSES'
  | 'USER_MANAGEMENT'
  | 'SYSTEM_SETTINGS'
  | 'USER_PROFILE'
  | 'ACCOUNT_SETTINGS';

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  students: number;
  category: string;
  thumbnail: string;
  status: 'Ativo' | 'Rascunho' | 'Arquivado';
}

export type InitiativeStatus = 'NOT_PLANNED' | 'PLANNED' | 'ON_TRACK' | 'ATTENTION' | 'CRITICAL' | 'DONE';
export type InitiativeLevel = 'STRATEGIC' | 'TACTICAL' | 'OPERATIONAL';

export interface HoshinPerspective {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface HoshinInitiative {
  id: string;
  code: string;
  title: string;
  owner: string;
  status: InitiativeStatus;
  level: InitiativeLevel;
  perspectiveId: string;
  startDate: string;
  deadline: string;
  description?: string;
  iceScore: number;
  parentId?: string | null;
}
