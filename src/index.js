import { 
  Mesh, 
  RingGeometry, 
  PlaneGeometry,
  Group, 
  Euler, 
  Clock, 
  Matrix4, 
  Vector3, 
  Vector2, 
  MeshStandardMaterial, 
  MeshBasicMaterial,
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera, 
  ACESFilmicToneMapping, 
  sRGBEncoding, 
  Color, 
  DoubleSide, 
  CylinderBufferGeometry, 
  BoxBufferGeometry, 
  PMREMGenerator 
} from "https://cdn.skypack.dev/three@0.137";
import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";

let x=0.2;
let y=0.01;

let scene = new Scene();
///scene.background = new Color("white");
scene.background = new Color(0,0,0);
let camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0,0,10);
camera.position.z = 10;

let renderer = new WebGLRenderer({ antialias: true });
renderer.setSize( innerWidth, innerHeight );
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding; 
document.body.appendChild(renderer.domElement);

let pmrem = new PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();

//DE ADENTRO HACIA AFUERA
let ring1, ring2, ring3, ring4, ring5, ring6;
let mousePos = new Vector2(0,0);

(async function init() {
  let envHdrTexture = await new RGBELoader().loadAsync("./assets/cannon_1k_blurred.hdr");
  let envRT = pmrem.fromEquirectangular(envHdrTexture);
   let clock = new Clock();
  clock.start();

  //CustomRing(TEXTURA, GROSOR, COLOR;
  ring1 = CustomRing(envRT, 0.65, new Color(0, 0, 1));
  ring1.scale.set(0.5, 0.5);
  scene.add(ring1);

  ring2 = CustomRing(envRT, 0.35, new Color(0, 0, 0.7));
  ring2.scale.set(1.05, 1.05);
  scene.add(ring2);

  ring3 = CustomRing(envRT, 0.15, new Color(0, 0.7, 0));
  ring3.scale.set(1.3, 1.3);
  scene.add(ring3);

  //PREVIOUS RING THICK+PREVOUS RING SCALE= NEXT RING SCALE

  ring4 = CustomRing(envRT, 0.2, new Color(0, 1, 0));
  //SCALE(RADIO_ANCHO,RADIO_ALTO)
  //ring4.scale.set(0.1, 0.1);
  ring4.scale.set(1.5, 1.5);
  scene.add(ring4);
  //ring4.matrix4.set(m);


  ring5 = CustomRing(envRT, 0.65, new Color(0.7, 0, 0));
  ring5.scale.set(0.75, 0.75);
  scene.add(ring5);

  ring6 = CustomRing(envRT, 0.65, new Color(1, 0, 0));
  ring6.scale.set(0.75, 0.75);
  scene.add(ring6);

  setupSound();
  //RENDERIZADO
  renderer.setAnimationLoop(() => {


    ring1.rotation.x = ring1.rotation.x * 0.95 + mousePos.y * 0.05 * 1.2;
    ring1.rotation.y = ring1.rotation.y * 0.95 + mousePos.x * 0.05 * 1.2;

    ring2.rotation.x = ring2.rotation.x * 0.95 + mousePos.y * 0.05 * 0.375;
    ring2.rotation.y = ring2.rotation.y * 0.95 + mousePos.x * 0.05 * 0.375;

    ring3.rotation.x = ring3.rotation.x * 0.95 - mousePos.y * 0.05 * 0.275;
    ring3.rotation.y = ring3.rotation.y * 0.95 - mousePos.x * 0.05 * 0.275;


    let date = new Date();

    let hourAngle = date.getHours() / 12 * Math.PI * 2;
    //rotateLine(hourLine, hourAngle, ring1.rotation, 1.0, 0);

    let minutesAngle = date.getMinutes() / 60 * Math.PI * 2;
    //rotateLine(minutesLine, minutesAngle, ring1.rotation, 0.8, 0.1);

    let secondsAngle = (date.getSeconds() + date.getMilliseconds() / 1000) / 60 * Math.PI * 2;
    //rotateLine(secondsLine, secondsAngle, ring1.rotation, 0.75, -0.1);

    //cLines.children.forEach((c, i) => {
      //rotateLine(c, i / 12 * Math.PI * 2, ring1.rotation, 1.72, 0.2)
    //});

    renderer.render(scene, camera);
  });


  loadSound("../assets/sample1.mp3");


})();

window.addEventListener("mousemove", (e) => {
  let x = e.clientX - innerWidth * 0.5; 
  let y = e.clientY - innerHeight * 0.5;

  mousePos.x = x * 0.001;
  mousePos.y = y * 0.001;
});

function rotateLine(line, angle, ringRotation, topTranslation, depthTranslation) {
  let tmatrix  = new Matrix4().makeTranslation(0, topTranslation, depthTranslation);
  let rmatrix  = new Matrix4().makeRotationAxis(new Vector3(0, 0, 1), -angle);
  let r1matrix = new Matrix4().makeRotationFromEuler(new Euler().copy(ringRotation));

  line.matrix.copy(new Matrix4().multiply(r1matrix).multiply(rmatrix).multiply(tmatrix));
  line.matrixAutoUpdate = false;
  line.matrixWorldNeedsUpdate = false;
}



function CustomRing(envRT, thickness, color) {
  let ring = new Mesh(
    new RingGeometry(2, 2 + thickness, 70, 1, 0, Math.PI * 2), 
    new MeshStandardMaterial({ envMap: envRT.texture, roughness: 0, metalness: 1, side: DoubleSide, color, envMapIntensity: 1 })
  );
  ring.position.set(0,0, 0.25*0.5);

  let outerCylinder = new Mesh(
    new CylinderBufferGeometry(2 + thickness, 2 + thickness, 0.25, 70, 1, true), 
    new MeshStandardMaterial({ envMap: envRT.texture, roughness: 0, metalness: 1, side: DoubleSide, color, envMapIntensity: 1 })
  );
  outerCylinder.rotation.x = Math.PI * 0.5;

  let innerCylinder = new Mesh(
    new CylinderBufferGeometry(2, 2, 0.25, 140, 1, true), 
    new MeshStandardMaterial({ envMap: envRT.texture, roughness: 0, metalness: 1, side: DoubleSide, color, envMapIntensity: 1 })
  );
  innerCylinder.rotation.x = Math.PI * 0.5;

  let group = new Group();
  group.add(ring, outerCylinder, innerCylinder);

  //ACTUALIZAR GROSOR
  group.updateThickness = function(newThickness) {
    thickness = newThickness;
    //console.log("MEJORAR GROSOR: "+newThickness);
    // Actualizar la geometría y posición de los anillos
    ring.geometry.dispose();
    ring.geometry = new RingGeometry(2, 2 + thickness, 70, 1, 0, Math.PI * 2);
    outerCylinder.geometry.dispose();
    outerCylinder.geometry = new CylinderBufferGeometry(2 + thickness, 2 + thickness, 0.25, 70, 1, true);

    // Ajustar la posición si es necesario
    ring.position.set(0, 0, 0.25 * 0.5);
  };

  group.getThick=function(){    
    return  thickness;
  };

  return group;
}



function Line(height, width, depth, envRT, color, envMapIntensity) {
  let box = new Mesh(
    new BoxBufferGeometry(width, height, depth),
    new MeshStandardMaterial({ envMap: envRT.texture, roughness: 0, metalness: 1, side: DoubleSide, color, envMapIntensity })
  );
  box.position.set(0, 0, 0);

  let topCap = new Mesh(
    new CylinderBufferGeometry(width * 0.5, width * 0.5, depth, 10),
    new MeshStandardMaterial({ envMap: envRT.texture, roughness: 0, metalness: 1, side: DoubleSide, color, envMapIntensity })
  );
  topCap.rotation.x = Math.PI * 0.5;
  topCap.position.set(0, +height * 0.5, 0);

  let bottomCap = new Mesh(
    new CylinderBufferGeometry(width * 0.5, width * 0.5, depth, 10),
    new MeshStandardMaterial({ envMap: envRT.texture, roughness: 0, metalness: 1, side: DoubleSide, color, envMapIntensity })
  );
  bottomCap.rotation.x = Math.PI * 0.5;
  bottomCap.position.set(0, -height * 0.5, 0);

  let group = new Group();
  group.add(box, topCap, bottomCap);

  return group;
}


function clockLines(envRT) {
  let group = new Group();
  
  for(let i = 0; i < 12; i++) {
    let line = Line(0.1, 0.075, 0.025, envRT, new Color(0.65, 0.65, 0.65), 1);
    group.add(line);
  }

  return group;
}


function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// calls the init function when the window is done loading.
//window.onload = init;
// calls the handleResize function when the window is resized
//window.addEventListener('resize', handleResize, false);



///SONIDO

    var context;
    var sourceNode;
    var analyser;
    var analyser2;
    var javascriptNode;
  var b_setup=false;


function setupSound() {
        if (! window.AudioContext) {
            if (! window.webkitAudioContext) {
                alert('no audiocontext found');
            }
            window.AudioContext = window.webkitAudioContext;
        }
        context = new AudioContext();
/*
        // setup a analyzer
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.4;
        analyser.fftSize = 1024;

        analyser2 = context.createAnalyser();
        analyser2.smoothingTimeConstant = 0.4;
        analyser2.fftSize = 1024;

        // create a buffer source node
        sourceNode = context.createBufferSource();
        var splitter = context.createChannelSplitter();

        // connect the source to the analyser and the splitter
        sourceNode.connect(splitter);

        // connect one of the outputs from the splitter to
        // the analyser
        splitter.connect(analyser,0);
        splitter.connect(analyser2,1);

        // and connect to destination
        sourceNode.connect(context.destination);

        context = new AudioContext();
    b_setup=true;

    */


        // setup a javascript node
    javascriptNode = context.createScriptProcessor(1024, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);
    javascriptNode.onaudioprocess = function() {

        // get the average for the first channel
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);

        var lowValue = getAverageVolume(array,0,150);
        var lowValue2=getAverageVolume(array,151,300);
        var midValue = getAverageVolume(array,301,450);
        var midValue2 = getAverageVolume(array,451,600);
        var highValue = getAverageVolume(array,601,750);
        var highValue2 = getAverageVolume(array,751,1000);

        //var ps = scene.getObjectByName('ring3');
        //var geom = ps.geometry;


        var lowOffsets = []; var midOffsets = []; var highOffsets = [];
        var lowRings = 10; var midRings = 10; var highRings = 10;
        var midFrom = 12; var highFrom = 24;
        var lowVolumeDownScale = 35; var midVolumeDownScale = 35; var highVolumeDownScale = 35;
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                // render RINGS
              ring1.updateThickness(highValue/200);
              ring2.scale.set(ring1.getThick()+0.25,ring1.getThick()+0.25);
              ring2.updateThickness(highValue2/200);
              ring3.scale.set(ring2.getThick()+0.5,ring2.getThick()+0.5);
              ring3.updateThickness(midValue/200);
              ring4.scale.set(ring3.getThick()+0.7,ring3.getThick()+0.7);
              ring4.updateThickness(midValue2/200);
              ring5.scale.set(ring4.getThick()+1,ring4.getThick()+1);
              ring5.updateThickness(lowValue/200);
              ring6.scale.set(ring5.getThick()+1.3,ring5.getThick()+1.3);
              ring6.updateThickness(lowValue2/200);


              //ring4.updateThickness(lowValue/100);
              //console.log(lowValue);

        }
        analyser = context.createAnalyser();
            analyser.smoothingTimeConstant = 0.1;
            analyser.fftSize = 2048;

            // create a buffer source node
            sourceNode = context.createBufferSource();
            var splitter = context.createChannelSplitter();

            // connect the source to the analyser and the splitter
            sourceNode.connect(splitter);

            // connect one of the outputs from the splitter to
            // the analyser
            splitter.connect(analyser,0,0);

            // connect the splitter to the javascriptnode
            // we use the javascript node to draw at a
            // specific interval.
            analyser.connect(javascriptNode);

            // and connect to destination
            sourceNode.connect(context.destination);

    }


    function getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
    }

    function playSound(buffer) {
        sourceNode.buffer = buffer;
        sourceNode.start(0);
    }

    // load the specified sound
    function loadSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = function() {

            // decode the data
            context.decodeAudioData(request.response, function(buffer) {
                // when the audio is decoded play the sound
                playSound(buffer);
            }, onError);
        }
        request.send();
    }

    function onError(e) {
        console.log(e);
    }



