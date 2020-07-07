require('dotenv').config();
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const Cloudant = require('@cloudant/cloudant');
const app = express();
const assistant = require('./services/assistant');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth')
 
app.use(express.static('./public'));

app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    extended: true
}))
//connection to db
var cloudant = Cloudant({ username:process.env.USER, password:process.env.PSW, url:process.env.URL}, function(err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }else{
        console.log('db connected');
    }
});

app.post('/add', function(req, res){
    console.log(JSON.stringify(req.body));   
    cloudant.use('challenge').insert(req.body).then(() => {
        console.log('datos insertados'); 
     }).catch((err) => {
        console.log(err);
     });

});

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.STT_APIKEY
    }),
    url: process.env.STT_URL
})

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
      apikey: process.env.TA_APIKEY
    }),
    url: process.env.TA_URL
});

const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.LT_APIKEY
    }),
    url: process.env.LT_URL
  });

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2019-07-12',
    authenticator: new IamAuthenticator({
      apikey: process.env.NLU_APIKEY
    }),
    url: process.env.NLU_URL
});

app.get('/getSession', async (req, res) => {
    try {
        var session_id = await assistant.getSession()
        res.json(session_id)
    } catch (error) {
        res.json(error)
    }
})

app.post('/message', async (req, res) => {
    var {
        context,
        text,
        sessionId
    } = req.body
    try {
        var response = await assistant.message(context, text, sessionId)
        //console.log(response);
        res.json({
            "text": response.text,
            "intent" : response.intent,
            "entity" : response.entity,
            "nombre" : response.nombre,
            "grado" : response.grado
        });
    } catch (err) {
        console.error(err);
    }
})
//Speech To text
var contador = 0
var audioUser

app.post('/speechToText', function (req, res) {
    audioUser = `user${contador}.wav`
    contador++
    var buf = new Buffer.from(req.body.blob, 'base64') // decode
    fs.writeFile(`./public/audio/${audioUser}`, buf, function (err) {
        if (err) console.log("err", err)
        else {
            var params = {
                audio: fs.createReadStream(`./public/audio/${audioUser}`),
                contentType: 'audio/l16; rate=44100',
                model: 'es-ES_BroadbandModel'
            }
            speechToText.recognize(params, function (err, resp) {
                if (err) console.log(err)
                else {
                    var response = resp.result.results[0].alternatives[0].transcript
                    res.json(response);
                }
            })
        }
    })
})
//Tone Analyzer
app.post('/ToneAnalyzer', function(req,res){
    console.log(req.body.text)
    const toneParams = {
        toneInput: { 'text': req.body.text },
        contentType: 'application/json'
      };
      
      toneAnalyzer.tone(toneParams, function(err, resp){
          if(err){
            console.log(err);
          }else{
            var response = resp.result.document_tone.tones;
            res.json(response);
            //console.log(response);
          }
      })
})
//Language Translator
app.post('/Translator', function(req, res){
    console.log(req.body.text);
    const translateParams = {
        text: req.body.text,
        modelId: 'es-en',
      };
      
      languageTranslator.translate(translateParams, function(err, resp){
          if(err){
              console.log(err)
          }else{
            var response = resp.result.translations[0].translation;
            res.json(response);
            //console.log(response);
          }
      })
})

//Natural Language Understanding
app.post('/NaturalLanguage', function(req, res){    
    const analyzeParams = {
    'text': req.body.text,
    'features': {
        'emotion': {
            'document' : true
        },
        'sentiment':{
            'document': true
        }
    }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams, function(err, resp){
        if(err){
            console.log(err)
        }else{
            var response = resp.result;
            
            res.json(response);
            //console.log(response);
        }
    })
    
})

//Servidor
const port =process.env.PORT || 3000;
app.set('port', port);
app.listen(app.get('port') , () => console.log(`Running on port ${app.get('port')}`));