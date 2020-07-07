//Inicializamos las variables de entorno
require('dotenv').config()

//Importamos las variables de entorno
const apikey = process.env.ASSISTANT_IAM_APIKEY
const assistantId = process.env.ASSISTANT_ID

//Importamos la dependencia de Assistant
const AssistantV2 = require('ibm-watson/assistant/v2')
const {
    IamAuthenticator
} = require('ibm-watson/auth')

const assistant = new AssistantV2({
    authenticator: new IamAuthenticator({
        apikey : apikey
    }),
    url: process.env.ASSISTANT_URL,
    version: '2019-02-28'
})

//Funcion para enviar mensaje
async function message(context, text, sessionId) {
    var payload = {
        context,
        assistantId,
        sessionId,
        input: {
            text,
            message_type: 'text',
            options: {
                return_context: true
            }
        }
    }
    return new Promise(function (resolve, reject) {
        assistant.message(payload, function (err, data) {
            if (err) reject(err)
            else {
                var text = '';
                var responses = data.result.output.generic;
                var intent = '';
                var entity = '';
                var nombre = '';
                var grado = '';
               
               var contexto = data.result.context.skills['main skill'].user_defined;
               if(contexto){
                   //console.log(JSON.stringify(contexto, null, 2));
                   //console.log(contexto.carrera);
                   if(contexto.nombres){
                    nombre += contexto.nombres;
                   }
                   if(contexto.grado_colegio){
                    grado += contexto.grado_colegio;
                   }   
               }
               
              var entities = data.result.output.entities;
              //console.log(JSON.stringify(entities, null, 2));
              var intents = data.result.output.intents;
              //console.log(JSON.stringify(intents, null, 2));
              //console.log(intents.length);
              
              if(intents){
                  if(intents.length >0){
                      intents.forEach(res =>{
                          if(res.intent == "hacer_review"){
                              //console.log(res.intent);
                              intent += res.intent;
                          }
                      })
                  }
              }
              if(entities){
                if(entities.length > 0){
                    entities.forEach(respt => {
                        if(respt.entity == "carreras_ing"){
                            entity += respt.entity;
                        }
                    })
                }
            }
            
                if (responses) {
                    if (responses.length > 0) {
                        responses.forEach(resp => {
                            switch (resp.response_type) {
                                case 'text':
                                    //console.log(response.output.generic[0].text);
                                    text += resp.text;
                                    break;
                                case 'option':
                                    // una lista de opciones.
                                    //console.log(response.output.generic[0].title);
                                    text += resp.title;
                                    text += '<br/>';
                                    const options = resp.options;
                                    // Listar las opciones por etiqueta.
                                    //text += '<ul>';
                                    for (let i = 0; i < options.length; i++) {
                                    //console.log((i+1).toString() + '. ' + options[i].label);
                                    text += '<img src="img/circulo.png" class="circle"></img>&nbsp;<span style="color:#e34949;cursor:pointer" id="opcion" onclick="enviarMensajeAssistant({},\'' + options[i].value.input.text + '\', sessionId);">'+ options[i].label + '</span>';
                                    text += '<br/>';
                                    }
                                    //text += '</ul>'
                                    break;
                            }
                        })
                    }
                }
                resolve({
                    text , intent , entity ,nombre, grado
                })
            }
        })
    })
}

//Funcion para crear un session_id
async function getSession() {
    return new Promise(function (resolve, reject) {
        assistant.createSession({
            assistantId
        }, function (error, response) {
            if (error) reject(error)
            else resolve(response.result.session_id)
        })

    })
}

//Exportamos la funcion message
module.exports = {
    message,
    getSession
}