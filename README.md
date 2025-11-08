# GRUPO18-2025-PROYINF

Este es el repositorio del *Grupo 18*, cuyos integrantes son:

* Matias Huiscan - 202273628-3
* Amaro Alarcón - 202373594-9
* Máximo Castillo - 202304518-7
* Diego Duarte - 202173582-8
* **Tutor**: Matías Barrera

## Wiki

Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/diegod88/GRUPO18-2025-PROYINF/wiki)

## Videos
[Link](https://youtu.be/PSws_HESvmw) al video del prototipo del Hito 3


## Aspectos técnicos relevantes
### Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop).
- [Node.js](https://nodejs.org/) (opcional, solo para desarrollo local)
- `curl` o cliente HTTP (para probar endpoints)

### Instrucciones configuración de Docker Desktop (WSL2)

- Abre Docker Desktop.  
- Ve a **Settings → General**.  
- Activa la opción **“Use the WSL 2 based engine”**.  
- Haz clic en **Apply & Restart**.
- Ve a **Settings → Resources → WSL Integration**.  
- Activa la integración para tu distribución (ejemplo: *Ubuntu*).  
- Guarda los cambios.

### Ejecución

- Para ejecutar el proyecto realizar: `docker-compose up --build`.
- Luego ir a `localhost` en el browser.