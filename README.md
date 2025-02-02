# 🌱 **EcoJourney**

## Descripción

**EcoJourney** es una aplicación web construida con [Next.js](https://nextjs.org) que ayuda a los usuarios a planificar viajes minimizando su huella de carbono. Ofrece herramientas para calcular emisiones de CO₂ según diferentes modos de transporte, proporcionar recomendaciones de turismo sostenible y promover prácticas responsables durante los viajes.

Este proyecto combina tecnología moderna con principios de sostenibilidad, buscando inspirar a los usuarios a tomar decisiones más ecológicas en sus desplazamientos diarios y vacaciones.

---

## 🚀 Características Principales

- **Selección de Origen y Destino**
  Usa la API [HERE Maps](https://developer.here.com/) para autocompletar direcciones y seleccionar puntos de partida y llegada.

- **Calculadora de Huella de Carbono**
  Estima las emisiones de CO₂ asociadas con diferentes medios de transporte (coche, tren, avión, bicicleta, etc.).

- **Recomendaciones Personalizadas**
  Proporciona sugerencias sobre actividades sostenibles y prácticas responsables en el destino elegido.

- **Interfaz Intuitiva**
  Diseñada para ser fácil de usar y visualmente atractiva, asegurando una experiencia fluida para el usuario.

---

## 📂 Estructura del Proyecto

El proyecto sigue la arquitectura por componentes de Next.js, organizado en carpetas lógicas:

/ecojourney
├── public/ # Archivos estáticos
├── src/
│ ├── app/
│ │ ├── page.tsx # Página principal
│ │ ├── layout.tsx # Layout global
│ │ ├── global.css # Estilos globales
│ │ ├── viajes/ # Sección Viajes
│ │ │ └── ... # Componentes y lógica relacionados con viajes
│ │ └── recomendaciones/ # Sección Recomendaciones
│ │ └── ... # Componentes y lógica relacionados con recomendaciones
│ ├── components/ # Componentes reutilizables
│ │ ├── footer/ # Componente Footer
│ │ ├── gridLandingLayout/# Componente para diseño de landing
│ │ ├── Navbar/ # Componente de navegación
│ │ └── TitleSection/ # Componente para títulos seccionales
│ ├── config/ # Configuraciones globales
│ │ └── ... # Archivos de configuración (por añadir)
│ └── services/ # Servicios y APIs
│ └── ... # Lógica de integración con APIs (por añadir)
└── README.md # Documentación del proyecto

---

## 🛠 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- Node.js (versión 16 o superior)
- npm o yarn
- Git

---

## 🚀 Instalación y Ejecución

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

### 1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/sustainability-travel-planner.git
cd sustainability-travel-planner
```

### 2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

### 3. Configura las variables de entorno:

```bash
NEXT_PUBLIC_HERE_API_KEY=tu_api_key_aquí
```

### 4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

# o

yarn dev

### 5. Accede a la aplicación:

Abre http://localhost:3000 en tu navegador para ver el resultado.

📚 Documentación Técnica
Tecnologías Utilizadas
Framework : Next.js
Estilización : Tailwind CSS
APIs Externas :
HERE Maps : Para geolocalización y autocompletado.

🎓 Recursos de Aprendizaje
Si deseas profundizar en las tecnologías utilizadas en este proyecto, aquí tienes algunos recursos útiles:

Next.js Documentation [https://nextjs.org/docs?spm=5aebb161.5ebf13d8.0.0.532140903ZU3PC]
Tailwind CSS Documentation [https://tailwindcss.com/docs/installation/using-vite?spm=5aebb161.5ebf13d8.0.0.532140903ZU3PC]
HERE Maps Developer Guide [https://www.here.com/docs/?spm=5aebb161.5ebf13d8.0.0.532140903ZU3PC]
Chart.js Documentation [https://www.chartjs.org/docs/latest/]

🌐 Despliegue
La manera más sencilla de desplegar tu aplicación Next.js es utilizando la plataforma Vercel . Vercel es el creador de Next.js y ofrece integración nativa para proyectos de este framework.

Consulta la documentación oficial de despliegue de Next.js para obtener más detalles sobre otras opciones de hosting.

🤝 Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, sigue estos pasos:

Haz un fork del repositorio.
Crea una rama para tu nueva funcionalidad (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios y envía un pull request.
📜 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

📩 Contacto
Si tienes preguntas o sugerencias sobre este proyecto, no dudes en contactarme:

Nombre: Clara Manzano Corona
Email: clara.manzano.corona@gmail.com
LinkedIn: [(https://www.linkedin.com/in/clara-manzano-corona/)]
Portfolio: [https://portfolioclaramanzano.vercel.app/]

```

```
