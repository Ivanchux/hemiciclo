# Hemiciclo · notas para Claude

- Fuente de verdad: `src/`. `index.html` se genera con `python build.py`; nunca se edita a mano.
- Después de cada cambio: `python build.py` y `npm test`. Comprobar maquetación a 1440 y 390 px con `npm run shots`.
- Producto: web pública para todos, mapa real siempre de fondo, ventanas encima, colores semánticos (ámbar acción, azul info, verde bien, rojo mal, violeta evento).
- La carrera (juego) es una opción pequeña dentro de la web: seis medidores en hexágono (Lealtad, Convicción, Base, Fama, Dinero, Energía). Base de lógica en `legacy/carrera-p1/`. Partidos ficticios, geografía real.
- Veda de sondeos obligatoria (24 nov 00:00 a 29 nov 20:00). Tras el 29N cargar `REAL_29N` en `src/ui.js`.
- Iván decide sensaciones, humor, dificultad y arte; Claude escribe, prueba y conecta todo.
