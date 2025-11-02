// components/SettingsForm.tsx
"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Settings } from 'lucide-react';

interface SettingsData {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    defaultLanguage: 'es' | 'en' | 'pt';
    apiUrl: string;
}

export default function SettingsForm() {
    const [settings, setSettings] = useState<SettingsData>({
        theme: 'light',
        emailNotifications: true,
        defaultLanguage: 'es',
        apiUrl: 'https://api.dashboard.com/v1',
    });
    const [status, setStatus] = useState<'success' | 'error' | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simulación de validación
        if (!settings.apiUrl.startsWith('https://')) {
            setStatus('error');
            setTimeout(() => setStatus(null), 3000);
            return;
        }

        // Simulación de guardado
        console.log("Configuración guardada:", settings);
        setStatus('success');
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <h3 className='flex items-center gap-2 text-xl font-semibold text-primary'>
                <Settings className='w-5 h-5'/>
                Ajustes Generales
            </h3>

            {/* Campo 1: Tema */}
            <div className="grid gap-2">
                <Label htmlFor="theme">Tema de la Interfaz</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value as SettingsData['theme'] })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tema" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Campo 2: Lenguaje */}
            <div className="grid gap-2">
                <Label htmlFor="language">Lenguaje Predeterminado</Label>
                <Select value={settings.defaultLanguage} onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value as SettingsData['defaultLanguage'] })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el lenguaje" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Campo 3: Notificaciones Email */}
            <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="grid gap-1">
                    <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                    <p className='text-sm text-muted-foreground'>Recibe alertas y resúmenes de proyectos por correo electrónico.</p>
                </div>
                <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
            </div>
            
            {/* Campo 4: URL de la API */}
            <div className="grid gap-2">
                <Label htmlFor="api-url">URL de la API</Label>
                <Input 
                    id="api-url" 
                    type="url"
                    value={settings.apiUrl} 
                    onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })} 
                    placeholder='https://'
                />
            </div>

            {/* Alerta de Estado */}
            {status === 'success' && (
                <Alert className='bg-green-100 border-green-300 text-green-700'>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>¡Éxito!</AlertTitle>
                    <AlertDescription>Configuración guardada correctamente.</AlertDescription>
                </Alert>
            )}
            {status === 'error' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Error al guardar: Verifica la URL de la API (debe comenzar con 'https://').</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className='w-full'>
                Guardar Configuración
            </Button>
        </form>
    );
}