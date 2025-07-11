# reto-softtek

Este es un esqueleto de la solución para el reto técnico basado en **Domain Driven Design**.

## Estructura
- `src/domain`: entidades y repositorios de dominio.
- `src/application`: casos de uso.
- `src/infrastructure`: implementación de servicios externos y repositorios.
- `src/interfaces`: controlador tipo Lambda.
- `src/index.ts`: servidor HTTP de ejemplo para ejecutar localmente.

## Compilación

Compilar los archivos TypeScript a JavaScript:

```bash
npx tsc
```

## Ejecución local

```bash
node dist/index.js
```

El servidor se inicia en `http://localhost:3000` y ejecuta el handler definido para Lambda. Las llamadas a las APIs externas fallarán en entornos sin acceso a internet, pero el flujo demuestra la separación en capas.

## Endpoints

- `GET /fusionados?id=1&location=lat,lon` combina la información de SWAPI con datos meteorológicos y la almacena.
- `POST /almacenar` recibe un objeto `FusedData` en el cuerpo y lo guarda en la base de datos en memoria.
- `GET /historial?limit=10&offset=0` devuelve el historial paginado de datos almacenados.

Los resultados se almacenan en memoria y se cachean por 30 minutos.
