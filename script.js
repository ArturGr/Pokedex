const DATA = [];
let DIALOGREF = "";
let responseAsJson = [];
let singlePokemon = [];
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
    MAIN_POKE_WINDOW_REF.innerHTML += BUTTON_TO_LOAD_MORE(pokemonAmount);
    disableLoadingSpinner();
}

function pokemonShowWindowStats(i) {
    openDialog(i);
    pokemonShowMain(i);
}

function pokemonShowMain(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);
    const HEIGHT = DATA[parameter].height * 10;
    const WEIGHT = DATA[parameter].weight / 10;
    const ABILITIES = [];
    for (let i = 0; i < DATA[parameter].abilities.length; i++) {
        ABILITIES.push(" " + capitalizeFirstLetter(DATA[parameter].abilities[i]));
    }

    REF_ELEMENT.innerHTML = POKEMON_MAIN_STATS(HEIGHT, WEIGHT, ABILITIES);
    document.getElementById("pokemonMainStats").style.borderBottom = "solid var(--orange) 3px";
    document.getElementById("pokemonSecondStats").style.borderBottom = "";
    document.getElementById("pokemonEvoChain").style.borderBottom = "";
}

function pokemonShowStats(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);


    REF_ELEMENT.innerHTML = POKEMON_DETAILED_STATS();
    document.getElementById("pokemonMainStats").style.borderBottom = "";
    document.getElementById("pokemonSecondStats").style.borderBottom = "solid var(--orange) 3px";
    document.getElementById("pokemonEvoChain").style.borderBottom = "";
    console.log("Ta funkcja pokazuje statystyki zyciowe danego pokemona");

}

function pokemonShowEvo(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);

    REF_ELEMENT.innerHTML = POKEMON_EVO_CHAIN();
    document.getElementById("pokemonMainStats").style.borderBottom = "";
    document.getElementById("pokemonSecondStats").style.borderBottom = "";
    document.getElementById("pokemonEvoChain").style.borderBottom = "solid var(--orange) 3px";
    console.log("Ta funkcja pokazuje lancuch ewolucji pokemona");
}

function search() {
    console.log("Ta odpowiada za wyszukiwanie danego pokemona (minimum 3 znaki, zabezpieczyc przed wstrzykiwaniem kodu JS)");
}

async function load(limit, offset) {
    enableLoadingSpinner();
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
        "gif": singlePokemon.sprites.other.showdown.front_default,
        "stats": filterStats(singlePokemon.stats),
        "abilities": filterAbilities(singlePokemon.abilities),
        "types": filterTypes(singlePokemon.types)
    })

}

function pokemonBackgrouColorGenerator() {
    for (let i = 0; i < DATA.length; i++) {
        let type = DATA[i].types;
        const idElement = `pokemonMain${DATA[i].id}`;
        pokemonWindowBackgroundColor(type, idElement);
    }
}

function pokemonWindowBackgroundColor(type, idElement) {
    const NUMBER_OF_COLORS = type.length;
    const BACKGROUD_REF = document.getElementById(`${idElement}`);
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

function openDialog(parameter) {
    DIALOGREF = document.getElementById("myDialog");
    if (parameter == "LOADING") {
        DIALOGREF.innerHTML = LOADING_IMG();
        DIALOGREF.style.height = "400px";
        DIALOGREF.style.justifyContent = "center";
    } else if (parameter != "LOADING") {
        DIALOGREF.innerHTML = DIALOG_WINDOW(parameter);
        pokemonShowMain(parameter);
        closeDialogListner();
        keyListner();
        pokemonWindowBackgroundColor(DATA[parameter].types, `${parameter}_img`);
        addingPokemonTypeImg(`${parameter}_types`, parameter);
    }
    document.body.style.overflow = "clip";
    DIALOGREF.showModal();
    DIALOGREF.classList.add("opened");
}

function closeDialog() {
    DIALOGREF.close();
    DIALOGREF.innerHTML = "";
    DIALOGREF.classList.remove("opened");
    DIALOGREF.style.height = "";
    DIALOGREF.style.justifyContent = "";
    document.body.style.overflow = "auto";

}

function closeDialogListner() {
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

function enableLoadingSpinner() {
    if (document.getElementById("button_for_more") != null) {
        document.getElementById("button_for_more").style.display = "none";
    }
    openDialog("LOADING");
}

function disableLoadingSpinner() {
    document.getElementById("button_for_more").style.display = "";
    closeDialog();
}

function NextPokemon(value) {
    const result = value + 1;

    if (result >= DATA.length) {
        return 0;
    } else {
        return result;
    }
}

function PrevPokemon(value) {
    const result = value - 1;

    if (result < 0) {
        return DATA.length - 1;
    } else {
        return result;
    }
}