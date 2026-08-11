# aria-hero.mp4

Fondo scrubeable del Hero (`BackgroundVideo.jsx`). Re-encodeado localmente a partir del
video original para que el scrub con el mouse sea liviano — la clave es el intervalo de
keyframes corto (`-g 15`), que permite que cualquier seek arbitrario decodifique rápido en
vez de tener que reconstruir varios segundos de frames desde el keyframe anterior.

Si en algún momento hay que reemplazar este video por uno nuevo, el comando usado fue:

```bash
ffmpeg -i original.mp4 -vf "scale=-2:720" -an -c:v libx264 -preset medium -crf 26 \
  -g 15 -keyint_min 15 -sc_threshold 0 -movflags +faststart aria-hero.mp4
```

- `-vf scale=-2:720` — baja a 720p de alto (ancho ajustado automáticamente, divisible por 2).
- `-an` — saca el audio (el video se reproduce muted, no hace falta).
- `-g 15 -keyint_min 15 -sc_threshold 0` — fuerza un keyframe cada 15 frames sin importar
  el contenido, para que el scrub sea fluido.
- `-movflags +faststart` — permite que el navegador empiece a reproducir antes de bajar el
  archivo entero.
