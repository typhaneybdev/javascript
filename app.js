//grid vairables
const grid = document.getElementById('grid');
const gridItem = document.querySelector('.grid-item');

// Create super (Animal) Constructor
function Animal(species, weight, height, diet, image) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.image = image;
}

//create Dino class to extebd Animal 
function Dino(species, weight, height, diet, where, when, fact, image) {
    Animal.call(this, species, weight, height, when, diet, image)
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.image = image;
}

// create Human clss to extend Animal
function Human(species, weight, feet, inches, diet, image) {
    Animal.call(this, species, weight, diet, image)
    this.species = species;
    this.weight = weight;
    this.height = feet;
    this.where = inches;
    this.diet = diet;
    this.image = image;
}

// source https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
// source: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
const createDinoGraph = () => { //create dinographic
    (async () => { //dino json path
        const dino = await fetch("dino.json") // retieve dino objects from json 
            .then(result => result.json())
            .then(result => result.Dinos);

        // Create Dino Objects
        const dinosaur = dino.map(dinosaur => new Dino(
            dinosaur.species,
            dinosaur.weight,
            dinosaur.height,
            dinosaur.diet,
            dinosaur.where,
            dinosaur.when,
            dinosaur.fact,
            dinosaur.image));

        // randdom facts
        Dino.prototype.getRandom = function() {
            return this.fact[Math.floor(Math.random() * this.fact.length)];
        };

        // Create human Object
        const human = new Human();
        const humanData = () => {
            // Use IIFE to get human data from form
            //source:https://www.youtube.com/watch?v=NxVCq4p0Kb0
            //https://developer.mozilla.org/en-US/docs/Glossary/IIFE
            (function(human) {
                human.image = "images/human.png";
                human.species = document.getElementById('name').value;
                human.diet = document.getElementById('diet').value;
                human.weight = document.getElementById('weight').value;
                human.feet = document.getElementById('feet').value;
                human.inches = document.getElementById('inches').value;
                human.fact = "";
            })(human);
        };

        // add human to array
        dinosaur.splice(4, 0, human);

        // Generate Tiles 
        const createTile = () => {
            //loop to dynamically add card data
            for (let i = 0; i < 9; i++) {
                const newTile = document.createElement('div');
                const tileTitle = document.createElement('h3');
                const tileImg = document.createElement('img');
                const tileFact = document.createElement('p');

                newTile.className = 'grid-item';
                grid.appendChild(newTile);
                newTile.appendChild(tileTitle);
                newTile.appendChild(tileImg);
                newTile.appendChild(tileFact);

                tileTitle.innerHTML = dinosaur[i].species;
                tileImg.setAttribute('src', dinosaur[i].image);


                //compare methods
                const dinoObj = dinosaur[i];
                const getWeight = () => {
                    if (human.weight < dinoObj.weight) {
                        return `The ${dinoObj.species} weighs ${dinoObj.weight - human.weight} lbs more than ${human.species}!`;
                    } else if (dinoObj.weight < human.weight) {
                        return `The ${dinoObj.species} weighs ${human.weight - dinoObj.weight} lbs less than ${human.species}!`;
                    }
                };

                const getDiet = () => {
                    if (human.diet === "Carnivor" && dinoObj.diet === "carnivor") {
                        return `${human.species} has the same diet as a ${dinoObj.species}!`;
                    } else if (human.diet === "Herbavor" && dinoObj.diet === "herbavor") {
                        return `${human.species} has the same diet as a ${dinoObj.species}!`;
                    } else {
                        return `${human.species}'s diet doesn't match this Dinosaur.`
                    }
                };

                const getHeightDif = () => {
                    const humanInches = parseInt(human.feet * 12) + parseInt(human.inches);
                    if (humanInches < dinoObj.height) {
                        return `${human.species} is ${dinoObj.height - humanInches} inches shorter than ${dinoObj.species}!`;
                    } else if (dinoObj.height < humanInches) {
                        return `${human.species} is ${humanInches - dinoObj.height} inches taller than ${dinoObj.species}!`;
                    }
                };

                if (typeof dinosaur[i].fact === 'string') {
                    tileFact.innerHTML = "";
                } else {
                    dinosaur[i].fact.push(getWeight(), getDiet(), getHeightDif());
                    dinosaur[8].fact.splice(1, 3); //remove random pigeon facts
                    tileFact.innerHTML = dinosaur[i].getRandom();
                }
            }
        };
        // create tiles with human data;
        return createTile(humanData());
    })();
};

// Remove form from screen
function toggleForm() {
    const toggleMe = document.getElementById('dino-compare');
    toggleMe.classList.add("hide");
}

//On button click, prepare and display infographic
const compareMe = document.getElementById('btn');
compareMe.addEventListener('click', function(e) {
    toggleForm(); //remove form
    createDinoGraph(); // Add tiles to DOM
});