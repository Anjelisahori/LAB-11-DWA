// components/ProjectForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Project, Member } from "@/lib/data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ProjectFormProps {
    onSubmit: (project: Project) => void;
    members: Member[];
}

export function ProjectForm({ onSubmit, members }: ProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
    teamMembers: [] as string[], // Array de userId
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.name || !formData.category || !formData.priority) {
        setError("Por favor, completa los campos obligatorios (*).");
        return;
    }

    const newProject: Project = {
        id: `p-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category as Project['category'],
        priority: formData.priority as Project['priority'],
        status: 'Planificado', // Estado inicial por defecto
        progress: 0,
        teamMembers: formData.teamMembers,
        createdAt: new Date().toISOString().split('T')[0],
    };
    
    onSubmit(newProject);
    
    // Limpiar y cerrar
    setFormData({ name: "", description: "", category: "", priority: "", teamMembers: [] });
    setOpen(false);
    setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en crear cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Campo Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Campo Descripción (Usando Textarea) */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Campo Categoría */}
            <div className="grid gap-2">
              <Label htmlFor="category">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Campo Prioridad */}
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="priority">
                        Prioridad <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Selecciona la prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            
                {/* Campo Miembros del Equipo */}
                <div className="grid gap-2">
                    <Label htmlFor="teamMembers">Miembros</Label>
                    <Select
                        onValueChange={(value) => {
                            const newMembers = formData.teamMembers.includes(value)
                                ? formData.teamMembers.filter(id => id !== value) // Quitar si ya está
                                : [...formData.teamMembers, value]; // Añadir si no está
                            setFormData({ ...formData, teamMembers: newMembers });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Selecciona (${formData.teamMembers.length})`} />
                        </SelectTrigger>
                        <SelectContent>
                            {members.map(member => (
                                <SelectItem key={member.userId} value={member.userId}>
                                    {member.name} ({member.position})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* Alerta de Validación */}
            {error && (
                <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error de Validación</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setOpen(false); setError(null); }}>
              Cancelar
            </Button>
            <Button type="submit">Crear Proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}