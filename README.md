# Portafolio de Emmanuel Requena

Portafolio personal de desarrollo de software. Reúne proyectos de IoT, aplicaciones de escritorio y documentación técnica, con enlaces a sus repositorios y recursos.

**[Visitar el portafolio](https://emmanuel-requena-portafolio.glovedbison6.chatgpt.site/)** · Español e inglés

La web está hecha con HTML, CSS y JavaScript. Puedes filtrar los proyectos y verlos en tarjetas, en una vista compacta o en un carrusel. Neón es el estilo inicial y el pie de página permite cambiar a Editor o Terminal.

## Desarrollo local

Abre `dist/index.html` directamente en el navegador o ejecuta `node preview.mjs` desde la raíz del repositorio y abre [la vista local](http://127.0.0.1:4173/). La vista con Node.js permite comprobar qué descargas se muestran cuando falta un PDF.

| Ruta | Contenido |
| --- | --- |
| `dist/index.html` | Estructura e ilustraciones |
| `dist/style.css` | Estilos y diseño adaptable |
| `dist/app.js` | Textos bilingües e interacciones |
| `dist/projects.js` | Fichas de proyectos y datos de contacto |
| `dist/cv/` | Currículums en PDF aprobados para publicar |

## Añadir un proyecto

Copia una ficha de `dist/projects.js` dentro de la lista `portfolioProjects`. Cambia el nombre, los textos en español e inglés, las tecnologías y `repository` con la URL directa del proyecto en GitHub. Usa una categoría existente (`iot`, `desktop` o `personal`) o añade el nombre de la categoría nueva en ambos idiomas en `dist/app.js`. Puedes omitir `visual` si todavía no hay una ilustración. La cuadrícula y el filtro se actualizan a partir de la lista.

## Actualizar los currículums

Coloca el PDF aprobado para difusión en [`dist/cv/`](dist/cv/) y conserva el nombre correspondiente. El botón de descarga de Contacto aparece cuando está disponible el archivo del idioma seleccionado.

| Idioma | Archivo |
| --- | --- |
| Español | `dist/cv/cv-es.pdf` |
| Inglés | `dist/cv/cv-en.pdf` |

Puedes sustituir un PDF sin cambiar el código ni reemplazar el otro. Guarda los borradores en tu carpeta de trabajo fuera del repositorio.

Los PDF iniciales son CV abreviados para probar la descarga en ambos idiomas.

## Publicación

`dist/` es la carpeta que sirve ChatGPT Sites. En GitHub, selecciona **Settings → Pages → GitHub Actions** como origen. El flujo de Pages publica la misma carpeta cuando se integra un pull request en `main`. Para el primer despliegue también puedes ejecutar el flujo manualmente desde **Actions**. [Configuración de GitHub Pages](https://docs.github.com/es/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
