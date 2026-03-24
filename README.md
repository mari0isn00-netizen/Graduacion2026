# 🎬 SEÑAL G – Señal de Graduación

Prototipo de **programa de TV interactivo** para la fiesta de graduación, con estética *Scrapbook Retro Broadcast*.

## Concepto

- Una sola pantalla principal tipo **TV de los 90**.
- Invitados conectados con el móvil (más adelante).
- Estilo scrapbook: papel kraft, washi tape, polaroids, manchas de café, tipografías de máquina de escribir + títulos retro.

## Estado actual

- `index.html` contiene:
  - Lobby visual.
  - Lista de participantes.
  - Puntuación global.
  - Panel lateral para simular jugadores y puntos (sin servidor todavía).

## Próximos pasos

1. Separar en `/tv`, `/admin`, `/player`.
2. Conectar a un servidor Node.js + Socket.io.
3. Implementar juegos:
   - Música y Stop
   - La Bomba
   - Undercover
   - ¿Quién lo Dijo?
   - Esconder Objeto
   - Escondite Extremo
   - Teléfono Roto Visual
4. Añadir voces dobladas y efectos de sonido.

## Uso local (versión HTML estática)

Basta con abrir `index.html` en el navegador. No necesita servidor para el prototipo de lobby.
