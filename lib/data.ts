// src/lib/data.ts

export type Member = {
  userId: string;
  name: string;
  email: string;
  role: 'Frontend Developer' | 'Backend Developer' | 'UI/UX Designer' | 'DevOps Engineer' | 'Project Manager';
  position: string;
  birthdate: string; // YYYY-MM-DD
  phone: string;
  projectId: string | null;
  isActive: boolean;
};

export type Task = {
  id: string;
  description: string;
  projectId: string;
  status: 'Completado' | 'En progreso' | 'Pendiente' | 'Bloqueado';
  priority: 'Urgente' | 'Alta' | 'Media' | 'Baja';
  userId: string | null; // Asignado a
  dateline: string; // YYYY-MM-DD
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: 'Completado' | 'En progreso' | 'Planificado' | 'En revisión';
  progress: number;
  teamMembers: string[]; // Array de userId
  category: 'web' | 'mobile' | 'design' | 'marketing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
};

// Datos Iniciales
export const initialProjects: Project[] = [
  { id: 'p-001', name: 'E-commerce Platform', description: 'Plataforma de comercio electrónico con Next.js', status: 'En progreso', progress: 65, teamMembers: ['u-001', 'u-002', 'u-003'], category: 'web', priority: 'high', createdAt: '2025-10-01' },
  { id: 'p-002', name: 'Mobile App', description: 'Aplicación móvil con React Native', status: 'En revisión', progress: 90, teamMembers: ['u-004', 'u-005'], category: 'mobile', priority: 'medium', createdAt: '2025-09-15' },
  { id: 'p-003', name: 'Design System', description: 'Librería de componentes reutilizables', status: 'Completado', progress: 100, teamMembers: ['u-001'], category: 'design', priority: 'low', createdAt: '2025-08-10' },
];

export const initialMembers: Member[] = [
  { userId: 'u-001', name: 'María García', email: 'maria@example.com', role: 'Frontend Developer', position: 'Líder de Frontend', birthdate: '1995-05-20', phone: '555-1234', projectId: 'p-001', isActive: true },
  { userId: 'u-002', name: 'Juan Pérez', email: 'juan@example.com', role: 'Backend Developer', position: 'Ingeniero de API', birthdate: '1990-11-10', phone: '555-5678', projectId: 'p-001', isActive: true },
  { userId: 'u-003', name: 'Ana López', email: 'ana@example.com', role: 'UI/UX Designer', position: 'Diseñadora Principal', birthdate: '1998-01-25', phone: '555-9012', projectId: 'p-001', isActive: false },
  { userId: 'u-004', name: 'Carlos Ruiz', email: 'carlos@example.com', role: 'DevOps Engineer', position: 'Arquitecto Cloud', birthdate: '1985-07-03', phone: '555-3456', projectId: 'p-002', isActive: true },
  { userId: 'u-005', name: 'Laura Martínez', email: 'laura@example.com', role: 'Project Manager', position: 'Gerente de Proyectos', birthdate: '1992-03-15', phone: '555-7890', projectId: 'p-002', isActive: true },
];

export const initialTasks: Task[] = [
  { id: 't-001', description: "Implementar autenticación", projectId: 'p-001', status: 'En progreso', priority: 'Alta', userId: 'u-002', dateline: '2025-11-15' },
  { id: 't-002', description: "Diseñar pantalla de perfil", projectId: 'p-002', status: 'Pendiente', priority: 'Media', userId: 'u-003', dateline: '2025-11-20' },
  { id: 't-003', description: "Configurar CI/CD", projectId: 'p-001', status: 'Completado', priority: 'Baja', userId: 'u-004', dateline: '2025-11-10' },
];