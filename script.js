btnMute=document.getElementById("idMuteBtn");
btnSig=document.getElementById("idSigBtn");
btnAnterior=document.getElementById("idAtrasBtn");
btnPlay=document.getElementById("idPlayBtn");
btnSub=document.getElementById("idSubBtn");
btnRandom=document.getElementById("idRandomBtn");

mainVid=document.getElementById("idVid");
track=document.getElementById("idSub");

var videos=["video1.mp4","video2.mp4","video3.mp4"];
var subs=["sub1.vtt","sub2.vtt","sub3.vtt"];


window.onload = function() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    
    recognition.lang = 'es-ES'; // Establecer el idioma
    
    recognition.onresult = function(event) {
        //COMANDOS DE VOZ
        const transcript = event.results[0][0].transcript;
        document.getElementById('output').textContent = transcript;

        console.log(transcript);
        if(transcript=="reproducir"){
          if(mainVid.paused){
            mainVid.play();
          }else{
            mainVid.pause();
          }

        }
        if(transcript=="mute"){
          mainVid.muted = !mainVid.muted;
        }

        if(transcript=="aleatorio"){
          
        }


    };

    recognition.onerror = function(event) {
        document.getElementById('output').textContent = 'Error: ' + event.error;
    };
    //BUTTONS
    document.getElementById('startRecognition').onclick = function() {
        recognition.start();
    };
    
    btnRandom.onclick=function(){
      x=Math.random()*3;          //GENERA UN NUMERO ENTRE 0 Y 3
      if(x<=1){
        mainVid.src=videos[0];
        track.src=subs[0];
      }
      if(x>1&&x<2){
        mainVid.src=videos[1];
        track.src=subs[1];
      }
      if(x>=2){
        mainVid.src=videos[2];
        track.src=subs[2];
      }
      
    }

    btnPlay.onclick=function(){
      if(mainVid.paused){
        mainVid.play();
      }else{
        mainVid.pause();
      }

    }

    btnMute.onclick=function(){
      mainVid.muted = !mainVid.muted;
    }

    btnSub.onclick=function(){    
      var tracks = mainVid.textTracks; // Obtiene todos los tracks de texto (subtítulos)
      for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          if (track.kind === "subtitles") {
              track.mode = (track.mode === "showing") ? "disabled" : "showing"; // Alterna entre "showing" y "disabled"
          }
      }

    }

    btnSig.onclick=function(){
      mainVid.currentTime += 10;
    }
    btnAnterior.onclick=function(){
      mainVid.currentTime -= 10;
    }

}



//var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
//var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
//var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

//var recognition = new SpeechRecognition();
///if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  //var speechRecognitionList = new SpeechGrammarList();
  //var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  //speechRecognitionList.addFromString(grammar, 1);
  //recognition.grammars = speechRecognitionList;
//}
//recognition.continuous = false;
//recognition.lang = 'es-MX';
//recognition.interimResults = false;
//recognition.maxAlternatives = 1;

//var diagnostic = document.querySelector('.output');
//var bg = document.querySelector('html');
//var hints = document.querySelector('.hints');

//var colorHTML= '';
//colors.forEach(function(v, i, a){
 // console.log(v, i);
  //colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
//});
//hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

//document.body.onclick = function() {
 // recognition.start();
  ///console.log('Ready to receive a color command.');
//}
//ijijijjij
//recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  //var color = event.results[0][0].transcript;
  //diagnostic.textContent = 'Result received: ' + color + '.';
  //bg.style.backgroundColor = color;
  //console.log('Confidence: ' + event.results[0][0].confidence);
//}

//recognition.onspeechend = function() {
  //recognition.stop();
//}

//recognition.onnomatch = function(event) {
 // diagnostic.textContent = "I didn't recognise that color.";/
//}

//recognition.onerror = function(event) {
  //diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
//}


