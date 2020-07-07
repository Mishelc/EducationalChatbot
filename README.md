# ChatbotWatsonServices

Chatbot integrado con Watson Assistant, Speech To Text, Tone Analyzer, Natural Language Understanding ,Language Translator y Cloudant.

Crearemos un chatbot basado en la web, en la que se tiene la opción de tener entrada de voz y escrita. Además se realizará análisis de sentimientos utilizando Tone Analyzer y Natural Language Understanding, la respuesta de estos servicios será almacenado en una base de datos NoSQL Cloudant en tiempo real.

![Arquitectura](/doc/images/arquitectura.jpg)

## Flujo
1.  Los usuarios interactúan con la aplicación web escribiendo en un campo de texto o seleccionando una opción de micrófono en el navegador y hablando. 
2.	Dependiendo la entrada del usuario el flujo continuará de la siguiente manera:
* Si la entrada es voz se transmite a Watson Speech To Text usando una conexión Web Socket, el cual extrae el texto.
* Si la entrada es texto, se transmite directamente a Watson Assistant.
3.	El texto se envía como entrada a Watson Assistant usando REST APIs.
4.	Watson Assistant genera una respuesta en formato de texto.
5.	El resultado se devuelve a la aplicación web mostrando en la interfaz de usuario el texto.
6.	Cuando el usuario deja su review específicamente, esta pasa al servicio de traducción de IBM para convertir el texto en inglés.
7.	El texto traducido es analizado por el Tone Analyzer y el NLU obteniendo el análisis de emociones y sentimientos. 
8.	Las respuestas del análisis realizado, la información recolectada durante el diálogo, y la review original en español son almacenadas en la base de datos Cloudant.

## Despliegue
Se muestra cómo ejecutar el ChatbotWatsonServices en su máquina local.
#### Pasos
1.  Clonar el repositorio
2.  Crear servicios de Watson en IBMCloud
3.  Cargue el espacio de trabajo de Watson Assistant
4.  Configure .env con credenciales
5.  Ejecute la aplicación

