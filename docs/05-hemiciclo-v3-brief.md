# 05 · Hemiciclo v3 · giro de producto (24-10-2026)

Estado: decisión de Iván tomada tras probar la v2. Sustituye al plan de «dos caras» del documento 04. Este documento está pensado para abrir una conversación nueva sin arrastrar contexto.

## Lo que dijo Iván (literal)

- «Yo quería algo como Objetivo 176 ultramejorado.»
- «Que se vean las simulaciones a tiempo real animadas.»
- «Descarta el juego porque no aporta nada.» (Corregido después: la carrera vuelve, pero solo como una opción pequeña dentro de la web. Ver «Segunda ronda de requisitos».)
- «Hay que centrar la web en que tenga todo claro. Me he metido y me pierdo con tantas cosas.»
- «Que pueda regular todo desde el inicio tampoco tiene mucho sentido, eso es más de laboratorio.»
- «Busco una experiencia para todos, ultra automatizada y visualmente impactante.»

## Qué significa

| Antes | Ahora |
|---|---|
| Simulador con muchos controles (método, umbral, circunscripción, overrides por provincia, deslizadores de 15 partidos) | Entrada sencilla y resultado automático. Los controles avanzados, si sobreviven, van escondidos |
| Juego de carrera política con corrupción | Descartado. No se desarrolla |
| Varias pestañas (inicio, simulador, histórico, campaña, quiniela, pactos, noche) | Un recorrido claro: de un vistazo a qué pasa y qué puede pasar |
| Resultados estáticos que se recalculan | Simulaciones animadas en directo: el hemiciclo y el mapa se mueven mientras corre la simulación |

## Por concretar en la conversación nueva

- Qué es exactamente «Objetivo 176» para Iván (referencia que él conoce). Pedirle una captura o el enlace y qué le gusta de ella, antes de diseñar.
- La experiencia central en una frase. Propuesta de partida: «Abres la web y ves, en directo, miles de simulaciones del 29N cayendo sobre el hemiciclo; la web te dice quién gobierna en cuántas».
- Qué decide el usuario, si decide algo: lo mínimo (por ejemplo, elegir un pacto o mover un solo mando).
- Si se mantiene el histórico 1977–2023 como segundo modo.

## Qué se puede reutilizar

| Pieza | Dónde | Estado |
|---|---|---|
| Motor electoral (52 circunscripciones, D'Hondt, Monte Carlo con semilla, investidura) | `Hemiciclo_v2.html` (archivo único) | Probado con 329 comprobaciones |
| Veda de sondeos (24 nov 00:00 a 29 nov 20:00) | Hemiciclo v2 | Hecho. Confirmar con la Junta Electoral Central |
| Imagen compartible del hemiciclo (PNG 1280×720) | Hemiciclo v2 | Hecho |
| Quiniela del 29N | Hemiciclo v2 | Hecha, falta cargar `REAL_29N` tras la votación |
| Monigotes por código y hemiciclo SVG | `Carrera_P1.html` | Descartable con el juego; el hemiciclo SVG ya está también en la v2 |

## Reglas que siguen en pie

- La ley electoral prohíbe publicar sondeos en los cinco días previos a la votación (art. 69.7 LOREG). La web debe seguir ocultándolos en la veda.
- Datos reales para el simulador. Sin escándalos ni personajes inventados.
- El modelo falla más en 1977–79, 2015–16 y con Junts: avisarlo en la interfaz.

## Plazo

El 29 de noviembre de 2026 es la votación. La campaña arranca el 13 de noviembre. Todo lo que no esté listo para entonces pierde su momento.

## Segunda ronda de requisitos (24-10, 22:14)

| Tema | Lo que pide Iván |
|---|---|
| Carrera | Solo una opción pequeña dentro de la web, no el centro |
| Fondo | Siempre el mapa interactivo por defecto |
| Pantallas | Pestañas aparte, en pantalla completa o más pequeñas, según lo que se hace en cada momento |
| Contexto | Ya presente en cada pantalla, sin botones de «ver más» |
| Maquetación | Sin desbordamientos de texto. Todo colocado, separado, cuadrado y clasificado por colores o símbolos para saber qué hacer en cada momento |
| Tiempo real | Votaciones y resultados en directo. Animaciones al segundo en el hemiciclo, los porcentajes y los eventos |
| Medidores de la carrera | Lealtad, Convicción, Base y Fama en forma de hexágono, más dos variables nuevas que afecten a todo |
| Contenido | Mucha más variedad de escenarios, decisiones y planteamientos |

Pendiente de decidir con Iván: cuáles son las dos variables nuevas del hexágono y si el mapa de fondo es el real de España con provincias o el de casillas.

## Archivado

`Carrera_P1.html` (partidos ficticios PPE, PSOP, VPV, FP y PCS) queda como base para la opción de carrera. Su lógica, cartas y monigotes se pueden reaprovechar, pero la interfaz se rehace.
