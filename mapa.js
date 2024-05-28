const config = {
  // Configuración del juego
  type: Phaser.AUTO,
  width: 650,
  height: 530,
  parent: 'game-container',
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
      // Funciones principales del juego
      preload: preload,
      create: create,
      update: update
  },
  backgroundColor: '#FFFCF7',
};

// Variable para almacenar la imagen actual
let currentImage = "";

window.onload = function () {
  // Crear el juego con la configuración dada
  game = new Phaser.Game(config);
  // Agregar evento de redimensionamiento de ventana
  // window.addEventListener("resize", resize, false);
}

// Precargar los recursos del juego
function preload() {
  console.log('Cargando recursos...');
  // Cargar las imágenes necesarias
  this.load.image('map', 'Images/MapaGeneral.png');
  this.load.image('targetImage', 'Images/Troya-Aulide.jpg');
  this.load.image('crimea', 'Images/mapa5.png');
  this.load.image('troya', 'Images/mapa4.png');
  this.load.image('aulide', 'Images/mapa3.png');
}

function create() {
  // Crear la imagen inicial
  const map = this.add.image(325, 265, 'map');
  currentImage = 'map';
  map.setInteractive();

  // Crear área clickable para cambiar de imagen
  const clickableArea = this.add.zone(200, 400, 350, 220).setInteractive();
  clickableArea.on('pointerdown', function () {
      if (currentImage == 'map'){
        map.destroy();
        zoomToImage.call(this, 'targetImage', 1);
        update();
      }
  }, this);
  clickableArea.on('pointermove', function (pointer) {
    if (currentImage == 'map') showPopup(pointer.x, pointer.y,'', 'Troya y Aulide: Click para ver más...');
  });
  clickableArea.on('pointerout', function () {
      hidePopup();
  });

  // Crear área clickable para cambiar a Crimea
  const crimea = this.add.zone(560, 70, 180, 120).setInteractive();
  crimea.on('pointermove', function (pointer) {
      if (currentImage == 'map') showPopup(pointer.x, pointer.y,'', 'Crimea: Click para ver más...');
  });
  crimea.on('pointerdown', function () {
        if (currentImage == 'map') {
          map.destroy();
          zoomToImage.call(this, 'crimea', 1.2);
        }
    }, this);
  crimea.on('pointerout', function () { 
      hidePopup();
  } );

  // Función para reiniciar el juego
  function reset() {
      console.log('Reiniciando el juego...');
      // Ocultar el iframe
      const iframe = document.getElementById('map-iframe');
      iframe.src = "";
      iframe.style.display = 'none';
      this.scene.restart();
  }
  // Asociar la función de reinicio al botón de reset
  document.getElementById('button').addEventListener('click', reset.bind(this));

  // Evento para mover el mapa con el ratón
  this.input.on('pointermove', function (pointer) {
      if (pointer.isDown) {
          clickableArea.x += (pointer.x - pointer.prevPosition.x) * 0.5;
          clickableArea.y += (pointer.y - pointer.prevPosition.y) * 0.5;
          map.x += (pointer.x - pointer.prevPosition.x) * 0.5;
          map.y += (pointer.y - pointer.prevPosition.y) * 0.5;
      }
  });

  // Evento para hacer zoom con la rueda del ratón
  this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
      map.scaleX += deltaY * -0.001;
      map.scaleY += deltaY * -0.001;
      map.scaleX = Phaser.Math.Clamp(map.scaleX, 0.5, 2);
      map.scaleY = Phaser.Math.Clamp(map.scaleY, 0.5, 2);
  });

  // Eventos para cambiar la imagen mostrada
  document.getElementById('button2').addEventListener('click', actualidad.bind(this));
  document.getElementById('button3').addEventListener('click', atras.bind(this));
  this.zoomToImage = zoomToImage.bind(this);

  // Función para retroceder a la imagen anterior
  function atras(){
    if(currentImage == 'troya' || currentImage == 'aulide'){
      this.zoomToImage('targetImage', 1);
    }
    else if(currentImage == 'targetImage' || currentImage == 'crimea'){
      this.zoomToImage('map', 1);
    }
  }

  // Mostrar información sobre Crimea al pasar el cursor
  var crimea_info = this.add.zone(200, 100, 200, 200).setInteractive();
  crimea_info.on('pointerover', function (pointer) {
      if (currentImage == 'crimea')
      showPopup(pointer.x, pointer.y, 'Crimea:', 'Es una península ubicada en la costa septentrional del mar Negro. Actualmente, es un territorio disputado entre Rusia y Ucrania, controlado por Rusia pero reconocido por la comunidad internacional como parte de Ucrania. Los griegos la conocían como Táurica.');
  });

  // Mostrar información sobre Quersoneso al pasar el cursor
  var quesono_info = this.add.zone(200, 480, 100, 100).setInteractive();
  quesono_info.on('pointerover', function (pointer) {
      if (currentImage == 'crimea')
      showPopup(pointer.x, pointer.y, 'Quersoneso:', 'En 2013, la UNESCO incluyó a Quersoneso como Patrimonio de la Humanidad. Quersoneso fue una antigua colonia griega establecida en el siglo VI a.C. por colonos de Heraclea Póntica. En la ciudad destacaba el santuario a una divinidad llamada Pártenos, identificada por los griegos con Artemisa o Ifigenia, a la que los tauricos ofrecían sacrificios humanos.');
  });

  // Mostrar información sobre Troya al pasar el cursor
  var troya_info = this.add.zone(450, 90, 100, 100).setInteractive();
  troya_info.on('pointerover', function (pointer) {
      if (currentImage == 'troya')
      showPopup(pointer.x, pointer.y, 'Troya:', 'Troya es una ciudad legendaria situada en la costa de Turquía. Es famosa por la guerra que tuvo lugar en sus murallas, descrita por Homero en la Ilíada.Estuvo habitada desde principios del tercer milenio a. C y según la mitología griega, la familia real troyana fue iniciada por la pléyade Electra y Zeus, padres de Dárdano.');
  });

  // Mostrar información sobre Áulide al pasar el cursor
  var aulide_info = this.add.zone(400, 300, 100, 100).setInteractive();
  aulide_info.on('pointerover', function (pointer) {
      if (currentImage == 'aulide')
      showPopup(pointer.x, pointer.y, 'Áulide:', 'Según la Ilíada, fue el lugar de donde partieron los griegos hacia Troya. Según Esquilo y Eurípides, Agamenón sacrificó allí a su hija Ifigenia para obtener vientos favorables. El rey de Esparta, Agesilao II, también realizó sacrificios en Áulide antes de su expedición a Jonia en el 397 a.C.Perteneció a Tebas hasta el 387 a.C. y luego a Tanagra, destacándose por la pesca, la producción de cerámica y el santuario de Artemisa Aulideia.');
  });

  // Función para mostrar información actual sobre el mapa
  function actualidad(){
    map.destroy();
    if(this.targetImage) this.targetImage.destroy();
    const iframe = document.getElementById('map-iframe');
    if(currentImage == 'troya')
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d764254.854265371!2d25.678123415330607!3d39.983092782303906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b047a28835b0ab%3A0x40b6d45bd97e955!2sProvincia%20de%20%C3%87anakkale%2C%20Turqu%C3%ADa!5e0!3m2!1ses!2sco!4v1716828269566!5m2!1ses!2sco";
    if(currentImage == 'targetImage')
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3185918.985596522!2d22.8368181516815!3d38.75799235930602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14959c66749e1ba9%3A0x89058c37001751b2!2sMar%20Egeo!5e0!3m2!1ses!2sco!4v1716842257653!5m2!1ses!2sco";
    if(currentImage == 'crimea')
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1436830.6173092613!2d33.24367376892791!3d45.30216721387174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40eac2a37171b3f7%3A0x2a6f09e02affbaeb!2spen%C3%ADnsula%20de%20Crimea!5e0!3m2!1ses!2sco!4v1716842413140!5m2!1ses!2sco";
    if(currentImage == 'aulide')
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49703.29942856675!2d23.5888067808606!3d38.40366678663849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a11a415849424d%3A0x400bd2ce2b985d0!2s%C3%81ulide%20341%2000%2C%20Grecia!5e0!3m2!1ses!2sco!4v1716842705662!5m2!1ses!2sco";
    if(currentImage == 'map')
      iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12767866.655991796!2d24.519825842207418!3d38.622316395892256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b0155c964f2671%3A0x40d9dbd42a625f2a!2zVHVycXXDrWE!5e0!3m2!1ses!2sco!4v1716842925072!5m2!1ses!2sco"
    iframe.style.display = 'block';
  }
}

// Función para actualizar el juego
function update() {
  if (currentImage == 'targetImage'){
    // Agregar zonas interactivas y mostrar información adicional
    var Mar_e = this.add.zone(430, 240, 150, 150).setInteractive();
    var Troya = this.add.zone(540, 240, 100, 100).setInteractive();
    // Mostrar información al pasar el cursor
    Mar_e.on('pointerover', function (pointer) {
        if (currentImage == 'targetImage')
        showPopup(pointer.x, pointer.y, 'El mar Egeo:', 'El Egeo es el mar de la guerra de Troya, de micenas, de griegos y romanos, y el mar donde chocaron la cultura oriental y occidental y acabaron mezclándose');
    });
    Troya.on('pointerover', function (pointer) {
        if (currentImage == 'targetImage')
        showPopup(pointer.x, pointer.y, 'Troya', 'Click para ver más...');
    });
    Troya.on('pointerdown', function () {
        if (currentImage == 'targetImage')
       zoomToImage.call(this, 'troya', 1.2);
    }, this);
    // Otros elementos interactivos y su información
    var Aulide = this.add.zone(290, 375, 80, 80).setInteractive();
    // Mostrar información al pasar el cursor
    Aulide.on('pointerover', function (pointer) { 
         if (currentImage == 'targetImage')    
        showPopup(pointer.x, pointer.y, 'Aulide', 'Click para ver más...');
    });
    Aulide.on('pointerdown', function () {
        if (currentImage == 'targetImage'){
          zoomToImage.call(this, 'aulide', 1.2);
        }
    }, this);
    // Otros elementos interactivos y su información
    var Atenas = this.add.zone(340, 410, 100, 100).setInteractive();
    Atenas.on('pointerover', function (pointer) {
        if (currentImage == 'targetImage')
        showPopup(pointer.x, pointer.y, 'Atenas', 'Atenas es la capital de Grecia y una de las ciudades más antiguas del mundo. Es famosa por su historia, su cultura y su democracia.');
    }); 
    var Olimpias = this.add.zone(150, 430, 100, 100).setInteractive();
    Olimpias.on('pointerover', function (pointer) {
        if (currentImage == 'targetImage')
        showPopup(pointer.x, pointer.y, 'Olimpia', 'Olimpia es un lugar de culto a Zeus, donde se celebraban los juegos olímpicos en su honor.');
    });
  }
}

// Función para mostrar un popup con información
function showPopup(x, y, title, text, time) {
  let popup = document.querySelector('.popup');
  if (!popup) {
      popup = document.createElement('div');
      popup.classList.add('popup');
      document.body.appendChild(popup);
  }

  let popupTitle = document.querySelector('.popup-title');
  if (!popupTitle) {
      popupTitle = document.createElement('div');
      popupTitle.classList.add('popup-title');
      popup.appendChild(popupTitle);
  }

  let popupText = document.querySelector('.popup-text');
  if (!popupText) {
      popupText = document.createElement('div');
      popupText.classList.add('popup-text');
      popup.appendChild(popupText);
  }

  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  popupTitle.textContent = title;
  popupText.textContent = text;
  popup.style.display = 'block';

  //setTimeout(() => popup.style.display = 'none', time || 2000);
}

// Función para ocultar el popup
function hidePopup() {
  let popup = document.querySelector('.popup');
  if (popup) {
      popup.style.display = 'none';
  }
}

// Función para hacer zoom a una imagen
function zoomToImage(imageKey, scale) {
  currentImage = imageKey;
  if (this.targetImage) {
      this.targetImage.destroy();
  }
  this.targetImage = this.add.image(325, 265, imageKey).setScale(scale);
  hidePopup();
}
