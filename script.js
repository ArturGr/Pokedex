const DATA = [];
let DIALOGREF;
let responseAsJson;
let singlePokemon;
let pokemonAmount = 0;

function init() {
    load(20, 0);
}

function pokemonMainRender() {
    const MAIN_POKE_WINDOW_REF = document.getElementById("main_wrapper");
    MAIN_POKE_WINDOW_REF.innerHTML = "";
    for (let i = 0; i < DATA.length; i++) {
        const name = capitalizeFirstLetter(DATA[i].name);
        MAIN_POKE_WINDOW_REF.innerHTML += POKEMON_FIRST_WINDOW(i, name);
        addingPokemonTypeImg(`pokemonImgFooter${DATA[i].id}`, i);
    }
    pokemonBackgrouColorGenerator();
    MAIN_POKE_WINDOW_REF.innerHTML += DIALOG_WINDOW();
    MAIN_POKE_WINDOW_REF.innerHTML += BUTTON_TO_LOAD_MORE(pokemonAmount);
    DIALOGREF = document.getElementById("myDialog");
}

function pokemonShowWindowStats(i) {
    console.log("Ta funkcja pokazuje okno z zdjeciem pokemona i glownymi statystykami. w tym oknie mozna wybrac podokno z wlasciwosciami i ewolucja pokemona");
    console.log("Wywolana funkcja dla pokemona nr " + i)

    openDialog();
}

function pokemonShowSstats() {
    console.log("Ta funkcja pokazuje statystyki zyciowe danego pokemona");
}

function pokemonShowEvo() {
    console.log("Ta funkcja pokazuje lancuch ewolucji pokemona");
}

function search() {
    console.log("Ta odpowiada za wyszukiwanie danego pokemona (minimum 3 znaki, zabezpieczyc przed wstrzykiwaniem kodu JS)");
}

function save() {
    console.log("Ta funkcja zapisuje lokalnie dane, zeby po pierwsyzm wczytaniu strony nie trzeba bylo czekac przy ponownym uruchomieniu strony");
}

async function load(limit, offset) {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        responseAsJson = await response.json();
        responseAsJson = responseAsJson.results;
        pokemonAmount += responseAsJson.length;
        loadSinglePokemon();

        return;
    } catch (error) {
        console.error("Daten konnten nicht abgerufen werden:", error);
    }
}

async function loadSinglePokemon() {
    for (let i = 0; i < responseAsJson.length; i++) {
        try {
            let response = await fetch(responseAsJson[i].url);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            singlePokemon = await response.json();
            dataImportToArray();
        }
        catch (error) {
            console.error("Daten konnten nicht abgerufen werden:", error);
        }
    }
    pokemonMainRender();
}

function dataImportToArray() {
    DATA.push({
        "id": singlePokemon.id,
        "order": singlePokemon.order,
        "name": singlePokemon.name,
        "height": singlePokemon.height,
        "weight": singlePokemon.weight,
        "foto": singlePokemon.sprites.other.dream_world.front_default,
        "stats": filterStats(singlePokemon.stats),
        "abilities": filterAbilities(singlePokemon.abilities),
        "types": filterTypes(singlePokemon.types)
    })

}

function pokemonBackgrouColorGenerator() {
    for (let i = 0; i < DATA.length; i++) {
        let type = DATA[i].types;
        const BACKGROUD_REF = document.getElementById(`pokemonMain${DATA[i].id}`);
        pokemonWindowBackgroundColor(type, BACKGROUD_REF);
    }
}

function pokemonWindowBackgroundColor(type, BACKGROUD_REF) {
    const NUMBER_OF_COLORS = type.length;
    let color = "";
    if (NUMBER_OF_COLORS == 2) {
        const COLOR_FIRST = colorSearch(type[0]);
        const COLOR_SECOND = colorSearch(type[1]);
        BACKGROUD_REF.style.background = `linear-gradient(0deg, ${COLOR_SECOND} 0%, ${COLOR_FIRST} 100%)`;
    }
    else if (NUMBER_OF_COLORS == 1) {
        color = colorSearch(type[0]);
        BACKGROUD_REF.style.backgroundColor = `${color}`;
    }
    else {
        color = "#FFFFFF";
        BACKGROUD_REF.style.backgroundColor = `${color}`;
    }
}

function openDialog() {
    DIALOGREF.showModal();
    DIALOGREF.classList.add("opened");
    CloseDialogListner();
    keyListner();
}

function closeDialog() {
    DIALOGREF.close();
    DIALOGREF.classList.remove("opened");
}

function CloseDialogListner() {
    DIALOGREF.addEventListener('click', function (event) {
        if (event.target === DIALOGREF) {
            closeDialog();
        }
    }
    );
}

function keyListner() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (DIALOGREF.open) {
                closeDialog();
            }
        }

        if (DIALOGREF.open) {
            if (event.key === 'ArrowLeft') {
                console.log("Pressed arrow left");
            }
            else if (event.key === 'ArrowRight') {
                console.log("Pressed arrow right");

            }
        }

    });
}

function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function filterAbilities(array) {
    const NEW_ARRAY = [];
    for (let i = 0; i < array.length; i++) {
        NEW_ARRAY.push(`${array[i].ability.name}`);
    }
    return NEW_ARRAY;
}

function filterTypes(array) {
    const NEW_ARRAY = [];
    for (let i = 0; i < array.length; i++) {
        NEW_ARRAY.push(`${array[i].type.name}`);
    }
    return NEW_ARRAY;
}

function filterStats(array) {
    const NEW_ARRAY = [];
    for (let i = 0; i < array.length; i++) {
        const OBJ = {};
        OBJ.name = array[i].stat.name;
        OBJ.stat = array[i].base_stat;
        NEW_ARRAY.push(OBJ);
    }
    return NEW_ARRAY;
}

//singlePokemon.abilities[0].ability.name
//singlePokemon.types[0].type.name
//singlePokemon.stats[0].base_stat
//singlePokemon.stats[0].stat.name

function colorSearch(type) {
    for (let i = 0; i < BACKGROUND_COLOR.length; i++) {
        if (type == BACKGROUND_COLOR[i].type) {
            return BACKGROUND_COLOR[i].color;
        } else if (i == BACKGROUND_COLOR.length - 1 && type != BACKGROUND_COLOR[i].type) {
            return "#FFFFFF";
        }
    }
}

function typeImgSearch(type) {
    for (let i = 0; i < TYPES_IMG.length; i++) {
        if (type == TYPES_IMG[i].type) {
            return TYPES_IMG[i].url;
        } else if (i == TYPES_IMG.length - 1 && type != TYPES_IMG[i].type) {
            return "";
        }
    }
}

function addingPokemonTypeImg(idElement, index) {
    const POKEMON_TYPE_IMG_REF = document.getElementById(`${idElement}`);

    const NUMBER_OF_TYPES = DATA[index].types.length;

    for (let i = 0; i < NUMBER_OF_TYPES; i++) {
        POKEMON_TYPE_IMG_REF.innerHTML += `<img src="${typeImgSearch(DATA[index].types[i])}" alt="">`
    }
}
