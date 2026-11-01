# WORLD FOOTBALL ONLINE

Prototipo inicial de un juego de fútbol para navegador, pensado para PC y celulares.

## Cómo probarlo
1. Abrí `index.html` desde GitHub Pages o un servidor web estático.
2. Entrá en **Jugar** y elegí los equipos.
3. En PC movete con **WASD** o las flechas y pateá con **Espacio**.
4. En celular usá los controles táctiles que aparecen en la cancha.

## Incluye esta primera versión
- Interfaz adaptable a PC y móvil.
- Cancha interactiva y partido local de demostración.
- Selección inicial de selecciones nacionales y clubes conocidos de Europa y América.
- Pantalla de mundialitos con fase de grupos, octavos, cuartos, semifinales y final.
- Diseño inicial de salas privadas y chat.

## Importante: funciones online
Esta versión es un **prototipo frontend**. Las salas, el chat y los torneos todavía son vistas de demostración: no conectan jugadores reales ni guardan resultados en un servidor. Para habilitar multijugador online real hace falta desarrollar un backend con autenticación, salas, chat moderado, sincronización de posiciones/partidos y almacenamiento de torneos. El siguiente paso recomendado es integrar un servidor en tiempo real (por ejemplo, Node.js + Socket.IO) y una base de datos.

## Próximas etapas
1. Mejorar el gameplay 3D, animaciones, arqueros, pases, tiros y faltas.
2. Crear backend y partidas online sincronizadas.
3. Implementar salas privadas con código y chat.
4. Programar torneos completos: grupos, tabla de posiciones, cruces y eliminación directa.
5. Ampliar el catálogo de selecciones y clubes con planteles y escudos autorizados.
