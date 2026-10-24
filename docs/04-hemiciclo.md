# 04 · Hemiciclo (título de trabajo)

Estado: el simulador (Hemiciclo v2) existe en un solo `index.html`, con modo creador, imagen compartible y quiniela del 29N, y pasa 329 tests automáticos. La carrera política no tiene prototipo. Última actualización: 24-10-2026.

## La frase

Un simulador electoral con datos reales de España y, sobre el mismo motor, un juego de carrera política: empiezas de militante y llegas, si te dejan, a presidente, y lo que puedes decidir crece con el cargo.

Momento de clip: eres el número 4 de la lista de tu provincia y el tercer escaño de tu partido se decide por unos cientos de votos en la noche electoral.

## Dos caras, un motor

| Cara | Qué es | Datos | Para quién |
|---|---|---|---|
| Simulador | Herramienta con datos reales, histórico 1977–2023, el 29N de 2026, escenarios con enlace y modo creador | Reales | Gente de a pie y creadores de contenido de actualidad |
| Carrera | Juego largo de ascenso político con corrupción y consecuencias | Partidos y personajes ficticios | Jugadores |

El motor no sabe de dónde vienen los datos. Cada país o mundo es un paquete de datos: partidos, circunscripciones, reglas del sistema y elecciones.

Reglas de separación:

- El simulador con datos reales no lleva escándalos ni personajes inventados.
- La carrera no usa nombres reales de personas, ni logotipos, ni fotos.
- Todos los bloques reciben las mismas probabilidades de escándalo y los mismos rasgos cómicos.

## Partidos de la carrera (aprobados por Iván el 24-10-2026)

| Sigla | Nombre | Equivale a |
|---|---|---|
| PPE | Partido Popular Español | Centro-derecha |
| PSOP | Partido Socialista Obrero Progresista | Centro-izquierda |
| VPV | Vanguardia Patria Viva | Derecha dura |
| FP | Frente Plural | Izquierda plural |
| PCS | Partido Comunista Socialista | Izquierda radical |

Nombres de personas: todos inventados. Los partidos son parodia de los reales y no llevan logotipos ni colores calcados.

## Referencia

Lawgivers II (SomniumSoft, acceso anticipado desde 2023) es la referencia de alcance y de sensación. Se inspiran mecánicas, no estética ni estructura.

| Se toma | Se deja |
|---|---|
| Un icono por diputado, con nombre y rasgos al pulsarlo | Muñecos 3D y paneles laterales densos |
| Cuadro emergente en el mapa con candidatos y votos | Guerra, comercio y geopolítica |
| «Libre albedrío» como opción de voto: disciplina contra conciencia | Decenas de países |
| Mesa del Gobierno como escena de delegación | Exceso de texto |

## Pilares

1. **El cargo cambia el verbo.** Quien está abajo cumple órdenes y se labra el camino. Quien sube delega y manda. Arriba se decide el qué y no el cómo.
2. **Visual por defecto, profundidad bajo demanda.** Cada tarjeta tiene un titular de diez palabras como máximo. El detalle está bajo «ver más» para quien quiera todos los tejemanejes.
3. **El mundo recuerda.** Cada decisión deja rastro: favores, rencores, un rival al que dejaste fuera de la lista y que vuelve.
4. **Lo oscuro es un sistema.** La corrupción no es un adorno: la hacen los demás y la puedes hacer tú.
5. **Ligero.** Una decisión central por pantalla. Un objeto grande (hemiciclo o mapa) y tarjetas cortas.

## Escalera de cargos

| Peldaño | Qué haces | Qué decides |
|---|---|---|
| Militante | Tareas de calle: carteles, firmas, actos de barrio | Obedecer, matizar o desobedecer cada orden |
| Candidato en lista | Disputas tu puesto en la lista provincial | A quién debes favores y a quién se los cobras |
| Diputado | Votas, enmiendas, comisiones | Seguir la disciplina de voto o romperla |
| Dirección del partido | Haces las listas y negocias | Quién va de número uno, quién se queda fuera, qué campañas delegas |
| Ministro o consejero | Una cartera con pocas palancas | Qué pides al presidente y qué delegas en tu equipo |
| Presidente | Consejo de ministros, investidura, pactos | Convocar elecciones, remodelar el gobierno, aguantar mociones |

Las listas son cerradas y bloqueadas. El puesto en la lista, junto con el reparto D'Hondt del motor, decide si consigues escaño. Ahí se conecta la carrera con el simulador.

## Bucle de una tarjeta

- Arrastrar a un lado: obedeces la orden.
- Arrastrar al otro: la desobedeces.
- Mantener pulsado: la matizas.

Cada opción cuesta algo distinto: lealtad, convicción o carrera. Arriba se delega: das un objetivo y un presupuesto de capital político, y cada subordinado tiene competencia y lealtad, así que la orden puede salir torcida.

## Lo oscuro

Tono: crudo y realista, con humor negro.

Ejemplos de texto:

- «El concejal de urbanismo te invita a comer. La cuenta la paga una constructora. El postre es un solar recalificado.»
- «La jueza ha pedido el móvil de tu cuñado. Tu cuñado ya no tiene móvil. Ahora tiene un abogado caro.»

| Acto | Beneficio inmediato | Cabo suelto |
|---|---|---|
| Aceptar una comisión | Dinero B | Un maletín |
| Colocar a un afín | Lealtad | Un familiar en nómina |
| Amañar una adjudicación | Favor de una empresa | Una obra que no existe |
| Comprar un voto | Un escaño en la votación | Un diputado que cambia de coche |
| Filtrar a la prensa | Daño a un rival | Un periodista que sabe de dónde vino |
| Callar a un testigo | Se frena un escándalo | Un testigo con miedo |

Cada acto sube el «calor». Medios, jueces y rivales tiran del hilo, y si salta llega la cadena visible: imputación, dimisión, moción de censura y caída a un peldaño anterior. Los demás también corrompen: puedes descubrirlo, guardarlo como baza o chantajear. El camino limpio da independencia, reputación y aliados que no te traicionan.

Las pruebas son objetos, lugares y personas (el maletín, el chalet, el testigo), nunca papeles ni registros.

## Arte

Monigotes de colores hechos por código, a la manera de la referencia: cabeza redonda, cuerpo simple, color de partido y variaciones de pelo, piel, corbata y gafas generadas con semilla. Un hemiciclo de 350 figuras en SVG o Canvas, mapas vectoriales y paneles limpios con poco texto. Retratos con encanto, si hacen falta más adelante, los genera Iván y se integran.

## Arquitectura y herramientas

| Área | Herramienta | Cuándo |
|---|---|---|
| Código y datos | TypeScript + Vite (o JS plano), datos en JSON, tests con Vitest | Al pasar del archivo único a varios |
| Repositorio y tareas | GitHub con Issues y Projects | Desde el principio |
| Web y partidas compartidas | Cloudflare Pages + Workers (y D1 o KV) | Reto diario, quiniela compartida, enlaces de escenario |
| Arte | Figma o Inkscape para vectores | Cuando haga falta más que lo hecho por código |
| Datos reales | Python y hojas de cálculo | Limpiar infoelectoral |
| Sonido | jsfxr o Bfxr | Con prototipo |
| Vídeo del modo creador | OBS, DaVinci Resolve y Canva | Probar el modo con clips propios |

## Reparto de trabajo

- **Claude:** código, tests del motor, bots que juegan la carrera, y comprobar en cada entrega que todo funciona y está conectado (botones con acción, guardado y carga, sin errores de consola, resultados reproducibles con semilla).
- **Iván:** tacto, diversión, dificultad, humor y arte con encanto.
- **Sin comprobar desde aquí:** sonido, mandos reales, Firefox, Safari y móviles.

## Plan

| Fase | Contenido | Estado |
|---|---|---|
| 1 | Hemiciclo v2: arreglos del motor, semilla, veda, contraste con las encuestadoras | Hecho (24-10) |
| 2 | Modo creador (enlace e imagen) y quiniela del 29N | Hecho (24-10). Falta cargar `REAL_29N` tras el 29N |
| 2b | Reto diario y separación en módulos | Pendiente |
| 3 | P1 de la carrera: militante, puesto en la lista, noche electoral y primer escaño (país entero con las 52 circunscripciones reales; tú juegas en una provincia real a tu elección y con un partido; sin corrupción) | En arranque |
| 4 | Diputado y disciplina de voto, dirección y delegación, gobierno, corrupción y escándalos | Por prototipos |

Después se decide el motor del juego serio (web o Godot 4).

## Resuelto en la v2

| Fallo de la v1 | Arreglo |
|---|---|
| La investidura ignoraba al candidato | Su partido vota «Sí» siempre |
| Todo usaba `Math.random` | Generador con semilla; el Monte Carlo es determinista |
| Noche electoral desfasada y vacía en circunscripción única | Se reinicia al cambiar el simulador y muestra escaños parciales |
| Veda de sondeos del 24 al 28 de noviembre | Interruptor por fecha (y `?veda=1`) que oculta encuestas; se oculta hasta las 20:00 del 29 por prudencia. Confirmar con la Junta Electoral Central |
| El modelo falla en 1977–79, 2015–16 y con Junts | Columna «Encuesta» con los escaños de cada encuestadora y nota de precisión |

Pendiente menor: al cambiar de candidato en el pactómetro, el anterior se queda en «sí»; solape del número del hemiciclo con la leyenda.

## Decisiones abiertas

- Título definitivo (se propone en tabla antes de aprobar).
- Catálogo de partidos satíricos por época.
- Si la carrera arranca en el 2026 o en otra época.
- Decidido (24-10): la carrera usa el país entero y la geografía real. Solo los partidos y las personas son ficticios.
