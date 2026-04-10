# Hacker News Viewer

Aplicación web desarrollada con React que consume la API pública de Hacker News para visualizar las mejores historias, sus comentarios y permitir la navegación hacia la noticia original.

El proyecto implementa paginación, manejo de rutas, optimización de componentes y soporte offline mediante Service Worker.


## Tecnologías utilizadas

- React (Hooks)
- Vite
- React Router
- Material UI
- Service Worker
- Hacker News API


## API utilizada

API oficial de Hacker News:

https://github.com/HackerNews/API

Endpoints utilizados:

- /beststories.json
- /item/:id.json


## Estructura del proyecto

hacker-news-app/
├── dist/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CommentCard.jsx
│   │   └── StoryCard.jsx
│   │
│   ├── models/
│   │   ├── commentModel.js
│   │   └── storyModel.js
│   │
│   ├── pages/
│   │   ├── NotFoundPage.jsx
│   │   ├── StoryPage.jsx
│   │   └── TopPage.jsx
│   │
│   ├── router/
│   │   └── AppRouter.jsx
│   │
│   ├── services/
│   │   └── hnApi.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js


## Funcionalidades

- Listado de mejores historias con paginación (50 elementos por página)
- Visualización de comentarios por historia
- Navegación a la noticia original
- Manejo de rutas con React Router
- Página 404 personalizada
- Interfaz basada en Material UI
- Soporte offline
- Persistencia de datos en caché y almacenamiento local


## Rutas

| Ruta           | Descripción |
|----------------|------------|
| /top           | Lista de mejores historias |
| /story/:id     | Detalle de historia y comentarios |
| *              | Página 404 personalizada |


## Decisiones técnicas

### Modelos consistentes

Se implementaron funciones adaptadoras:

- adaptStory
- adaptComment

Estas funciones permiten desacoplar la estructura de la API de la capa de presentación.


### Servicios

Todas las llamadas a la API fueron centralizadas en:

src/services/hnApi.js


### Optimización

- Uso de React.memo en componentes reutilizables
- Uso de useMemo para cálculos derivados
- Uso de useCallback para evitar renders innecesarios


### Funcionamiento offline

- Estrategia: Network First (Freshness)
- Caché limitada a 10 respuestas externas
- Precaching de archivos estáticos
- Uso de localStorage como respaldo


## Instalación y ejecución

### Instalar dependencias

npm install


### Ejecutar en desarrollo

npm run dev


### Generar build

npm run build


### Ejecutar versión final

npx serve -s dist

## Cumplimiento de requerimientos

- React con hooks
- Material UI
- React Router
- API Hacker News
- Paginación de 50
- Navegación a noticias
- Comentarios por historia
- Modelos consistentes
- Optimización
- Funcionamiento offline


## Posibles mejoras

- Comentarios anidados
- IndexedDB
- Mejor experiencia offline
- Skeleton loading
- Deploy en producción


## Autor
Desarrollado como evaluación técnica.
