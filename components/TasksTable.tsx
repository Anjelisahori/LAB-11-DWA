// components/TasksTable.tsx
"use client"

import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Project, Member, Task } from '@/lib/data';
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Trash2, Edit, Calendar as CalendarIcon, AlertCircle, Ban } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TasksTableProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  members: Member[];
}

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado": return "default"
    case "En progreso": return "secondary"
    case "Pendiente": return "outline"
    case "Bloqueado": return "destructive"
    default: return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente": return "destructive"
    case "Alta": return "default"
    case "Media": return "secondary"
    case "Baja": return "outline"
    default: return "outline"
  }
}

const itemsPerPage = 5;

export function TasksTable({ tasks, setTasks, projects, members }: TasksTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState<Task | Omit<Task, 'id'>>({ id: '', description: '', projectId: '', status: 'Pendiente', priority: 'Media', userId: null, dateline: '' });
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Lógica de Paginación
    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    const handleOpenDialog = (task: Task | null) => {
        setEditingTask(task);
        setFormData(task ? task : { id: '', description: '', projectId: '', status: 'Pendiente', priority: 'Media', userId: null, dateline: '' });
        setError(null);
        setIsDialogOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.description || !formData.projectId || !formData.dateline) {
             setError("Por favor, completa la descripción, el proyecto y la fecha límite.");
             return;
        }
        
        if (editingTask) {
            // Update
            setTasks(tasks.map(t => t.id === editingTask.id ? formData as Task : t));
        } else {
            // Create
            const newTask: Task = {
                ...(formData as Omit<Task, 'id'>),
                id: `t-${Date.now()}`,
            };
            setTasks([newTask, ...tasks]);
        }
        setIsDialogOpen(false);
        setEditingTask(null);
    };
    
    const handleDelete = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        setIsDeleteDialogOpen(false);
    }

    const getAssigneeName = (userId: string | null) => {
        const member = members.find(m => m.userId === userId);
        return member ? member.name : 'No Asignado';
    }

    return (
        <div className="space-y-4">
            <div className='flex justify-end'>
                <Button onClick={() => handleOpenDialog(null)} className='gap-2'>
                    <Plus className="w-4 h-4"/>
                    Crear Tarea
                </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><Checkbox /></TableHead>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell className="font-medium">{task.description}</TableCell>
                      <TableCell>{projects.find(p => p.id === task.projectId)?.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                      </TableCell>
                      <TableCell>{getAssigneeName(task.userId)}</TableCell>
                      <TableCell>{task.dateline}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(task)}>
                          <Edit className='w-4 h-4'/>
                        </Button>
                        <Dialog open={isDeleteDialogOpen && editingTask?.id === task.id} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" className='w-8 h-8 p-0' onClick={() => setEditingTask(task)}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <Alert variant="destructive" className="mt-4">
                                    <Ban className="h-4 w-4" />
                                    <AlertTitle>Confirmar Eliminación</AlertTitle>
                                    <AlertDescription>
                                        Estás a punto de eliminar la tarea **{task.description}**. ¿Deseas continuar?
                                    </AlertDescription>
                                </Alert>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                                    <Button variant="destructive" onClick={() => handleDelete(task.id)}>Eliminar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Componente de Paginación */}
            <div className="flex justify-center mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
                        </PaginationItem>
                        
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink 
                                    onClick={() => setCurrentPage(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Formulario de Creación/Edición (Dialog) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>{editingTask ? `Editar Tarea: ${editingTask.description}` : "Crear Nueva Tarea"}</DialogTitle>
                            <DialogDescription>
                                Completa los campos para crear o actualizar la tarea.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            {/* Descripción */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción *</Label>
                                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            
                            {/* Proyecto y Asignado */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div className="grid gap-2">
                                    <Label htmlFor="projectId">Proyecto *</Label>
                                    <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona Proyecto" /></SelectTrigger>
                                        <SelectContent>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="userId">Asignado a</Label>
                                    <Select value={formData.userId || ''} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona Miembro" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=''>No Asignado</SelectItem>
                                            {members.map(m => (
                                                <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            {/* Estatus y Prioridad */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Task['status'] })}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona Estado" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="En progreso">En progreso</SelectItem>
                                            <SelectItem value="Completado">Completado</SelectItem>
                                            <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">Prioridad</Label>
                                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}>
                                        <SelectTrigger><SelectValue placeholder="Selecciona Prioridad" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Baja">Baja</SelectItem>
                                            <SelectItem value="Media">Media</SelectItem>
                                            <SelectItem value="Alta">Alta</SelectItem>
                                            <SelectItem value="Urgente">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            {/* Fecha Límite */}
                            <div className="grid gap-2">
                                <Label htmlFor="dateline">Fecha Límite *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.dateline ? format(new Date(formData.dateline), "PPP") : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.dateline ? new Date(formData.dateline) : undefined}
                                            onSelect={(date) => setFormData({ ...formData, dateline: date ? format(date, 'yyyy-MM-dd') : '' })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            
                            {/* Alerta de Error */}
                            {error && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error de Validación</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit">{editingTask ? "Guardar Cambios" : "Crear Tarea"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}