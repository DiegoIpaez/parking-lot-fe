# Parking Lot

Sistema de gestión de estacionamiento desarrollado con Next.js. Permite gestionar espacios de estacionamiento, sesiones de vehículos, y proporciona interfaces diferenciadas para operadores y administradores.

## 🚀 Tecnologías

- **Framework**: Next.js 16.0.2 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Estilos**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Estado**: Zustand 5.0.8
- **Data Fetching**: TanStack Query 5.90.7
- **Formularios**: React Hook Form 7.66.0 + Zod 4.1.12
- **HTTP Client**: Axios 1.13.2
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- **Node.js**: >= 22.14.0
- **Package Manager**: Yarn (recomendado) o npm

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd parking-lot-fe
```

2. Instala las dependencias:
```bash
yarn install
# o
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
JWT_SECRET=tu-secreto-super-seguro
NODE_ENV=development
```

4. Inicia el servidor de desarrollo:
```bash
yarn dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📜 Scripts Disponibles

- `yarn dev` - Inicia el servidor de desarrollo
- `yarn build` - Construye la aplicación para producción
- `yarn start` - Inicia el servidor de producción
- `yarn lint` - Ejecuta el linter de ESLint

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas (App Router)
│   ├── (operador)/         # Rutas del operador
│   │   └── (home)/         # Dashboard del operador
│   ├── admin/              # Rutas del administrador
│   ├── login/              # Página de login
│   └── actions/            # Server Actions
├── components/              # Componentes compartidos
│   ├── ui/                 # Componentes UI base (shadcn/ui)
│   │   └── custom/         # Componentes customizados
│   └── providers/          # Providers de React Query, etc.
├── constants/               # Constantes de la aplicación
├── hooks/                  # Custom hooks
├── lib/                    # Utilidades y configuraciones
│   └── axios.ts            # Configuración de Axios
├── services/               # Servicios API
├── stores/                 # Estado global (Zustand)
├── types/                  # Tipos TypeScript
└── utils/                  # Utilidades y formatters
```

## 🏗️ Arquitectura

### Convenciones de Nombres

- **Servicios**: camelCase + `Service` → `parkingSpacesService`
- **Tipos**: PascalCase → `ParkingSession`, `GetResponse`
- **Componentes**: PascalCase → `SectorCard`
- **Archivos servicios**: kebab-case + `.service.ts` → `parking-spaces.service.ts`
- **Archivos tipos**: kebab-case + `.type.ts` → `models.type.ts`
- **Hooks**: kebab-case + `use-` → `use-mobile.ts`
- **Utils**: kebab-case + `.util.ts` o `.formatter.ts`

### Servicios (`src/services/`)

Los servicios siguen un patrón consistente:

```typescript
import axios from '@/lib/axios';
import type { GetResponse, Model, ModelFilters } from '@/types';

export const modelService = {
  getAll: async (filters?: ModelFilters): Promise<GetResponse<Model>> => {
    const params: ModelFilters = {};
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    const { data } = await axios.get('/endpoint', { params });
    return data;
  },
  getById: async (id: number): Promise<Model> => {
    const { data } = await axios.get(`/endpoint/${id}`);
    return data;
  },
  create: async (data: CreateRequest): Promise<Model> => {
    const { data: responseData } = await axios.post('/endpoint', data);
    return responseData;
  },
  // ... más métodos
};
```

### Tipos (`src/types/`)

- **models.type.ts**: Modelos de datos, enums, tipos de request
- **reponses.type.ts**: Tipos de respuesta (`PaginatedResponse`, `GetResponse`)
- **index.ts**: Exporta todos los tipos

### Componentes

- **Compartidos** (`src/components/`): Componentes reutilizables
- **Específicos de ruta** (`src/app/[ruta]/_components/`): Componentes específicos de una ruta

### Páginas (`src/app/`)

Las páginas client components siguen este patrón:

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { modelService } from '@/services/model.service';
import type { Model } from '@/types';
import SpinnerCs from '@/components/ui/custom/SpinnerCs';

export default function Page() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['model-name'],
    queryFn: modelService.getAll,
    select: (data) => data.data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <SpinnerCs className="h-8 w-8" />
      </div>
    );
  }

  return <div className="container mx-auto px-4 py-8">{/* ... */}</div>;
}
```

### Imports

**Siempre usar paths absolutos con `@/`**:
- `@/services` - Servicios API
- `@/types` - Tipos TypeScript
- `@/components` - Componentes
- `@/lib` - Utilidades
- `@/constants` - Constantes

**Orden de imports**:
1. React/Next imports
2. Librerías externas
3. `@/services`
4. `@/types`
5. `@/components/ui`
6. `@/components/ui/custom`
7. `./_components` (componentes locales)
8. `@/lib/utils`, `@/utils`
9. `@/constants`

### React Query

- **Query keys**: Arrays en formato kebab-case
  - Simple: `['model-name']`
  - Con filtros: `['model-name', filters]`
  - Específico: `['model-name', id]`

- **Query functions**: Llamar directamente a métodos del servicio
- **Select**: Usar para transformar datos cuando sea necesario

## 🎨 UI Components

El proyecto utiliza componentes de [shadcn/ui](https://ui.shadcn.com/) basados en Radix UI:

- Componentes base en `src/components/ui/`
- Componentes customizados en `src/components/ui/custom/`
- Usar `cn()` de `@/lib/utils` para combinar clases
- `SpinnerCs` para estados de carga

## 🔐 Autenticación

El sistema maneja dos tipos de usuarios:
- **Operador**: Gestiona check-in/check-out de vehículos
- **Administrador**: Accede al dashboard con historial de sesiones

La autenticación se maneja mediante:
- Zustand store (`src/stores/auth.store.ts`)
- Server Actions (`src/app/actions/auth.action.ts`)
- Cookies HTTP-only para tokens

## 📦 Módulos Principales

### Operador
- Dashboard con sectores y espacios
- Check-in de vehículos (con registro de nuevos vehículos)
- Check-out de vehículos

### Administrador
- Dashboard con historial de sesiones
- Filtros por fecha, placa, estado
- Paginación de resultados

## 🔧 Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
JWT_SECRET=tu-secreto-super-seguro
NODE_ENV=development
```

### Paths Alias

Configurado en `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📝 Reglas de Desarrollo

El proyecto sigue estrictamente las reglas definidas en `.cursor/rules/architecture.mdc`. Algunas reglas críticas:

- ❌ Nunca usar imports relativos (`../`, `./`) cuando puedas usar `@/`
- ✅ Siempre tipar props con interfaces
- ✅ Siempre usar `import type { ... }` para tipos
- ✅ Exportar componentes con nombre (no default) cuando sea posible
- ✅ Siempre usar `async/await` en servicios, nunca `.then()`
- ✅ Manejar estados de loading y error en páginas
- ✅ Usar constantes de `@/constants`


## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para más detalles.
