
## 🚀 Dashboard de Proyectos: Componentes y Estilización Avanzada

Este proyecto fue desarrollado como parte del **Laboratorio de Desarrollo de Aplicaciones Web Avanzado**, con el objetivo de demostrar la creación de **interfaces modernas, funcionales y altamente reutilizables** mediante la combinación estratégica de tecnologías de estilización y componentes basados en React.

---

### ⚙️ Tecnologías Utilizadas

* **Framework:** Next.js (App Router)
* **Lenguaje:** TypeScript
* **Estilización Principal:** Tailwind CSS
* **Estilización Avanzada / Efectos:** CSS Modules
* **Librería de Componentes:** shadcn/ui (basada en Radix UI)
* **Gestión de Estado:** React Hooks (`useState`, `useMemo`)
* **Librería de Fechas:** date-fns

---

### ✨ Implementación y Objetivos del Proyecto

El proyecto implementa un **Dashboard de Gestión de Proyectos**, cumpliendo con los requisitos funcionales y visuales establecidos para la práctica:

#### 1. Estilización y Tema

* **Tema Personalizado:** Se modificó el color primario global en Tailwind CSS para adoptar un tono **Verde Esmeralda** (`150 62.8% 30.6%`), demostrando la facilidad de aplicar una identidad visual corporativa.
* **Uso Híbrido:** Se mantiene una estrategia combinada:

  * **Tailwind CSS** para el layout, espaciado y colores.
  * **CSS Modules** para animaciones, efectos y pseudo-elementos complejos (como loaders y labels flotantes).

---

#### 2. Componentes UI de shadcn/ui Implementados

Para construir una interfaz profesional y coherente, se integraron los siguientes componentes:

| **Componente**                   | **Uso Principal**                                                      |
| -------------------------------- | ---------------------------------------------------------------------- |
| **Spinner**                      | Simulación de peticiones al backend durante operaciones CRUD.          |
| **Alert**                        | Validaciones en formularios y confirmaciones de acciones destructivas. |
| **Calendar / Popover**           | Selección de fechas en formularios de creación y edición.              |
| **Pagination**                   | Navegación entre grandes volúmenes de tareas.                          |
| **Select, Dialog, Card, Button** | Estructura base del CRUD y elementos interactivos.                     |

---

#### 3. Funcionalidades del Dashboard (CRUD en Memoria)

El sistema permite gestionar de forma completa las tres entidades principales: **Proyectos, Equipo y Tareas**, junto a una sección de configuración.

| **Sección**       | **Funcionalidad Principal**                                                                  | **Campos Relevantes**                                              |
| ----------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Resumen**       | Cálculo de métricas dinámicas (proyectos, tareas completadas, miembros activos).             | —                                                                  |
| **Proyectos**     | CRUD básico: creación y eliminación de proyectos.                                            | `name`, `description`, `category`, `priority`, `teamMembers`       |
| **Equipo**        | CRUD completo: creación, edición y eliminación de miembros. Manejo seguro de valores `null`. | `userId`, `role`, `position`, `birthdate`, `projectId`, `isActive` |
| **Tareas**        | CRUD básico con paginación y filtrado por proyecto.                                          | `description`, `projectId`, `status`, `dateline`, `userId`         |
| **Configuración** | Formulario simulado con Switch, Select y alertas de guardado.                                | `theme`, `emailNotifications`, `apiUrl`                            |

---

### 💡 Conclusión

El **Dashboard de Proyectos** demuestra cómo combinar la **potencia de Tailwind CSS** con la **modularidad de CSS Modules** y la **flexibilidad de shadcn/ui** para crear aplicaciones escalables, personalizables y con un diseño profesional. Además, el manejo correcto del estado global y las validaciones en formularios refuerzan la solidez técnica del sistema.

---

### 🚀 Inicio Rápido

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Anjelisahori/LAB-11-DWA
   cd next-shadcn-ui
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Ejecutar la aplicación en modo desarrollo:**

   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**

   ```
   http://localhost:3000/dashboard
   ```

---
