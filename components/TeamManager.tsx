"use client"

import React, { useState } from 'react';
import { Member, Project, Task } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, User, Ban, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TeamManagerProps {
    members: Member[];
    setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
    projects: Project[];
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const initialMemberState: Member = {
    userId: '',
    name: '',
    email: '',
    role: 'Frontend Developer',
    position: '',
    birthdate: '',
    phone: '',
    projectId: null,
    isActive: true
};

export default function TeamManager({ members, setMembers, projects, tasks, setTasks }: TeamManagerProps) {
    if (!members || !projects || !tasks) {
        return null;
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [formData, setFormData] = useState<Member>(initialMemberState);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const isDateValid = (dateString: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const handleOpenDialog = (member: Member | null) => {
        setEditingMember(member);
        setFormData(member ? { ...member } : initialMemberState);
        setError(null);
        setIsDialogOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.position || !isDateValid(formData.birthdate)) {
            setError("Todos los campos obligatorios (incluyendo una Fecha de Nacimiento válida) deben ser completados.");
            return;
        }

        if (editingMember) {
            setMembers(members.map(m => m.userId === editingMember.userId ? formData : m));
        } else {
            const newMember: Member = {
                ...formData,
                userId: `u-${Date.now()}`,
            };
            setMembers([...members, newMember]);
        }

        setIsDialogOpen(false);
        setEditingMember(null);
    };

    const handleDelete = (memberId: string) => {
        setMembers(members.filter(m => m.userId !== memberId));
        setTasks(tasks.map(t => t.userId === memberId ? { ...t, userId: null } : t));
        setIsDeleteDialogOpen(false);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Miembros del Equipo ({members.length})</CardTitle>
                    <CardDescription>
                        Gestiona los miembros de tu equipo, sus roles y datos personales.
                    </CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog(null)} className='gap-2'>
                    <User className="w-4 h-4" />
                    Agregar Miembro
                </Button>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback className='bg-primary text-primary-foreground'>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.role} ({member.position})</p>
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={member.isActive ? "default" : "secondary"}>
                                    {member.isActive ? "Activo" : "Ausente"}
                                </Badge>
                                <Button size="sm" variant="outline" onClick={() => handleOpenDialog(member)}>
                                    Editar
                                </Button>

                                <Dialog open={isDeleteDialogOpen && editingMember?.userId === member.userId} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="destructive" className='w-8 h-8 p-0' onClick={() => setEditingMember(member)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <Alert variant="destructive" className="mt-4">
                                            <Ban className="h-4 w-4" />
                                            <AlertTitle>Confirmar Eliminación</AlertTitle>
                                            <AlertDescription>
                                                Estás a punto de eliminar a <strong>{member.name}</strong>. Esta acción es irreversible. ¿Deseas continuar?
                                            </AlertDescription>
                                        </Alert>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                                            <Button type="button" variant="destructive" onClick={() => handleDelete(member.userId)}>Eliminar</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>{editingMember ? `Editar Miembro: ${editingMember.name}` : "Agregar Nuevo Miembro"}</DialogTitle>
                            <DialogDescription>
                                Completa la información del miembro del equipo.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Rol</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as Member['role'] })}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona Rol" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                                        <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                                        <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                        <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="position">Posición *</Label>
                                <Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="birthdate">Fecha Nacimiento *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {isDateValid(formData.birthdate)
                                                ? format(new Date(formData.birthdate), "PPP")
                                                : <span>Seleccionar fecha</span>
                                            }
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={isDateValid(formData.birthdate) ? new Date(formData.birthdate) : undefined}
                                            onSelect={(date) => setFormData({ ...formData, birthdate: date ? format(date, 'yyyy-MM-dd') : '' })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            {/* ✅ CORREGIDO: valor "none" en lugar de vacío */}
                            <div className="grid gap-2">
                                <Label htmlFor="projectId">Proyecto Asignado</Label>
                                <Select
                                    value={formData.projectId ?? "none"}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            projectId: value === "none" ? null : value
                                        })
                                    }
                                >
                                    <SelectTrigger><SelectValue placeholder="Seleccionar Proyecto" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Asignado</SelectItem>
                                        {projects.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                    id="is-active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="is-active">Miembro Activo</Label>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error de Formulario</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter className='pt-6'>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit">{editingMember ? "Guardar Cambios" : "Agregar Miembro"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
