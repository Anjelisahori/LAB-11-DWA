// app/dashboard/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialProjects, initialMembers, initialTasks, Project, Member, Task } from "@/lib/data"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import TeamManager from "@/components/TeamManager"
import SettingsForm from "@/components/SettingsForm"
import Spinner from "@/components/ui/spinner" // ✅ CORREGIDO: Asegura la S mayúscula en el nombre del archivo

// Componentes de la página (para ProjectCard)
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Ban, Trash2, Users } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export default function DashboardPage() {
    // 1. Estado de la lógica de negocio en memoria
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [loading, setLoading] = useState(false); // Para simular carga

    // Lógica de manipulación de datos (CRUD simulado)
    const addProject = (newProject: Project) => {
        setLoading(true);
        setTimeout(() => {
            setProjects([...projects, newProject]);
            setLoading(false);
        }, 500);
    };

    const deleteProject = (id: string) => {
        setLoading(true);
        setTimeout(() => {
            setProjects(projects.filter(p => p.id !== id));
            // También se deberían eliminar las tareas y desasignar miembros
            setTasks(tasks.filter(t => t.projectId !== id));
            setMembers(members.map(m => m.projectId === id ? { ...m, projectId: null } : m));
            setLoading(false);
        }, 500);
    };
    
    // 2. Cálculos de Métricas Dinámicas (Menú Resumen)
    const totalTasksCompleted = tasks.filter(t => t.status === 'Completado').length;
    const totalProjects = projects.length;
    const activeMembers = members.filter(m => m.isActive).length;
    const totalHoursWorked = useMemo(() => totalTasksCompleted * 4, [totalTasksCompleted]); // Simulación

    // Datos para las tarjetas de resumen
    const statCards = [
        { title: "Total Proyectos", value: totalProjects, change: `+${projects.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} desde el mes pasado`, icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" },
        { title: "Tareas Completadas", value: totalTasksCompleted, change: `+${Math.round(totalTasksCompleted * 0.19)}% desde la semana pasada`, icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
        { title: "Horas Trabajadas", value: `${totalHoursWorked}h`, change: `+${Math.round(totalHoursWorked * 0.03)}h desde ayer`, icon: "M2 10h20" },
        { title: "Miembros Activos", value: activeMembers, change: `+${members.filter(m => m.isActive && m.projectId === null).length} nuevos`, icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="h-10 w-10" className="text-primary" />
                    <p className="text-lg text-slate-600">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">
                            Dashboard de Proyectos
                        </h1>
                        <p className="text-slate-600">
                            Gestiona tus proyectos, tareas y equipo con shadcn/ui y tu nuevo tema.
                        </p>
                    </div>
                    <ProjectForm onSubmit={addProject} members={members} />
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="projects">Proyectos</TabsTrigger>
                        <TabsTrigger value="team">Equipo</TabsTrigger>
                        <TabsTrigger value="tasks">Tareas</TabsTrigger> {/* Nuevo Tab */}
                        <TabsTrigger value="settings">Configuración</TabsTrigger>
                    </TabsList>

                    {/* Tab: Overview (Resumen) - ACTUALIZADO */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((card, i) => (
                                <Card key={i}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            {card.title}
                                        </CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <path d={card.icon} />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{card.value}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {card.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {/* ... (Actividad Reciente) ... */}
                    </TabsContent>

                    {/* Tab: Projects - ACTUALIZADO */}
                    <TabsContent value="projects" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} members={members} onDelete={deleteProject} />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Tab: Team - NUEVO COMPONENTE */}
                    <TabsContent value="team" className="space-y-4">
                        <TeamManager 
                            members={members} 
                            setMembers={setMembers} 
                            projects={projects}
                            tasks={tasks} // Para desasignar tareas si el miembro es eliminado
                            setTasks={setTasks}
                        />
                    </TabsContent>
                    
                    {/* Tab: Tasks - NUEVO COMPONENTE */}
                    <TabsContent value="tasks" className="space-y-4">
                        <TasksTable 
                            tasks={tasks}
                            setTasks={setTasks}
                            projects={projects}
                            members={members}
                        />
                    </TabsContent>

                    {/* Tab: Settings - NUEVO COMPONENTE */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración de la Aplicación</CardTitle>
                                <CardDescription>
                                    Administra las preferencias y ajustes generales.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SettingsForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// *** Componente de Tarjeta de Proyecto para el CRUD (separado para limpieza) ***
// Nota: Este componente no se está modificando ya que no era la fuente del error.

interface ProjectCardProps {
    project: Project;
    members: Member[];
    onDelete: (id: string) => void;
}

function ProjectCard({ project, members, onDelete }: ProjectCardProps) {
    // Es seguro usar .length aquí porque projects/members están inicializados en useState
    const teamCount = project.teamMembers.length;
    
    // Diálogo para detalles o eliminación
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const handleDelete = () => {
        onDelete(project.id);
        setIsDeleteDialogOpen(false);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                    </div>
                    <Badge
                        variant={
                            project.status === "Completado"
                                ? "default"
                                : project.status === "En revisión"
                                ? "secondary"
                                : "outline"
                        }
                    >
                        {project.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {teamCount} miembros
                        </div>
                        
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                    Ver detalles
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{project.name} Detalles</DialogTitle>
                                    <DialogDescription>
                                        Información completa del proyecto y acciones de gestión.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <p><strong>Descripción:</strong> {project.description}</p>
                                    <p><strong>Categoría:</strong> {project.category}</p>
                                    <p><strong>Prioridad:</strong> <Badge>{project.priority}</Badge></p>
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Miembros Asignados ({teamCount})</h4>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md">
                                            {members.filter(m => project.teamMembers.includes(m.userId)).map(m => (
                                                <div key={m.userId} className="flex items-center gap-2 text-sm">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs">{m.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    {m.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="flex justify-between items-center">
                                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm" className="gap-2">
                                                <Trash2 className="w-4 h-4" />
                                                Eliminar Proyecto
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <Alert variant="destructive" className="mt-4">
                                                <Ban className="h-4 w-4" />
                                                <AlertTitle>¡Atención!</AlertTitle>
                                                <AlertDescription>
                                                    Estás a punto de eliminar el proyecto **{project.name}**. Esta acción es irreversible y desasignará tareas y miembros. ¿Estás seguro?
                                                </AlertDescription>
                                            </Alert>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                                                <Button variant="destructive" onClick={handleDelete}>Confirmar Eliminación</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="default">Cerrar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Exportar el componente para su uso
export { ProjectCard }
