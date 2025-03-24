# 🌱 **EcoJourney**

## Descripción

**EcoJourney** es una aplicación web desarrollada con [Next.js](https://nextjs.org) que permite a las personas planificar sus trayectos y descubrir nuevas rutas teniendo en cuenta el impacto ambiental de sus decisiones. A través de una interfaz accesible y visual, los usuarios pueden seleccionar su origen y destino, elegir un medio de transporte y obtener una estimación de la huella de carbono generada.

Además del cálculo de emisiones, EcoJourney fomenta el turismo sostenible mediante recomendaciones personalizadas y la posibilidad de compartir rutas con la comunidad. Las rutas públicas pueden recibir reseñas y valoraciones, y cada usuario puede guardar las que más le interesen, generar publicaciones asociadas o añadir notas y etiquetas para uso propio.

Este proyecto combina tecnología actual con una mirada crítica hacia la sostenibilidad, con el objetivo de inspirar hábitos de movilidad más responsables tanto en viajes cotidianos como en escapadas y vacaciones.

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

- **Rutas con Persistencia y Detalles**  
  Los usuarios registrados pueden guardar sus rutas, añadir etiquetas, notas personalizadas y consultar sus rutas creadas o guardadas desde otros perfiles.

- **Sistema de Publicaciones**  
  Comparte rutas públicamente a través de publicaciones. Cada usuario puede ver las rutas compartidas por otros y acceder a sus detalles.

- **Reseñas y Valoraciones**  
  Las rutas públicas pueden recibir valoraciones con estrellas y comentarios de otros usuarios.

- **Acciones Condicionadas por Rol**  
  Solo el creador de una ruta o publicación puede editarla o eliminarla, asegurando control y coherencia.

- **Autenticación con Google**  
  Inicio de sesión sencillo a través de [NextAuth.js](https://next-auth.js.org/) usando cuentas de Google.

- **Aplicación Accesible**  
  Todos los botones, iconos y formularios incluyen atributos `aria-label` y `title`, cumpliendo con buenas prácticas de accesibilidad.

- **Diseño Responsive**  
  Adaptada a dispositivos móviles, tablets y pantallas grandes mediante Tailwind CSS.

- **Backend con Node.js y MongoDB**  
  API REST con control de rutas, validaciones y persistencia de datos segura y escalable.

---

## 📂 Estructura del Proyecto

La estructura del proyecto sigue la convención típica de Next.js, con carpetas como components, pages, utils, styles y lib.
Se han aplicado divisiones por funcionalidades para mantener claridad, y puede variar a medida que evoluciona el proyecto.

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
git clone https://github.com/ClaraDevelope/ecojourney.git
cd ecojourney
```

### 2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

### 3. Configura las variables de entorno:

Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes claves:

```bash
NEXT_PUBLIC_HERE_API_KEY=tu_api_key_de_HERE
NEXT_PUBLIC_ORS_API_KEY=tu_api_key_de_OpenRouteService
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_de_GoogleMaps
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=una_clave_secreta_para_autenticación
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
NEXT_PUBLIC_BACKEND_URL=tu_backend_url
```

### 4. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

### 5. Accede a la aplicación:

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

📚 **Documentación Técnica**

### Tecnologías Utilizadas

- **Framework**: Next.js
- **Estilización**: Tailwind CSS
- **APIs Externas**:
  - [HERE Maps](https://www.here.com/docs/): Para geolocalización y autocompletado.
  - [Leaflet](https://leafletjs.com/reference.html): Para visualización de mapas interactivos.
  - [OpenRouteService](https://openrouteservice.org/sign-up/): Para cálculo de rutas y distancias.
  - [Google Maps](https://developers.google.com/maps/documentation): Para renderizar imágenes estáticas de mapas en el apartado "Mis rutas".

🎓 **Recursos de Aprendizaje**  
Si deseas profundizar en las tecnologías utilizadas en este proyecto, aquí tienes algunos recursos útiles:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HERE Maps Developer Guide](https://www.here.com/docs/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [OpenRouteService API](https://openrouteservice.org/sign-up/)
- [Google Maps Documentation](https://developers.google.com/maps/documentation)

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
