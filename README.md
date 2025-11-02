🚀 Dashboard de Proyectos: Componentes y Estilización Avanzada

Este proyecto fue desarrollado como parte del Laboratorio de Desarrollo de Aplicaciones Web Avanzado. Su objetivo principal es demostrar la creación de interfaces modernas, funcionales y altamente reutilizables mediante la combinación estratégica de tecnologías de estilización y componentes de React.

⚙️ Tecnologías Utilizadas

Framework: Next.js (App Router)

Lenguaje: TypeScript

Estilización Principal: Tailwind CSS

Estilización Avanzada/Efectos: CSS Modules

Librería de Componentes: shadcn/ui (basada en Radix UI)

Gestión de Estado: React Hooks (useState, useMemo)

Librería de Fechas: date-fns

✨ Implementación y Objetivos de la Tarea

El proyecto implementa un Dashboard de Gestión de Proyectos, cumpliendo con los siguientes requisitos funcionales y de estilización:

1. Estilización y Tema

Tema Personalizado: Se modificó el color primario de la aplicación utilizando la configuración de Tailwind CSS para adoptar un tono Verde Esmeralda (Hue: 150 62.8% 30.6%), demostrando la facilidad de aplicar temas corporativos.

Uso Híbrido: Se mantiene la filosofía de usar CSS Modules para animaciones complejas (e.g., efectos de loading y pseudo-elementos) y Tailwind CSS para layout, espaciado y colores (Ejercicio 1).

2. Componentes UI de shadcn/ui Implementados

Para construir la interfaz profesional, se integraron y utilizaron los siguientes componentes de shadcn/ui:

Componente

Uso Principal

Spinner

Simulación de peticiones al backend durante las operaciones CRUD.

Alert

Mensajes de validación en formularios (SettingsForm) y confirmaciones destructivas (Eliminar Proyecto/Miembro).

Calendar/Popover

Selección de fechas (birthdate y dateline) en los formularios de Edición/Creación.

Pagination

Implementado en la sección de Tareas para manejar grandes conjuntos de datos.

Select, Dialog, Card, Button

Componentes base para el layout y la interacción del CRUD.

3. Funcionalidades de Gestión de Negocio (CRUD en Memoria)

El Dashboard permite la gestión completa de las tres entidades principales:

Menú

Funcionalidad Implementada

Campos Relevantes

Resumen

Métricas Dinámicas: Las tarjetas se actualizan automáticamente en función de los datos cargados en memoria (projects.length, tareas completadas, etc.).

-

Proyectos

CRUD Básico: Permite la Creación de nuevos proyectos y la Eliminación con confirmación.

name, description, category, priority, teamMembers.

Equipo

CRUD Completo: Permite Crear, Editar y Eliminar miembros del equipo. Se manejan valores null (projectId) de forma segura.

userId, role, position, birthdate, projectId, isActive.

Tareas

CRUD Básico & Paginación: Permite la Creación y Eliminación de tareas, con filtro por proyecto y asignación de usuario.

description, projectId, status, dateline, userId.

Configuración

Formulario Simulado: Demuestra la implementación de un formulario con Switch, Select y validación de guardado mediante el componente Alert.

theme, emailNotifications, apiUrl.

🚀 Inicio Rápido

Para levantar la aplicación en tu entorno local:

Clonar el repositorio:

git clone [URL_DEL_REPOSITORIO] next-shadcn-ui
cd next-shadcn-ui


Instalar dependencias:

npm install


Ejecutar la aplicación en modo desarrollo:

npm run dev


La aplicación estará disponible en http://localhost:3000/dashboard.
