
//****************************** */ Declaration du canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 1700;
canvas.height = 1000;

//****************************** */ Declaration des liens pour récupérer les images
let imageBombeHarkonnen = document.getElementById("bombeHarkonnen");
let imageBombeSardaukar = document.getElementById("bombeSardaukar");
let imageBombeHarkonnenVehicule = document.getElementById("bombeHarkonnenVehicule");

//****************************** */ Declaration du niveau
let lvl = 6;

let backupSardaukar = 0;
//****************************** */ Gestion animation frame

let seconds = 0;
let tick = 0;
let blockFrame = false;

//****************************** */ Declaration des array
const keys = [];

const particles = []; // Pour les éclats

const bombeDrawnAllTimeHarko = []; // Array que l'on rempli toutes les 10 secondes et qui dessine les bombes encore présentes

const bombeDrawnAllTimeSardau = [];

const bombeDrawnAllTimeHarkoVehicule = [];

const tabXSardaukar = [];

//****************************** */ Declaration des class
class Protagonniste {
  constructor(x, y, width, height, velocity, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.color = color;
    this.type = type;
    this.randomInitialDirection = Math.random() * 1;
  }

  draw() {
    ctx.fillStyle = this.color; // Attribution d'une couleur
    ctx.fillRect(this.x, this.y, this.width, this.height); // Création de la shape du harkonnen avec position initiale random
  }

  

  move() {
      //Math.abs nous permet deffectuer une différence qui nous indique si nous sommes sur la meme ligne ou non
    if(this.type === 'sardaukar' && Math.abs(this.y - objGeneral.feetPosition) > 1){
        // tant qu'on a pas atteri sur le sable et qu'on est un sardaukar sinon on fait comme d'hab sur le sable
        // console.log('type ' + this);
        this.y += this.velocity;
        
        
    } else if(this.type === 'vaisseauxSardaukar'){
        this.x -= this.velocity; // Si c'est le vaisseaux on veut seulement qu'il traverse l'écran
    }
    else {        
        this.randomInitialDirection < 0.5
          ? (this.x -= this.velocity)
          : (this.x += this.velocity); // On choisi un direction initial au hasard vers -x ou +x
      

        if (this.x + this.width > canvas.width || this.x - this.width < 0) {
        this.velocity = -this.velocity;
        }
    }
    

  }
}

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }

  drawNormal() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color; // Attribution d'une couleur
    ctx.fill();
  }

  move() {
    this.drawNormal();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class ParticleFading {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
    this.alpha = 1; //Permet aux particules de disparaitre
  }

  drawNormal() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color; // Attribution d'une couleur
    ctx.fill();
  }

  drawFading() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color; // Attribution d'une couleur
    ctx.fill();
    ctx.restore();
  }

  move() {
    this.drawFading();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.003;
  }
}

class Bombe {
  constructor(x, width, height, color, type, source) {
    this.x = x;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.source = source;
  }

  draw() {
    ctx.drawImage(this.source, this.x, 485, this.width, this.height); //insérer une image a x, y, largeur, longueur
  }
}

class BombeVehicule {
  constructor(x, y, width, height, color, type, source, velocity) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.source = source;
    this.velocity = velocity;
    this.angle = 0;
  }

  draw() {
    ctx.drawImage(this.source, this.x, this.y, this.width, this.height); //insérer une image a x, y, largeur, longueur
    //ctx.rotate(this.angle * Math.PI);
  }

  move() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    //this.angle += 0.1;
    if (this.x + this.width > canvas.width || this.x - this.width < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (
      this.y + this.height > canvas.height ||
      this.y - this.height < canvas.height / 2
    ) {
      this.velocity.y = -this.velocity.y;
    }
  }
}

//****************************** */ Declaration des objets caractérisant le jeu

const objBombeStyle = {
  bombeHarkonnenWidth: 40,
  bombeHarkonnenHeight: 25,
  bombeHarkonnenColor: "#dc2f02", // rouge mais serait cool de rajouter plusieurs couleur lors de l'explosion
  bbHarkonnenSource: imageBombeHarkonnen,
  bombeSardaukarWidth: 40,
  bombeSardaukarHeight: 25,
  bombeSardaukarColor: "#168aad", // rouge mais serait cool de rajouter plusieurs couleur lors de l'explosion
  bombeSardaukarSource: imageBombeSardaukar,
  bombeHarkonnenVehiculeWidth: 50,
  bombeHarkonnenVehiculeHeight: 50,
  bombeHarkonnenVehiculeColor: "#3FF3FF", // bleu électrique mais serait cool de rajouter plusieurs couleur lors de l'explosion
  bbHarkonnenVehiculeSource: imageBombeHarkonnenVehicule,
  bbHarkonnenVehiculeSpeedMin: 0.4,
  bbHarkonnenVehiculeSpeedMax: 0.6,
};

// limite de soldat sur le terrain pour pas que ca soit trop le bordel
const limitationEcran = {
  sardaukarMax: 20,
  harkonnenMax: 30,
  vehiculeHarkonnenMax: 2,
  usineMax: 1,
  bombeHarkonnenMax: 10,
  bombeSardaukarMax: 5,
  bombeVehiculeHarkonnenMax: 4,
};

// Permet d'incrementer au fur et a mesure pour ajouter à l'html
const stateBattle = {
  sardaukarMort: 0,
  harkonnenMort: 0,
  usineMort: 0,
  vehiculeHarkonnenMort: 0,
  bombeHarkonnenOnField: 0,
  bombeSardaukarField: 0,
  bombeVehiculeHarkonnenOnField: 0,
};

const pv = {
  harkonnenEat: 0.5,
  sardaukarEat: 1,
  fremFood: 3,
  harkonnenBombe: 5,
  sardaukarBombe: 8,
  vehiculeHarkonnenBombe: 3,
};

const shaiHulud = {
  x: 300,
  y: 700,
  radius: 50,
  color: "#ca6702",
  speed: 20,
  moving: false,
  pv: 100,
};

const vaisseaux = {
    vaisseauSardaukarWidth : 150,
    vaisseauSardaukarHeight : 50,
    vaisseauSardaukarColor : "#3FF3FF",
    vaisseauxSardaukarSpeed : 1
}

const harkonnen = {
    harkonnenHeight : 20,
    harkonnenWidth : 20
}

const sardaukar = {
    maxSpeedSardaukar : 0.6,
    minSpeedSardaukar : 0.5
}

const objGeneral = {
    sandLineMiddlePosition : canvas.height / 2,
    feetPosition :  canvas.height / 2 - harkonnen.harkonnenHeight
    

  /********** Decor ************/

  // Spécification Ecran
//   let sandLineMiddlePosition = canvas.height / 2;

  /********** Protagonniste ************/
/*
  // Harkonnen specification
  let harkonnenWidth = 20;
  let harkonnenHeight = 20;
  let harkonnenColor = "#ffb703"; //'#023047'; //'#ffb703' fake just for nice color
  let maxSpeedHarkonnen = 1;
  let minSpeedHarkonnen = 0.2;
  let feetPosition = sandLineMiddlePosition - harkonnenHeight;

  // Sardaukar specification
  let sardaukarWidth = 20;
  let sardaukarHeight = 20;
  let sardaukarColor = "#fb8500"; //'#fb8500' fake just for nice color // real '#f5f3f4'
  let maxSpeedSardaukar = 1.5;
  let minSpeedSardaukar = 0.5;
*/
  /********** Véhicules specification ************/
/*
  // Vaisseaux Sardaukars
  let vaisseauSardaukarWidth = 200;
  let vaisseauSardaukarHeight = 80;

  // Usine d'épices
  let usineWidth = 200;
  let usineHeight = 100;
  let usineBottom = sandLineMiddlePosition - usineHeight;
  let usineColor = "#7f4f24";
  let usineSpeed = 0.1;

  // Vehicule de Harkonnen
  let vehiculeHarkonnenWidth = 100;
  let vehiculeHarkonnenHeight = 40;
  let vehiculeHarkonnenBottom =
    sandLineMiddlePosition - vehiculeHarkonnenHeight;
  let vehiculeHarkonnenColor = "#219ebc";
  let vehiculeHarkonnenMaxSpeed = 2;
  let vehiculeHarkonnenMinSpeed = 1.5;
    */

}
//****************************** */ Declaration des constantes récupérant les objets ou array

let vaisseauxSardaukar = new Protagonniste( canvas.width, 10, vaisseaux.vaisseauSardaukarWidth, vaisseaux.vaisseauSardaukarHeight, vaisseaux.vaisseauxSardaukarSpeed, vaisseaux.vaisseauSardaukarColor, 'vaisseauxSardaukar');
//Contient le nombre de chaque troupe ou bombes par rapport au niveau indiqué
const objLvlState = lvlCharacteristicObject(lvl);

//Renvoie un objet d'array de chaque troupes et bombes par type
let objetArrayTroupes = createLvlProtagoniste(lvlCharacteristicObject(lvl));

// Array contenant tous les protagonnistes sur le terrain dans la limite de leur nombre maximale
let allOfProtagonistArray = protagonisteOnField();

let arraySardaukarParachute = objetArrayTroupes.sardaukars;
  

/************************ Ancienne fonction  ************************************* */

// let allOfProtagonistArray = bigArrayThingsToAnimate(createLvlProtagoniste(lvlCharacteristicObject(lvl)));
//
//fct big array (ci dessous APRES LES ...)
/*
function bigArrayThingsToAnimate(lvlProtagonisteArray) {
    const arrayAllSoldiersAndVehicule = [];
    let index = 0;
    // On parcours notre objet et on regarde si ses array sont vides ou remplis
    for (const array in lvlProtagonisteArray) {
      //Si l'array est vide on ne fait rien  sinon on l'ajoute au grand array
      if (lvlProtagonisteArray[array].length !== 0) {
        // Je parcours l'array harko, sardau, usines ...
        lvlProtagonisteArray[array].forEach((element) => {
          // J'ajoute au big array
          arrayAllSoldiersAndVehicule[index] = element;
          index++;
        });
      }
    }
  
    return arrayAllSoldiersAndVehicule;
  }
*/

/************************ Bonne fonction  ************************************* */

//****************************** */ Gestion du graphisme
function updateHTML() {
  const lvlID = document.getElementById("lvl");
  const harkonnenID = document.getElementById("harkonnenNb");
  const sardaukarID = document.getElementById("sardaukarNb");
  const harkonnenVehiculeID = document.getElementById("harkonnenVehicule");
  const usineID = document.getElementById("usine");

  lvlID.textContent = `${lvl}`;
  harkonnenID.firstChild.textContent = `${objLvlState.nbHarkonnen}`;
  harkonnenID.lastElementChild.textContent = `${stateBattle.harkonnenMort}`;

  if (stateBattle.sardaukarMort !== 0) {
    sardaukarID.innerHTML =
      " We estimate that <strong></strong> Sardaukars were parachuted but only <strong></strong> of them survived.";
    sardaukarID.firstChild.textContent = `${objLvlState.nbSardaukar}`;
    sardaukarID.lastElementChild.textContent = `${
      objLvlState.nbSardaukar - stateBattle.sardaukarMort
    }`;
  }

  if (stateBattle.usineMort !== 0) {
    usineID.innerHTML =
      "The destruction of <strong></strong> factory had a huge impact on Harkonnens troop, we estimate that they had to cut their troop budget by <strong>4</strong>%.";
    usineID.firstChild.textContent = `${stateBattle.usineMort}`;
    usineID.lastElementChild.textContent = "";
    usineID.lastElementChild.textContent = `${stateBattle.usineMort * 4}`;
  }

  if (stateBattle.vehiculeHarkonnenMort !== 0) {
    harkonnenVehiculeID.innerHTML =
      "Only <strong></strong> Harkonnnen's vehicule didn't blow up among the <strong></strong> initial.";
    harkonnenVehiculeID.firstChild.textContent = `${
      objLvlState.nbVehiculeHarkonnen - stateBattle.vehiculeHarkonnenMort
    }`;
    harkonnenVehiculeID.lastElementChild.textContent = `${objLvlState.nbVehiculeHarkonnen}`;
  }
}

// Ligne du sable
function sandLineDraw() {
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(1700, 500);
  ctx.strokeStyle = "#e9c46a";
  ctx.stroke();
}

//function pour dessiner le cercle au fur et à mesure
function drawSpriteHulud(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color; // Attribution d'une couleur
  ctx.fill();
}

//Fonction dessinnant tous les perso de l'array allOfProtagonist
function drawEnnemies() {
  // On parcours le grand array et on anime les protagonnistes un à un
  allOfProtagonistArray.forEach((enemy) => {
    enemy.draw();
    enemy.move();
  });
}

/*********************************** Initial ************************ */
function drawBombHarkonnen() {
    bombeDrawnAllTimeHarko.forEach((bombe) => {
      bombe.draw();
    });
  }

/***********************************Fonction modify by guillaume************************ */
// dessin bombe existante
/*
function drawBombHarkonnen() {
  if (blockFrame) return;
  // ctx.drawImage(image, 100, 30, 200, 140, 300, 300, 100, 70); //essai pour insérer une image marche pas
  // ctx.drawImage(imageBombeHarkonnen, x, 450, 40, 25); //insérer une image a x, y, largeur, longueur
  /*bombeDrawnAllTimeHarko.forEach((bombe) => {
    bombe.draw();
  });*/
//}
/***********************************Fonction modify by guillaume************************ */

function drawBombSardaukar() {
  bombeDrawnAllTimeSardau.forEach((bombe) => {
    bombe.draw();
  });
}

function drawBombHarkonnenVehicule() {
  bombeDrawnAllTimeHarkoVehicule.forEach((bombe) => {
    bombe.move();
  });
}

//****************************** */ A ranger :

//***** UTILISATION : A chaque niveau cette fonction est lancée et son objet est stocké puis assigné aux différentes valeurs  */
// Fonction permettant de donner les caractéristiques (nb enemis) en fonction du niveau
function lvlCharacteristicObject(lvl) {
  let nbHarkonnen = null;
  let nbSardaukar = null;
  let nbVehiculeHarkonnen = null;
  let nbUsine = null;
  let nbBombeHarkonnen = null;
  let nbBombeSardaukar = null;
  let nbBombeVehiculeHarkonnen = null;

  switch (true) {
    case lvl <= 5:
      nbHarkonnen = 10 * Number(`${lvl}`); // On augmente le nombre de Harkonnen par 10 à chaque tour
      nbSardaukar = 0;
      nbBombeHarkonnen = nbHarkonnen / 10; // ON ajoute des bombes en fonction du nombre de perso present
      break;

    case lvl <= 10:
      nbSardaukar = 10 * (Number(`${lvl}`) - 5) * 0.5; // On augmente le nombre de Sardaukar par 5 à chaque tour
      nbHarkonnen = 50;
      nbUsine = 1;
      nbBombeHarkonnen = nbHarkonnen / 10;
      nbBombeSardaukar = nbSardaukar / 5;
      break;

    case lvl <= 20:
      nbHarkonnen = 50 + 10 * (Number(`${lvl}`) - 10); // On augmente de 10, pour lvl20 => 150Harkonnens
      nbSardaukar = 30;
      nbVehiculeHarkonnen = 3;
      nbUsine = 3;
      nbBombeHarkonnen = nbHarkonnen / 10;
      nbBombeSardaukar = nbSardaukar / 5;
      nbBombeVehiculeHarkonnen = nbVehiculeHarkonnen;
      break;

    case lvl <= 100:
      nbHarkonnen = 150 + 10 * (Number(`${lvl}`) - 20); // Augmente de 10, lvl100 => 950 Harkonnens
      nbSardaukar = 30 + Number(`${lvl}` - 20) * 2; // Augmente de 2, lvl100 => 190 Harkonnens
      if (Number(lvl) % 3 === 0) {
        // On ajoute un véhicule tous les 3 tours
        nbVehiculeHarkonnen = 4 + (Number(`${lvl}`) - 20) / 3; // lvl98 => 30 véhicules
      } else {
        nbVehiculeHarkonnen = 3; // Permet à Shai Hulud de reprendre de la vie;
      }
      nbUsine = 3;
      nbBombeHarkonnen = nbHarkonnen / 10;
      nbBombeSardaukar = nbSardaukar / 5;
      nbBombeVehiculeHarkonnen = nbVehiculeHarkonnen;
      break;

    default:
      alert("Bug dans createInitialPosition ou lvl non spécifié");
      break;
  }

  let lvlState = {
    lvl: lvl,
    nbHarkonnen: nbHarkonnen,
    nbSardaukar: nbSardaukar,
    nbVehiculeHarkonnen: nbVehiculeHarkonnen,
    nbUsine: nbUsine,
    nbBombeVehiculeHarkonnen: nbBombeVehiculeHarkonnen,
    nbBombeSardaukar: nbBombeSardaukar,
    nbBombeHarkonnen: nbBombeHarkonnen,
  };

  return lvlState;
}

//Fonction permettant d'assigner une vitesse pour un perso entre ses vitesses maximale et minimale
function assignationVitesse(speedMax, speedMin) {
  return Math.random() * speedMax + speedMin;
}

/*****UTILISATION : Appel lvlCharacteristicObject pour définir les array contenant le nombre de protagoniste souhaité en fonction du niveau */
// return objet d'array

//NE PAS OUBLIER DE REMETTRE L4ANCIEN DANS MAIN

/***********Essai nouveau****** */

function createLvlProtagoniste(lvlCharacteristic) {
    const harkonnenLegion = [];
    const sardaukarLegion = [];
    const usineArray = [];
    const vehiculeHarkonnenArray = [];
    const bombeHarkonnenArray = [];
    const bombeSardaukarArray = [];
    const bombeVehiculeHarkonnenArray = [];
  
    let lvl = lvlCharacteristic.lvl;
  
    /**************Definition des caractéristiques des protagonistes****************/
  
    /********** Decor ************/
  
    // Spécification Ecran
    let sandLineMiddlePosition = canvas.height / 2;
  
    /********** Protagonniste ************/
  
    // Harkonnen specification
    let harkonnenWidth = 20;
    let harkonnenHeight = 20;
    let harkonnenColor = "#ffb703"; //'#023047'; //'#ffb703' fake just for nice color
    let maxSpeedHarkonnen = 1;
    let minSpeedHarkonnen = 0.2;
    let feetPosition = sandLineMiddlePosition - harkonnenHeight;
  
    // Sardaukar specification
    let sardaukarWidth = 20;
    let sardaukarHeight = 20;
    let sardaukarColor = "#fb8500"; //'#fb8500' fake just for nice color // real '#f5f3f4'
    let maxSpeedSardaukar = 0.6;
    let minSpeedSardaukar = 0.5;
  
    /********** Véhicules specification ************/
  
    // Vaisseaux Sardaukars
    let vaisseauSardaukarWidth = 200;
    let vaisseauSardaukarHeight = 80;
  
    // Usine d'épices
    let usineWidth = 200;
    let usineHeight = 100;
    let usineBottom = sandLineMiddlePosition - usineHeight;
    let usineColor = "#7f4f24";
    let usineSpeed = 0.1;
  
    // Vehicule de Harkonnen
    let vehiculeHarkonnenWidth = 100;
    let vehiculeHarkonnenHeight = 40;
    let vehiculeHarkonnenBottom =
      sandLineMiddlePosition - vehiculeHarkonnenHeight;
    let vehiculeHarkonnenColor = "#219ebc";
    let vehiculeHarkonnenMaxSpeed = 1.7;
    let vehiculeHarkonnenMinSpeed = 1.5;
  




    /**************** FIN Definition des caractéristiques des protagonistes***************/
  
    switch (true) {
      case lvl <= 5:
        // On a que des Harkonnens
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        break;
  
      case lvl <= 10:
        // On a Sardokar, Harkonnen, Usine
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        for (let i = 0; sardaukarLegion.length < lvlCharacteristic.nbSardaukar; i++) {
            
                let velocity = assignationVitesse(maxSpeedSardaukar, minSpeedSardaukar);          
                let  xInBetweenScreen = Math.floor(Math.random() * (xmax - xmin) + xmin);
                sardaukarLegion.push(
                  new Protagonniste(
                    xInBetweenScreen,
                    vaisseauxSardaukar.y,
                    sardaukarWidth,
                    sardaukarHeight,
                    velocity,
                    sardaukarColor,
                    "sardaukar"
                  )
                ); //Création d'un array qui contient notre legion de sardaukar                
            
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeSardaukar; i++) {
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeSardaukarWidth * 2) +
            objBombeStyle.bombeSardaukarWidth;
          bombeSardaukarArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeSardaukarWidth,
              objBombeStyle.bombeSardaukarHeight,
              objBombeStyle.bombeSardaukarColor,
              "bombeSardaukar",
              imageBombeSardaukar
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbUsine; i++) {
          let Xposition =
            Math.random() * (canvas.width - usineWidth * 2) + usineWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille de l'usine sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          usineArray.push(
            new Protagonniste(
              Xposition,
              usineBottom,
              usineWidth,
              usineHeight,
              usineSpeed,
              usineColor,
              "usine"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        break;
  
      case lvl <= 20:
        // On a Sardokar, Harkonnen, Usine
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbSardaukar; i++) {
          let velocity = assignationVitesse(maxSpeedSardaukar, minSpeedSardaukar);                 
          let  xInBetweenScreen = Math.floor(Math.random() * (xmax - xmin) + xmin);
          sardaukarLegion.push(
            new Protagonniste(
              xInBetweenScreen,
              vaisseauxSardaukar.y,
              sardaukarWidth,
              sardaukarHeight,
              velocity,
              sardaukarColor,
              "sardaukar"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeSardaukar; i++) {
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeSardaukarWidth * 2) +
            objBombeStyle.bombeSardaukarWidth;
          bombeSardaukarArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeSardaukarWidth,
              objBombeStyle.bombeSardaukarHeight,
              objBombeStyle.bombeSardaukarColor,
              "bombeSardaukar",
              imageBombeSardaukar
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbUsine; i++) {
          let Xposition =
            Math.random() * (canvas.width - usineWidth * 2) + usineWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille de l'usine sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          usineArray.push(
            new Protagonniste(
              Xposition,
              usineBottom,
              usineWidth,
              usineHeight,
              usineSpeed,
              usineColor,
              "usine"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbVehiculeHarkonnen; i++) {
          let velocity = assignationVitesse(
            vehiculeHarkonnenMaxSpeed,
            vehiculeHarkonnenMinSpeed
          );
          let Xposition =
            Math.random() * (canvas.width - vehiculeHarkonnenWidth * 2) +
            vehiculeHarkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          vehiculeHarkonnenArray.push(
            new Protagonniste(
              Xposition,
              vehiculeHarkonnenBottom,
              vehiculeHarkonnenWidth,
              vehiculeHarkonnenHeight,
              velocity,
              vehiculeHarkonnenColor,
              "vehiculeHarkonnen"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeVehiculeHarkonnen; i++) {
          //let velocity = assignationVitesse(objBombeStyle.bbHarkonnenVehiculeSpeedMax, objBombeStyle.bbHarkonnenVehiculeSpeedMin);
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeHarkonnenVehiculeWidth * 2) +
            objBombeStyle.bombeHarkonnenVehiculeWidth;
          bombeVehiculeHarkonnenArray.push(
            new BombeVehicule(
              Xposition,
              canvas.height / 2 + objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeWidth,
              objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeColor,
              "bombeHarkonnenVehicule",
              imageBombeHarkonnenVehicule,
              {
                x: Math.random() - 0.5,
                y: Math.random() - 0.5,
              }
            )
          );
        }
        break;
  
      case lvl <= 100:
        // On a Sardokar, Harkonnen, Usine
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbSardaukar; i++) {
          let velocity = assignationVitesse(maxSpeedSardaukar, minSpeedSardaukar);
          let xInBetweenScreen = Math.floor(Math.random() * (xmax - xmin) + xmin);
          sardaukarLegion.push(
            new Protagonniste(
              xInBetweenScreen,
              vaisseauxSardaukar.y,
              sardaukarWidth,
              sardaukarHeight,
              velocity,
              sardaukarColor,
              "sardaukar"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeSardaukar; i++) {
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeSardaukarWidth * 2) +
            objBombeStyle.bombeSardaukarWidth;
          bombeSardaukarArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeSardaukarWidth,
              objBombeStyle.bombeSardaukarHeight,
              objBombeStyle.bombeSardaukarColor,
              "bombeSardaukar",
              imageBombeSardaukar
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbUsine; i++) {
          let Xposition =
            Math.random() * (canvas.width - usineWidth * 2) + usineWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille de l'usine sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          usineArray.push(
            new Protagonniste(
              Xposition,
              usineBottom,
              usineWidth,
              usineHeight,
              usineSpeed,
              usineColor,
              "usine"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbVehiculeHarkonnen; i++) {
          let velocity = assignationVitesse(
            vehiculeHarkonnenMaxSpeed,
            vehiculeHarkonnenMinSpeed
          );
          let Xposition =
            Math.random() * (canvas.width - vehiculeHarkonnenWidth * 2) +
            vehiculeHarkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          vehiculeHarkonnenArray.push(
            new Protagonniste(
              Xposition,
              vehiculeHarkonnenBottom,
              vehiculeHarkonnenWidth,
              vehiculeHarkonnenHeight,
              velocity,
              vehiculeHarkonnenColor,
              "vehiculeHarkonnen"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeVehiculeHarkonnen; i++) {
          let velocity = assignationVitesse(
            objBombeStyle.bbHarkonnenVehiculeSpeedMax,
            objBombeStyle.bbHarkonnenVehiculeSpeedMin
          );
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeHarkonnenVehiculeWidth * 2) +
            objBombeStyle.bombeHarkonnenVehiculeWidth;
          bombeVehiculeHarkonnenArray.push(
            new BombeVehicule(
              Xposition,
              canvas.height / 2 + objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeWidth,
              objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeColor,
              "bombeHarkonnenVehicule",
              imageBombeHarkonnenVehicule,
              velocity
            )
          );
        }
        break;
  
      default:
        alert("Bug dans createLvlProtagoniste, deuxieme switch");
        break;
    }
  
    // console.log("harko");
  
    // console.log("Sardau");
    // console.log(bombeSardaukarArray);
    // console.log("Vehicule");
    // console.log(bombeVehiculeHarkonnenArray);
  
    let lvlProtagonisteArray = {
      usines: usineArray,
      vehiculeHarkonnens: vehiculeHarkonnenArray,
      harkonnens: harkonnenLegion,
      sardaukars: sardaukarLegion,
      bombeHarkonnen: bombeHarkonnenArray,
      bombeSardaukar: bombeSardaukarArray,
      bombeVehiculeHarkonnen: bombeVehiculeHarkonnenArray,
    };
    return lvlProtagonisteArray;
  }

/*********************** */

function assignationXrandomSardaukarArray() {
    // console.log('in');
    let nbMaxSardaukar = objLvlState.nbSardaukar;
    //Add de l'essai 
    let xmax = canvas.width - vaisseauxSardaukar.width;
    let xmin = vaisseauxSardaukar.width;
    if(nbMaxSardaukar != 0){
        // ON construit un tableau de position initial de sardaukar
        for (let i = 0; i < nbMaxSardaukar; i++) {
            tabXSardaukar[i] = Math.floor(Math.random() * (xmax - xmin) + xmin);            
        }
        // On trie dans l'ordre inverse du tableau car le vaisseau viendra de X max jusqua x min 
        tabXSardaukar.sort((a,b) => b - a);
    }
    
}
// assignationXrandomSardaukarArray();
// console.log();
// console.log(tabXSardaukar);

let goodposition = false;

// CAS 1 ****************************
if(objLvlState.nbSardaukar < limitationEcran.sardaukarMax){
    for(let i =0; i < objLvlState.nbSardaukar; i ++){
        let velocity = assignationVitesse(sardaukar.maxSpeedSardaukar, sardaukar.minSpeedSardaukar);
        let xInBetweenScreen = tabXSardaukar[i];
        if(vaisseauxSardaukar.x > -vaisseauxSardaukar.width){
            //On rentre uniquement si la distance entre la position de spawn du sardaukar dans le ciel (décidé avant xInbetween)
            //et la position du centre du vaisseau est inférieur à la largeur du vaisseaux on prend la valeur absolue pour ne pas avoir de probleme si le point de spawn est plus grand que la position de l'avion
            if(Math.abs(vaisseauxSardaukar.x + vaisseauxSardaukar.width/2 - xInBetweenScreen) < vaisseauxSardaukar.width/2){
                //On push le sardau dans l'array qui est dessinné constamment
                sardaukarLegion.push(
                    new Protagonniste(
                      xInBetweenScreen,
                      vaisseauxSardaukar.y,
                      sardaukarWidth,
                      sardaukarHeight,
                      velocity,
                      sardaukarColor,
                      "sardaukar"
                    )
                  );
                  
            }       
        } else if(backupSardaukar != stateBattle.sardaukarMort) {
            // on refait démarer le vaisseaux à droite du canvas pour la prochaine loop
            vaisseauxSardaukar.x = canvas.width;
        }
        
                  
    }
} 
a
drawNonStop();

/*
else if(objLvlState.nbSardaukar > limitationEcran.sardaukarMax ) {
    for (let i = 0; i < limitationEcran.sardaukarMax; i++) {
        let velocity = assignationVitesse(sardaukar.maxSpeedSardaukar, sardaukar.minSpeedSardaukar);
        let xInBetweenScreen = tabXSardaukar[0];
          sardaukarLegion.push(
            new Protagonniste(
              xInBetweenScreen,
              vaisseauxSardaukar.y,
              sardaukarWidth,
              sardaukarHeight,
              velocity,
              sardaukarColor,
              "sardaukar"
            )
          );
        tabXSardaukar.splice(0, 1);        
    }
}
*/
function drawNonStop(){
    if(sardaukarLegion.length !== 0){
            sardaukarLegion.forEach(element => {
            element.draw();
            element.move();
        })
    }    
}

function parachuteSardaukar() {    
// on vérifie qu'il y a des sardaukar dans ce niveau sinon inutile d'en parachuter et on vérifie que le nombre de mort à changer sinon ca signifie qu'ils ont pas besoin de backup parachuté
  if(stateBattle.sardaukarMort !== objLvlState.nbSardaukar && objLvlState.nbSardaukar !== 0){
      for (let i = 0; i < ; i++) {
          const element = array[i];
          
      }
    // On dessine notre vaisseaux passant le long de l'écran et on le dessine plus quand il a quitté le cadre
     // on compte le nombre de mort, si le nombre de mort est différent du tour d'avant, le vaisseaux passe le moins correspond à la position tout a gauche de l'écran
    if(vaisseauxSardaukar.x > -vaisseauxSardaukar.width){
        //On rentre uniquement si la distance entre la position de spawn du sardaukar dans le ciel (décidé avant xInbetween)
        //et la position du centre du vaisseau est inférieur à la largeur du vaisseaux on prend la valeur absolue pour ne pas avoir de probleme si le point de spawn est plus grand que la position de l'avion
        if(Math.abs(vaisseauxSardaukar.x + vaisseauxSardaukar.width/2 - sardaukar.x) < vaisseauxSardaukar.width/2){
            //On va donc maintenant pouvoir exécuter la fonction de déplacement du sardaukar
            goodposition = true;
        }
        //on regarde si il y a eu des morts sardaukar qui provoquerait alors une arrivée des backup en vaisseau
        backupSardaukar = stateBattle.sardaukarMort;        
    } else if(backupSardaukar != stateBattle.sardaukarMort) {
        // on refait démarer le vaisseaux à droite du canvas pour la prochaine loop
        vaisseauxSardaukar.x = canvas.width;
    }
    if(goodposition){
        //si on a exécuté la cdt précédente on peut dessinner le sardaukar pendant toute la descente
        test(sardaukar);
    }
    //on dessine le vaisseaux en dernier pour ne pas avoir le sardaukar qui passe devant
    vaisseauxSardaukar.draw();
    vaisseauxSardaukar.move();
  }
}




// Déplacement de Shai Hulud
window.addEventListener(
  "keydown",
  function (event) {
    if (event.key == "ArrowDown" && shaiHulud.y < canvas.height) {
      //event.key == "ArrowDown" && event.key == "ArrowLeft" ne marche pas trouver une solution
      shaiHulud.y += shaiHulud.speed; // c'est plus parce que l'origine du graph est en haut à gauche
    } else if (event.key == "ArrowUp" && shaiHulud.y > canvas.height / 2) {
      // Faire quelque chose pour la touche "up arrow" pressée.
      shaiHulud.y -= shaiHulud.speed;
    } else if (event.key == "ArrowLeft" && shaiHulud.x > 0) {
      // Faire quelque chose pour la touche "ArrowLeft" pressée.
      shaiHulud.x -= shaiHulud.speed;
    } else if (event.key == "ArrowRight" && shaiHulud.x < canvas.width) {
      // Faire quelque chose pour la touche "ArrowRight" pressée.
      shaiHulud.x += shaiHulud.speed;
    }

    event.preventDefault();

    //from here was removed the code keydown below (bottom of page)
  },
  true
);

// Cette fonction initialise seulement le premier tableau !!!
// Elle rempli un premier tableau à partir du nombre max de protagonniste sur l'écran
function protagonisteOnField() {
  const onField = [];
  const arrayHarko = objetArrayTroupes.harkonnens;
  const arraySardau = objetArrayTroupes.sardaukars;
  const arrayUsine = objetArrayTroupes.usines;
  const arrayVehiculeHarko = objetArrayTroupes.vehiculeHarkonnens;
  let indexFinHarkonnen;
  let indexFinSardaukar;
  let indexFinUsine;
  let indexFinVehiculeHarkonnen;

  if (arrayHarko.length !== 0) {
    //Si on est inférieur au nombre maximal de harkonnnen on ne peut pas remplir avec du vide
    if (arrayHarko.length < limitationEcran.harkonnenMax) {
      //On est dans le cas ou il n'y aura pas de sardaukar car lvl < 5
      return arrayHarko; //donc il n'y aura que des harkonnnens dans le tab
    } else {
      // On rempli le tableau avec le nombre de troupes max de harkonnen
      for (let i = 0; i < limitationEcran.harkonnenMax; i++) {
        onField[i] = arrayHarko[i]; //On associe à field de nouveau soldat jusqu'au nombre max
        // on conserve l'array final pour deux raisons, 1- On l'utilise dans le prochain for pour remplir au bon endroit, 2- (pas sur car on aura indexe du splice) On en aura besoin pour remettre de nouveau harkonnnen une fois que les autres seront morts
        indexFinHarkonnen = i;
      }
    }
  }
  indexFinSardaukar = indexFinHarkonnen;
/*
  if (arraySardau.length !== 0) {
    //Si on est inférieur au nombre maximal de harkonnnen on ne peut pas remplir avec du vide
    if (arraySardau.length < limitationEcran.sardaukarMax) {
      //On commence le for la où les harko on terminé
      for (let j = 0; j < arraySardau.length; j++) {
        onField[indexFinHarkonnen + 1 + j] = arraySardau[j];
        // pas besoin de retourner l'indexe car on a atteint la taille maximale
      }
    } else {
      //On commence le for la où les harko on terminé
      for (let j = 0; j < limitationEcran.sardaukarMax; j++) {
        onField[indexFinHarkonnen + 1 + j] = arraySardau[j];

        indexFinSardaukar = j + indexFinHarkonnen + 1;
      }
    }
  }
*/
  // ON a une seul usine au max donc on l'ajoute simplement
  if (arrayUsine.length !== 0) {
    onField[indexFinSardaukar + 1] = arrayUsine[0];
    indexFinUsine = indexFinSardaukar + 1; //on incremente de deux car +1 de position  d'usine et l'autre voir ce qu'il y au dessus
  }

  if (arrayVehiculeHarko.length !== 0) {
    if (arrayVehiculeHarko.length < limitationEcran.vehiculeHarkonnenMax) {
      for (let n = 0; n < arrayVehiculeHarko.length; n++) {
        onField[indexFinUsine + 1 + n] = arrayVehiculeHarko[n];
      }
    } else {
      //On commence le for la où les harko on terminé
      for (let n = 0; n < limitationEcran.vehiculeHarkonnenMax; n++) {
        onField[indexFinUsine + 1 + n] = arrayVehiculeHarko[n];
      }
    }
  }

  return onField;
}
let a = objLvlState.nbSardaukar - limitationEcran.sardaukarMax;
function distanceRemoveProtagonisteTouched() {
  allOfProtagonistArray.forEach((enemy, index) => {

    const distBetweenShaiHuludandEnemy = Math.hypot(
      shaiHulud.x - enemy.x,
      shaiHulud.y - enemy.y
    ); // On evalue la distance entre les deux objets
    // const distBetweenShaiHuludandEnemy = Math.hypot(shaiHulud.x - 5, shaiHulud.y - 5);
    // On enleve l'enemei seulement si shaiHulud arrive à la moitié de son rayon pour donner l'impression d'absorption et non pas de simple contact
    if (
      distBetweenShaiHuludandEnemy - shaiHulud.radius / 2 - enemy.width / 3 <
      1
    ) {
      // projection de particule quand on mange un mec
      for (let i = 0; i < enemy.width; i++) {
        // enemy.width = nb de particle à chaque pour un hit proportionnel à la taille de ce que l'on mange donc
        particles.push(
          new ParticleFading(enemy.x, enemy.y, 3, enemy.color, {
            x: Math.random() - 0.5,
            y: -Math.random(),
          })
        );
      }

      //setTimeout(() => {                                                      // Permet de se débarrasser de l'effet flash post enlevement (maybe not useful)
      allOfProtagonistArray.splice(index, 1); // Si on touche un enemi l'enleve de l'array regroupant tout le monde
      // On incremente le nombre de mort en fonction de l'enemi, on augmente les pvs de shai Hulud on enleve le mort de l'array de l'objet
      if (enemy.type === "harkonnen") {
        objetArrayTroupes.harkonnens.splice(0, 1); //On vire un harkonnen au hasard position 0 car ils ne sont pas visible sur l'écran
        if (
          objetArrayTroupes.harkonnens.length > limitationEcran.harkonnenMax
        ) {
          // on ajoute un nouveau harkonnnen suelement si on en a encore en stock dans l'array de l'objet (limite de 30)
          allOfProtagonistArray.push(objetArrayTroupes.harkonnens[0]);
          // allOfProtagonistArray.push( new Protagonniste(300, 300,20,20,1,'red','harkonnen'));
        }
        stateBattle.harkonnenMort++;
        if (shaiHulud.pv < 100) {
          shaiHulud.pv += pv.harkonnenEat;
        }
      } else if (enemy.type === "sardaukar") {
        objetArrayTroupes.sardaukars.splice(0, 1); //On vire un sardaukar au hasard position 0 car ils ne sont pas visible sur l'écran
        if (
          objetArrayTroupes.sardaukars.length > limitationEcran.sardaukarMax
        ) {
          allOfProtagonistArray.push(objetArrayTroupes.sardaukars[0]);
          // allOfProtagonistArray.push( new Protagonniste(400, 300,20,20,1,'green','sardaukar'));
        }
        stateBattle.sardaukarMort++;
        // Si la somme des points de vie de Shai Hulud + ceux qui vont être assigné sont inférieure au point de vie max on les ajoute sinon on remplit jusqua 100 on ne dépasse pas la limite
        shaiHulud.pv + pv.sardaukarEat < 100
          ? (shaiHulud.pv += pv.sardaukarEat)
          : (shaiHulud.pv = 100);
      } else if (enemy.type === "usine") {
        objetArrayTroupes.usines.splice(0, 1); //On vire un sardaukar au hasard position 0 car ils ne sont pas visible sur l'écran
        if (objetArrayTroupes.usines.length > limitationEcran.usineMax) {
          allOfProtagonistArray.push(objetArrayTroupes.usines[0]);
          // allOfProtagonistArray.push( new Protagonniste(400, 300,20,20,1,'green','sardaukar'));
        }
        stateBattle.usineMort++;
      } else if (enemy.type === "vehiculeHarkonnen") {
        objetArrayTroupes.vehiculeHarkonnens.splice(0, 1); //On vire un sardaukar au hasard position 0 car ils ne sont pas visible sur l'écran
        if (
          objetArrayTroupes.vehiculeHarkonnens.length >
          limitationEcran.vehiculeHarkonnenMax
        ) {
          allOfProtagonistArray.push(objetArrayTroupes.vehiculeHarkonnens[0]);
          // allOfProtagonistArray.push( new Protagonniste(400, 300,20,20,1,'green','sardaukar'));
        }
        stateBattle.vehiculeHarkonnenMort++;
      }
      //}, 0)
    }
  });
  arraySardaukarParachute.forEach((enemy, index) => {
    const distBetweenShaiHuludandEnemy = Math.hypot(
        shaiHulud.x - enemy.x,
        shaiHulud.y - enemy.y
      ); // On evalue la distance entre les deux objets
      // const distBetweenShaiHuludandEnemy = Math.hypot(shaiHulud.x - 5, shaiHulud.y - 5);
      // On enleve l'enemei seulement si shaiHulud arrive à la moitié de son rayon pour donner l'impression d'absorption et non pas de simple contact
      if (
        distBetweenShaiHuludandEnemy - shaiHulud.radius / 2 - enemy.width / 3 <
        1
      ) {
        // projection de particule quand on mange un mec
        for (let i = 0; i < enemy.width; i++) {
          // enemy.width = nb de particle à chaque pour un hit proportionnel à la taille de ce que l'on mange donc
          particles.push(
            new ParticleFading(enemy.x, enemy.y, 3, enemy.color, {
              x: Math.random() - 0.5,
              y: -Math.random(),
            })
          );
        }
  
        //setTimeout(() => {                                                      // Permet de se débarrasser de l'effet flash post enlevement (maybe not useful)
        arraySardaukarParachute.splice(index, 1); // Si on touche un enemi l'enleve de l'array regroupant tout le monde
        // On incremente le nombre de mort en fonction de l'enemi, on augmente les pvs de shai Hulud on enleve le mort de l'array de l'objet
        if (enemy.type === "sardaukar") {
          objetArrayTroupes.sardaukars.splice(0, 1); //On vire un sardaukar au hasard position 0 car ils ne sont pas visible sur l'écran
          if (objLvlState.nbSardaukar > limitationEcran.sardaukarMax && a !== 0) {
            arraySardaukarParachute.push(objetArrayTroupes.sardaukars[0]); // ne marche pas car c'est le meme que j'ai coupé avant la limite dans la creation
            a --;
            // allOfProtagonistArray.push( new Protagonniste(400, 300,20,20,1,'green','sardaukar'));
          }
          stateBattle.sardaukarMort++;
          // Si la somme des points de vie de Shai Hulud + ceux qui vont être assigné sont inférieure au point de vie max on les ajoute sinon on remplit jusqua 100 on ne dépasse pas la limite
          shaiHulud.pv + pv.sardaukarEat < 100
            ? (shaiHulud.pv += pv.sardaukarEat)
            : (shaiHulud.pv = 100);
        }
        //}, 0)
      }
  });
}

function distanceRemoveBombeTouched() {
  if (bombeDrawnAllTimeHarko.length !== 0) {
    bombeDrawnAllTimeHarko.forEach((bombe, index) => {
      const distBetweenShaiHuludandBombHarko = Math.hypot(
        shaiHulud.x - bombe.x,
        shaiHulud.y - 485
      );

      if (
        distBetweenShaiHuludandBombHarko - shaiHulud.radius - bombe.width / 2 <
        1
      ) {
        // projection de particule quand on mange une bombe
        for (let i = 0; i < bombe.width; i++) {
          // bombe.width = nb de particle à chaque pour un hit proportionnel à la taille de ce que l'on mange donc
          particles.push(
            new ParticleFading(bombe.x, 485, 3, bombe.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          );
        }
        shaiHulud.pv -= pv.harkonnenBombe; // on enleve de la vie a shai hulud lorsqu'il touche une bombe
        bombeDrawnAllTimeHarko.splice(index, 1);
        stateBattle.bombeHarkonnenOnField--; // On actualise le nombre de bombe présent sur le terrain
      }
    });
  }

  if (bombeDrawnAllTimeSardau.length !== 0) {
    bombeDrawnAllTimeSardau.forEach((bombe, index) => {
      const distBetweenShaiHuludandBombSardau = Math.hypot(
        shaiHulud.x - bombe.x,
        shaiHulud.y - 485
      );
      if (
        distBetweenShaiHuludandBombSardau - shaiHulud.radius - bombe.width / 2 <
        1
      ) {
        // projection de particule quand on mange une bombe
        for (let i = 0; i < bombe.width; i++) {
          // bombe.width = nb de particle à chaque pour un hit proportionnel à la taille de ce que l'on mange donc
          particles.push(
            new ParticleFading(bombe.x, 485, 3, bombe.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          );
        }
        shaiHulud.pv -= pv.sardaukarBombe; // on enleve de la vie a shai hulud lorsqu'il touche une bombe
        bombeDrawnAllTimeSardau.splice(index, 1);
        stateBattle.bombeSardaukarField--; // On actualise le nombre de bombe présent sur le terrain
      }
    });
  }
  if (bombeDrawnAllTimeHarkoVehicule.length !== 0) {
    bombeDrawnAllTimeHarkoVehicule.forEach((bombe, index) => {
      const distBetweenShaiHuludandBombHarkoVehicule = Math.hypot(
        shaiHulud.x - bombe.x,
        shaiHulud.y - bombe.y
      );
      if (
        distBetweenShaiHuludandBombHarkoVehicule -
          shaiHulud.radius -
          bombe.width / 2 <
        0.5
      ) {
        for (let i = 0; i < bombe.width; i++) {
          // bombe.width = nb de particle à chaque pour un hit proportionnel à la taille de ce que l'on mange donc
          particles.push(
            new ParticleFading(bombe.x, bombe.y, 3, bombe.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          );
        }
        shaiHulud.pv -= pv.vehiculeHarkonnenBombe; // on enleve de la vie a shai hulud lorsqu'il touche une bombe
        bombeDrawnAllTimeHarkoVehicule.splice(index, 1);
        stateBattle.bombeVehiculeHarkonnenOnField--; // On actualise le nombre de bombe présent sur le terrain
      }
    });
  }
}


/*********************************** Initial ************************ */

function fillRemoveBombeArray() {

  if (
    stateBattle.bombeHarkonnenOnField < limitationEcran.bombeHarkonnenMax &&
    objetArrayTroupes.bombeHarkonnen.length !== 0
  ) {
    // On entre dans la condition seulement si le nombre de bombe est inférieur au nombre max et si le big array n'est pas vide

    bombeDrawnAllTimeHarko.push(objetArrayTroupes.bombeHarkonnen[0]); //on ajoute la premiere bombe de l'array contenant toutes les bombes à l'array qui est dessiné
    objetArrayTroupes.bombeHarkonnen.splice(0, 1); // On enleve celle qu'on vient de prendre
    stateBattle.bombeHarkonnenOnField++;
  }
  if (
    stateBattle.bombeSardaukarField < limitationEcran.bombeSardaukarMax &&
    objetArrayTroupes.bombeSardaukar.length !== 0
  ) {
    // On entre dans la condition seulement si le nombre de bombe est inférieur au nombre max et si le big array n'est pas vide

    bombeDrawnAllTimeSardau.push(objetArrayTroupes.bombeSardaukar[0]); //on ajoute la premiere bombe de l'array contenant toutes les bombes à l'array qui est dessiné
    objetArrayTroupes.bombeSardaukar.splice(0, 1); // On enleve celle qu'on vient de prendre
    stateBattle.bombeSardaukarField++;
  }
  if (
    stateBattle.bombeVehiculeHarkonnenOnField <
      limitationEcran.bombeVehiculeHarkonnenMax &&
    objetArrayTroupes.bombeVehiculeHarkonnen.length !== 0
  ) {
    // On entre dans la condition seulement si le nombre de bombe est inférieur au nombre max et si le big array n'est pas vide

    bombeDrawnAllTimeHarkoVehicule.push(
      objetArrayTroupes.bombeVehiculeHarkonnen[0]
    ); //on ajoute la premiere bombe de l'array contenant toutes les bombes à l'array qui est dessiné
    objetArrayTroupes.bombeVehiculeHarkonnen.splice(0, 1); // On enleve celle qu'on vient de prendre
    stateBattle.bombeVehiculeHarkonnenOnField++;
  }

}

/***********************************Fonction modify by guillaume************************ */
/*
function fillRemoveBombeArray(callbackDraw, callbackEnd) {
    if (blockFrame === true) return console.log("rejected");
  
    if (
      stateBattle.bombeHarkonnenOnField < limitationEcran.bombeHarkonnenMax &&
      objetArrayTroupes.bombeHarkonnen.length !== 0
    ) {
      // On entre dans la condition seulement si le nombre de bombe est inférieur au nombre max et si le big array n'est pas vide
  
      bombeDrawnAllTimeHarko.push(objetArrayTroupes.bombeHarkonnen[0]); //on ajoute la premiere bombe de l'array contenant toutes les bombes à l'array qui est dessiné
      objetArrayTroupes.bombeHarkonnen.splice(0, 1); // On enleve celle qu'on vient de prendre
      stateBattle.bombeHarkonnenOnField++;
    }
    if (
      stateBattle.bombeSardaukarField < limitationEcran.bombeSardaukarMax &&
      objetArrayTroupes.bombeSardaukar.length !== 0
    ) {
      // On entre dans la condition seulement si le nombre de bombe est inférieur au nombre max et si le big array n'est pas vide
  
      bombeDrawnAllTimeSardau.push(objetArrayTroupes.bombeSardaukar[0]); //on ajoute la premiere bombe de l'array contenant toutes les bombes à l'array qui est dessiné
      objetArrayTroupes.bombeSardaukar.splice(0, 1); // On enleve celle qu'on vient de prendre
      stateBattle.bombeSardaukarField++;
    }
    if (
      stateBattle.bombeVehiculeHarkonnenOnField <
        limitationEcran.bombeVehiculeHarkonnenMax &&
      objetArrayTroupes.bombeVehiculeHarkonnen.length !== 0
    ) {
      // On entre dans la condition seulement si le nombre de bombe est inférieur au nombre max et si le big array n'est pas vide
  
      bombeDrawnAllTimeHarkoVehicule.push(
        objetArrayTroupes.bombeVehiculeHarkonnen[0]
      ); //on ajoute la premiere bombe de l'array contenant toutes les bombes à l'array qui est dessiné
      objetArrayTroupes.bombeVehiculeHarkonnen.splice(0, 1); // On enleve celle qu'on vient de prendre
      stateBattle.bombeVehiculeHarkonnenOnField++;
    }
  
    /*bombeDrawnAllTimeHarko.forEach((bombe) => {
      bombe.draw();
    });*/
  /*
    let i = 0;
    const intId = setInterval(() => {
      //console.log(bombeDrawnAllTimeHarko[i]);
      if (i === bombeDrawnAllTimeHarko.length) {
        clearInterval(intId);
        callbackEnd();
      } else {
        callbackDraw(bombeDrawnAllTimeHarko[i]);
      }
      i++;
    }, 1000);
  
    // callback();
  }

  */

/***********************************Fonction modify by guillaume************************ */

//let backupSardaukar = 0;

let xmax = canvas.width - vaisseauxSardaukar.width;
let xmin = vaisseauxSardaukar.width;
let  xInBetweenScreen = Math.floor(Math.random() * (xmax - xmin) + xmin);
// On dit que le sardau se créé a la meme altitude que le vaisseaux mais à un x random entre deux positions
let sardauTest = new Protagonniste(
    xInBetweenScreen,
    vaisseauxSardaukar.y,
    20,
    20,
    0.5,
    "#fb8500",
    "sardaukar"
  );



function test(sardau) {
    sardau.draw();
    sardau.move();
}

function goThrouhSardaukarArray() {    
    arraySardaukarParachute.forEach((sardaukar) =>{
        parachuteSardaukar(sardaukar);
    });
}

function animate() {
  /*********Gestion du backgrounb et de l'actualisation de l'écran */

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.fillStyle = 'rgba(252, 191, 73, 0.1)';  //orange clair
  //   ctx.fillStyle = 'rgba(250, 163, 7, 0.1)'; //orange medium

  /***********************************Fonction modify by guillaume************************ */
  //const drawBomb = (bomb) => bomb.draw();

  /***********************************Fonction modify by guillaume************************ */

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // noir
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /*****************Gestion des bombes */
  fillRemoveBombeArray();
   /***********************************Iniitial************************ */
    if(bombeDrawnAllTimeHarko.length !== 0){
        drawBombHarkonnen();
    } 
    if(bombeDrawnAllTimeSardau.length !== 0){
        drawBombSardaukar();
    }
    if (bombeDrawnAllTimeHarkoVehicule.length !== 0){
        drawBombHarkonnenVehicule();
    }




  /***********************************Fonction modify by guillaume************************ */
  // tick +=0.1;
  /*
  tick += 1;

  if (tick === 60) {
    seconds++;
    tick = 0;
  }

  //if (tick % 200 === 0) seconds++;

  if (seconds % 5 === 0) {
    fillRemoveBombeArray(drawBomb, () => (blockFrame = false));
    blockFrame = true;
  }
*/
  // drawBombHarkonnen();
  //if (seconds % 100 === 0) {
  //}

  // Si il y a une bombe dans l'array à dessiner on dessine une bombe
  /*
    if(bombeDrawnAllTimeHarko.length !== 0){
        drawBombHarkonnen();
    } 
    if(bombeDrawnAllTimeSardau.length !== 0){
        drawBombSardaukar();
    }
    if (bombeDrawnAllTimeHarkoVehicule.length !== 0){
        drawBombHarkonnenVehicule();
    }
    */


  /***********************************Fonction modify by guillaume************************ */

  drawEnnemies();

//   parachuteSardaukar();
  goThrouhSardaukarArray()
  // Dessine la ligne de sable
  sandLineDraw();

  distanceRemoveProtagonisteTouched();

  distanceRemoveBombeTouched();



  /*************** Gestion html ****************** */
  updateHTML();
  /********************************************************************** */
  //ajout pour particule !!!!!!!!!!!!!!

  particles.forEach((particle, index) => {
    //Partie test pour particle qui fade
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.move();
    }
  });

  
  /***********************************Fonction modify by guillaume************************ */
  /*
    for (let i = 0; i < particles.length; i+=1) {
        particles[i].alpha <= 0 && particles.splice(i, 1);
        particles[i].move();
    }
*/
  /***********************************Fonction modify by guillaume************************ */


  /******************************* ESSAI DE LIMITATION ECRAN******************************************* */
  //ON VA RENCONTRER DES PROBLEMES AVEC LE CALCUL DES DISTANCES SI LES HARKONNNENS SONT PAS PRESENT SUR LECRAN

  drawSpriteHulud(shaiHulud.x, shaiHulud.y, shaiHulud.radius, shaiHulud.color);
  requestAnimationFrame(animate);
}

animate();

function createLvlProtagoniste(lvlCharacteristic) {
    const harkonnenLegion = [];
    const sardaukarLegion = [];
    const usineArray = [];
    const vehiculeHarkonnenArray = [];
    const bombeHarkonnenArray = [];
    const bombeSardaukarArray = [];
    const bombeVehiculeHarkonnenArray = [];
  
    let lvl = lvlCharacteristic.lvl;
  
    /**************Definition des caractéristiques des protagonistes****************/
  
    /********** Decor ************/
  
    // Spécification Ecran
    let sandLineMiddlePosition = canvas.height / 2;
  
    /********** Protagonniste ************/
  
    // Harkonnen specification
    let harkonnenWidth = 20;
    let harkonnenHeight = 20;
    let harkonnenColor = "#ffb703"; //'#023047'; //'#ffb703' fake just for nice color
    let maxSpeedHarkonnen = 1;
    let minSpeedHarkonnen = 0.2;
    let feetPosition = sandLineMiddlePosition - harkonnenHeight;
  
    // Sardaukar specification
    let sardaukarWidth = 20;
    let sardaukarHeight = 20;
    let sardaukarColor = "#fb8500"; //'#fb8500' fake just for nice color // real '#f5f3f4'
    let maxSpeedSardaukar = 1.5;
    let minSpeedSardaukar = 0.5;
  
    /********** Véhicules specification ************/
  
    // Vaisseaux Sardaukars
    let vaisseauSardaukarWidth = 200;
    let vaisseauSardaukarHeight = 80;
  
    // Usine d'épices
    let usineWidth = 200;
    let usineHeight = 100;
    let usineBottom = sandLineMiddlePosition - usineHeight;
    let usineColor = "#7f4f24";
    let usineSpeed = 0.1;
  
    // Vehicule de Harkonnen
    let vehiculeHarkonnenWidth = 100;
    let vehiculeHarkonnenHeight = 40;
    let vehiculeHarkonnenBottom =
      sandLineMiddlePosition - vehiculeHarkonnenHeight;
    let vehiculeHarkonnenColor = "#219ebc";
    let vehiculeHarkonnenMaxSpeed = 1.7;
    let vehiculeHarkonnenMinSpeed = 1.5;
  
    /**************** FIN Definition des caractéristiques des protagonistes***************/
  
    switch (true) {
      case lvl <= 5:
        // On a que des Harkonnens
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        break;
  
      case lvl <= 10:
        // On a Sardokar, Harkonnen, Usine
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbSardaukar; i++) {
          let velocity = assignationVitesse(maxSpeedSardaukar, minSpeedSardaukar);
          let Xposition =
            Math.random() * (canvas.width - sardaukarWidth * 2) + sardaukarWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          sardaukarLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              sardaukarWidth,
              sardaukarHeight,
              velocity,
              sardaukarColor,
              "sardaukar"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeSardaukar; i++) {
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeSardaukarWidth * 2) +
            objBombeStyle.bombeSardaukarWidth;
          bombeSardaukarArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeSardaukarWidth,
              objBombeStyle.bombeSardaukarHeight,
              objBombeStyle.bombeSardaukarColor,
              "bombeSardaukar",
              imageBombeSardaukar
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbUsine; i++) {
          let Xposition =
            Math.random() * (canvas.width - usineWidth * 2) + usineWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille de l'usine sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          usineArray.push(
            new Protagonniste(
              Xposition,
              usineBottom,
              usineWidth,
              usineHeight,
              usineSpeed,
              usineColor,
              "usine"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        break;
  
      case lvl <= 20:
        // On a Sardokar, Harkonnen, Usine
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbSardaukar; i++) {
          let velocity = assignationVitesse(maxSpeedSardaukar, minSpeedSardaukar);
          let Xposition =
            Math.random() * (canvas.width - sardaukarWidth * 2) + sardaukarWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          sardaukarLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              sardaukarWidth,
              sardaukarHeight,
              velocity,
              sardaukarColor,
              "sardaukar"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeSardaukar; i++) {
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeSardaukarWidth * 2) +
            objBombeStyle.bombeSardaukarWidth;
          bombeSardaukarArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeSardaukarWidth,
              objBombeStyle.bombeSardaukarHeight,
              objBombeStyle.bombeSardaukarColor,
              "bombeSardaukar",
              imageBombeSardaukar
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbUsine; i++) {
          let Xposition =
            Math.random() * (canvas.width - usineWidth * 2) + usineWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille de l'usine sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          usineArray.push(
            new Protagonniste(
              Xposition,
              usineBottom,
              usineWidth,
              usineHeight,
              usineSpeed,
              usineColor,
              "usine"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbVehiculeHarkonnen; i++) {
          let velocity = assignationVitesse(
            vehiculeHarkonnenMaxSpeed,
            vehiculeHarkonnenMinSpeed
          );
          let Xposition =
            Math.random() * (canvas.width - vehiculeHarkonnenWidth * 2) +
            vehiculeHarkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          vehiculeHarkonnenArray.push(
            new Protagonniste(
              Xposition,
              vehiculeHarkonnenBottom,
              vehiculeHarkonnenWidth,
              vehiculeHarkonnenHeight,
              velocity,
              vehiculeHarkonnenColor,
              "vehiculeHarkonnen"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeVehiculeHarkonnen; i++) {
          //let velocity = assignationVitesse(objBombeStyle.bbHarkonnenVehiculeSpeedMax, objBombeStyle.bbHarkonnenVehiculeSpeedMin);
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeHarkonnenVehiculeWidth * 2) +
            objBombeStyle.bombeHarkonnenVehiculeWidth;
          bombeVehiculeHarkonnenArray.push(
            new BombeVehicule(
              Xposition,
              canvas.height / 2 + objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeWidth,
              objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeColor,
              "bombeHarkonnenVehicule",
              imageBombeHarkonnenVehicule,
              {
                x: Math.random() - 0.5,
                y: Math.random() - 0.5,
              }
            )
          );
        }
        break;
  
      case lvl <= 100:
        // On a Sardokar, Harkonnen, Usine
        for (let i = 0; i < lvlCharacteristic.nbHarkonnen; i++) {
          let velocity = assignationVitesse(maxSpeedHarkonnen, minSpeedHarkonnen);
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du harkonnen sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          harkonnenLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              harkonnenWidth,
              harkonnenHeight,
              velocity,
              harkonnenColor,
              "harkonnen"
            )
          ); //Création d'un array qui contient notre legion d'harkonnen
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeHarkonnen; i++) {
          let Xposition =
            Math.random() * (canvas.width - harkonnenWidth * 2) + harkonnenWidth;
          bombeHarkonnenArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeHarkonnenWidth,
              objBombeStyle.bombeHarkonnenHeight,
              objBombeStyle.bombeHarkonnenColor,
              "bombeHarkonnen",
              imageBombeHarkonnen
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbSardaukar; i++) {
          let velocity = assignationVitesse(maxSpeedSardaukar, minSpeedSardaukar);
          let Xposition =
            Math.random() * (canvas.width - sardaukarWidth * 2) + sardaukarWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          sardaukarLegion.push(
            new Protagonniste(
              Xposition,
              feetPosition,
              sardaukarWidth,
              sardaukarHeight,
              velocity,
              sardaukarColor,
              "sardaukar"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeSardaukar; i++) {
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeSardaukarWidth * 2) +
            objBombeStyle.bombeSardaukarWidth;
          bombeSardaukarArray.push(
            new Bombe(
              Xposition,
              objBombeStyle.bombeSardaukarWidth,
              objBombeStyle.bombeSardaukarHeight,
              objBombeStyle.bombeSardaukarColor,
              "bombeSardaukar",
              imageBombeSardaukar
            )
          );
        }
        for (let i = 0; i < lvlCharacteristic.nbUsine; i++) {
          let Xposition =
            Math.random() * (canvas.width - usineWidth * 2) + usineWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille de l'usine sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          usineArray.push(
            new Protagonniste(
              Xposition,
              usineBottom,
              usineWidth,
              usineHeight,
              usineSpeed,
              usineColor,
              "usine"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbVehiculeHarkonnen; i++) {
          let velocity = assignationVitesse(
            vehiculeHarkonnenMaxSpeed,
            vehiculeHarkonnenMinSpeed
          );
          let Xposition =
            Math.random() * (canvas.width - vehiculeHarkonnenWidth * 2) +
            vehiculeHarkonnenWidth; // On créer une position initiale aléatoire entre 0 et la taille du canvas en enlevant la taille du sardaukar sur les bords pour pas qu'il soit coincé à la bordure de l"écran
          vehiculeHarkonnenArray.push(
            new Protagonniste(
              Xposition,
              vehiculeHarkonnenBottom,
              vehiculeHarkonnenWidth,
              vehiculeHarkonnenHeight,
              velocity,
              vehiculeHarkonnenColor,
              "vehiculeHarkonnen"
            )
          ); //Création d'un array qui contient notre legion de sardaukar
        }
        for (let i = 0; i < lvlCharacteristic.nbBombeVehiculeHarkonnen; i++) {
          let velocity = assignationVitesse(
            objBombeStyle.bbHarkonnenVehiculeSpeedMax,
            objBombeStyle.bbHarkonnenVehiculeSpeedMin
          );
          let Xposition =
            Math.random() *
              (canvas.width - objBombeStyle.bombeHarkonnenVehiculeWidth * 2) +
            objBombeStyle.bombeHarkonnenVehiculeWidth;
          bombeVehiculeHarkonnenArray.push(
            new BombeVehicule(
              Xposition,
              canvas.height / 2 + objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeWidth,
              objBombeStyle.bombeHarkonnenVehiculeHeight,
              objBombeStyle.bombeHarkonnenVehiculeColor,
              "bombeHarkonnenVehicule",
              imageBombeHarkonnenVehicule,
              velocity
            )
          );
        }
        break;
  
      default:
        alert("Bug dans createLvlProtagoniste, deuxieme switch");
        break;
    }
  
    // console.log("harko");
  
    // console.log("Sardau");
    // console.log(bombeSardaukarArray);
    // console.log("Vehicule");
    // console.log(bombeVehiculeHarkonnenArray);
  
    let lvlProtagonisteArray = {
      usines: usineArray,
      vehiculeHarkonnens: vehiculeHarkonnenArray,
      harkonnens: harkonnenLegion,
      sardaukars: sardaukarLegion,
      bombeHarkonnen: bombeHarkonnenArray,
      bombeSardaukar: bombeSardaukarArray,
      bombeVehiculeHarkonnen: bombeVehiculeHarkonnenArray,
    };
    return lvlProtagonisteArray;
  }