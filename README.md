# Edudational Chatbot with WatsonServices
The "Universidad Peruana de Ciencias Aplicadas" has a program called "Summer Camp" for certain specializations in Communications and Engineering, where an introduction is made to young people in the 3rd, 4th and 5th years of high school and, therefore, they are close to entering University. Within this context:
• They want to receive feedback on the Summer Camp, so that they can improve the quality of the service.

The proposed solution is to implement a Chatbot that can collect opinions or “reviews” of the Summer Camp so that this data is processed under a sentiment analysis for subsequent decision-making to improve the service.

This Chatbot is integrated with Watson Assistant, Speech To Text, Tone Analyzer, Natural Language Understanding, Language Translator and Cloudant.

Then we will create a web-based chatbot, in which you have the option of having voice and written input. In addition, sentiment analysis will be performed using Tone Analyzer and Natural Language Understanding, the response of these services will be stored in a NoSQL Cloudant database in real time.

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

