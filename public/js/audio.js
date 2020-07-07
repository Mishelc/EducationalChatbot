$(document).ready(function () {

    //var recordButton = document.getElementById("recordButton");
    //var stopButton = document.getElementById("stopButton");

    //webkitURL is deprecated but nevertheless 
    URL = window.URL || window.webkitURL;
    var gumStream;

    //stream from getUserMedia() 
    var rec;

    //Recorder.js object 
    var input;

    //new audio context to help us record 
    //var recordButton = document.getElementById("recordButton");
    //var stopButton = document.getElementById("stopButton");

    //add events to those 2 buttons 
    /*
    recordButton.addEventListener("click", startRecording);
    stopButton.addEventListener("click", stopRecording);
    */
   const recordMic = document.getElementById('stt2');
   recordMic.onclick = function() {
     const fullPath = recordMic.src;
     const filename = fullPath.replace(/^.*[\\/]/, '');
     if (filename == 'mic.gif') {
       try {
         recordMic.src = 'img/mic_active.png';
         startRecording();
         console.log('recorder started');
         //$('#q').val('I am listening ...');
       } catch (ex) {
         // console.log("Recognizer error .....");
       }
     } else {
       stopRecording();
       //$('#q').val('');
       recordMic.src = 'img/mic.gif';
     }
   };

    function startRecording() {
        //MediaStreamAudioSourceNode we'll be recording 
        // shim for AudioContext when it's not avb. 
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContext;

        var constraints = {
            audio: true,
            video: false
        }
        /* Disable the record button until we get a success or fail from getUserMedia() */

        //recordButton.disabled = true;
        //stopButton.disabled = false;

        /* We're using the standard promise based getUserMedia()
    
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            /* assign to gumStream for later use */
            gumStream = stream;
            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);
            /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
            rec = new Recorder(input, {
                numChannels: 1
            })
            //start the recording process 
            rec.record();
        }).catch(function (err) {
            //enable the record button if getUserMedia() fails 
            recordButton.disabled = false;
            stopButton.disabled = true;
            pauseButton.disabled = true;
        });
    };

    function stopRecording() {
        //disable the stop button, enable the record too allow for new recordings 
        //stopButton.disabled = true;
        //recordButton.disabled = false;
        //tell the recorder to stop the recording 
        rec.stop(); //stop microphone access 
        gumStream.getAudioTracks()[0].stop();
        //create the wav blob and pass it on to createDownloadLink 
        rec.exportWAV(createDownloadLink);
    };

    function createDownloadLink(blob) {
        blobToBase64(blob, function (base64) { // encode
            var data = {
                'blob': base64
            };
            var audio = `<div class="from-user">
                            <div class="message-inner">
                                <audio controls>
                                    <source src="data:audio/wav;base64,${base64}"/>
                                </audio>
                            </div>
                        </div>`
            $('#chat').append(audio);
            //window.wave();
            window.scrollMessages();
            $.ajax({
                url: '/speechToText',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data),
                success: function (res) {
                    console.log(res);
                    window.scrollMessages();
                    window.enviarMensajeAssistant({}, res, window.sessionId)
                }
            });
        });
    }

    var blobToBase64 = function (blob, cb) {
        var reader = new FileReader();
        reader.onload = function () {
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            cb(base64);
        };
        reader.readAsDataURL(blob);
    };

});