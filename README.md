# toniruiz.es

Web personal de Toni Ruiz: Developer & DevOps en Barcelona.

HTML, CSS y un poco de JavaScript, sin frameworks ni dependencias.

## Estructura

```
site/                  Fuente de la web (lo que se publica)
scripts/build.mjs      Build: copia site/ a _site/ e incrusta datos de la API de GitHub
.github/workflows/     Build y despliegue en GitHub Pages (en cada push y a diario)
```

## Contenido dinámico

`scripts/build.mjs` consulta la API pública de GitHub (versiones, último push y commits
recientes de los proyectos destacados) y:

- genera `_site/data/github.json`;
- incrusta los datos en el HTML, para que buscadores y previsualizaciones los vean sin JS;
- los expone a la terminal interactiva (`kubectl get pods`, `git log`).

El workflow se ejecuta en cada push y cada día, así que la web se mantiene al día sola.
Si la API falla, se publica el contenido estático de respaldo.

## Desarrollo local

```sh
node scripts/build.mjs            # o --offline para no llamar a la API
python3 -m http.server -d _site 8931
```
