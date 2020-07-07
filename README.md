# Edudational Chatbot with WatsonServices
The "Universidad Peruana de Ciencias Aplicadas" has a program called "Summer Camp" for certain specializations in Communications and Engineering, where an introduction is made to young people in the 3rd, 4th and 5th years of high school and, therefore, they are close to entering University. Within this context:
* They want to receive feedback on the Summer Camp, so that they can improve the quality of the service.

The proposed solution is to implement a Chatbot that can collect opinions or “reviews” of the Summer Camp so that this data is processed under a sentiment analysis for subsequent decision-making to improve the service.

This Chatbot is integrated with Watson Assistant, Speech To Text, Tone Analyzer, Natural Language Understanding, Language Translator and Cloudant.

Then we will create a web-based chatbot, in which you have the option of having voice and written input. In addition, sentiment analysis will be performed using Tone Analyzer and Natural Language Understanding, the response of these services will be stored in a NoSQL Cloudant database in real time.

![Arquitectura](/doc/images/arquitectura.jpg)

## Flow
1. Users interact with the web application by typing in a text field or by selecting a microphone option in the browser and speaking.
2. Depending on the user input, the flow will continue as follows:
* If the input is voice, it is transmitted to Watson Speech To Text using a Web Socket connection, which extracts the text.
* If the input is text, it is transmitted directly to Watson Assistant.
3. The text is sent as input to Watson Assistant using REST APIs.
4. Watson Assistant generates a response in text format.
5. The result is returned to the web application showing the text in the user interface.
6. When the user specifically leaves their review, it goes to the IBM translation service to convert the text into English.
7. The translated text is analyzed by the Tone Analyzer and the NLU obtaining the analysis of emotions and feelings.
8. The answers of the analysis carried out, the information collected during the dialogue, and the original review in Spanish are stored in the Cloudant database.

## Included components

* [IBM Watson Assistant](https://www.ibm.com/cloud/watson-assistant/): Build, test and deploy a bot or virtual agent across mobile devices, messaging platforms, or even on a physical robot.
* [IBM Watson Speech-to-Text](https://cloud.ibm.com/catalog/services/speech-to-text): Service that converts the human voice into written text.
* [IBM Watson Natural Language Understanding](https://www.ibm.com/watson/services/natural-language-understanding/): Analyze text to extract meta-data from content such as concepts, entities, keywords, categories, sentiment, emotion, relations, semantic roles, using natural language understanding.
* [IBM Watson Tone Analyzer](https://www.ibm.com/watson/services/tone-analyzer/): A service that uses linguistic analysis to detect three types of communication tones: emotion, social attitudes, and language styles.
* [IBM Watson Language Translator](https://www.ibm.com/watson/services/language-translator/): Translation service given a couple of languages.
* [IBM Cloudant](https://www.ibm.com/cloud/cloudant): NoSQL database.

## Steps

1. [Clone the repo](#1-clone-the-repo)
1. [Create Watson Assistant and Cloudant services](#2-create-watson-services)
1. [Upload the Watson Assistant skill](#3-upload-the-watson-assistant-skill)
1. [Set up .env with credentials](#4-set-up-credentials)
1. [Deploy the application](#5-deploy-the-application)
1. [Use the web app](#6-use-the-web-app)

### 1. Clone the repo

Clone the `EducationalChatbot` locally. In a terminal, run:

```bash
git clone https://github.com/Mishelc/EducationalChatbot
```

### 2. Create Watson services and Cloudant 

<h5>Create the service instances</h5>
  <ul>
    <li>If you do not have an IBM Cloud account, register for a free trial account <a href="https://cloud.ibm.com/login">here</a>.</li>
    <li>Click <a href="https://cloud.ibm.com/catalog/services/watson-assistant">here</a> to create a <b>Watson Assistant</b> instance.</li>
    <li>Click <a href="https://cloud.ibm.com/catalog/services/speech-to-text">here</a> to create a <b>Watson Speech To Text</b> instance.</li>
    <li>Click <a href="https://cloud.ibm.com/catalog/services/natural-language-understanding">here</a> to create a <b>Natural Language Understanding</b> instance.</li>
    <li>Click <a href="https://cloud.ibm.com/catalog/services/tone-analyzer">here</a> to create a <b>Tone Analyzer</b> instance.</li>
    <li>Click <a href="https://cloud.ibm.com/catalog/services/language-translator">here</a> to create a <b>Language Translator</b> instance.</li>
    <li>Click <a href="https://cloud.ibm.com/catalog/services/cloudant">here</a> to create a <b>Cloudant</b> instance.</li>
  </ul>

### 3. Upload the Watson Assistant skill
<p>

* Find the Assistant service in your IBM Cloud Dashboard.
* Click on the service and then click on `Launch tool`.
* Go to the `Skills` tab.
* Click `Create skill`.
* Select the `Dialog skill` option and then click `Next`.
* Click the `Import skill` tab.
* Click `Choose JSON file`, go to your cloned repo dir, and `Open` the JSON file in `doc/skill/summercamp.json`. 
* Select `Everything` and click `Import`.

</p>

### 4. Set up .env with credentials


### 5. Deploy the application


### 6. Use the web app
