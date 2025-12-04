const DATA = [];
const LIMIT = 20;
let DATA_FOUND = [];
let RENDERED_ARRAY = [];
let dialogRef = "";
let responseAsJson = [];
let singlePokemon = [];
let pokemonAmount = 0;
let currentPokemonNr = 0;

function init() {
    load(LIMIT, pokemonAmount);
}

function pokemonMainRender(arr) {
    const MAIN_POKE_WINDOW_REF = document.getElementById("pokemonList");
    if (arr == null) {
        RENDERED_ARRAY = DATA;
        document.getElementById("pokemonSearching").value = "";
    } else {
        RENDERED_ARRAY = arr;
    }
    MAIN_POKE_WINDOW_REF.classList.add("pokemon-list-grid");
    MAIN_POKE_WINDOW_REF.innerHTML = "";
    for (let i = 0; i < RENDERED_ARRAY.length; i++) {
        const name = capitalizeFirstLetter(RENDERED_ARRAY[i].name);
        MAIN_POKE_WINDOW_REF.innerHTML += POKEMON_FIRST_WINDOW(i, name);
        addingPokemonTypeImg(`pokemonImgFooter${RENDERED_ARRAY[i].id}`, i);
    }
    pokemonBackgrouColorGenerator(RENDERED_ARRAY);
    disableLoadingSpinner();
}

function pokemonShowWindowStats(i) {
    openDialog(i);
    pokemonShowMain(i);
}

function pokemonShowMain(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);
    const HEIGHT = RENDERED_ARRAY[parameter].height * 10;
    const WEIGHT = RENDERED_ARRAY[parameter].weight / 10;
    const ABILITIES = [];
    RENDERED_ARRAY[parameter].abilities.forEach(element => { ABILITIES.push(" " + capitalizeFirstLetter(element)); });
    REF_ELEMENT.innerHTML = POKEMON_MAIN_STATS(HEIGHT, WEIGHT, ABILITIES);
    REF_ELEMENT.classList.add('force-row');
    setBorderBottomNavStats("pokemonMainStats");
}

function pokemonShowStats(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);
    REF_ELEMENT.innerHTML = POKEMON_DETAILED_STATS();
    for (let i = 0; i < RENDERED_ARRAY[parameter].stats.length; i++) {
        const NAME = RENDERED_ARRAY[parameter].stats[i].name;
        const VALUE = RENDERED_ARRAY[parameter].stats[i].stat;
        const INDEX_IN_DATA = parameter;
        document.getElementById("tableOfPokemonDetailedStat").innerHTML += POKEMON_DETAILED_STATS_VALUE(NAME, i, VALUE, INDEX_IN_DATA);
        document.getElementById(`${i}_progress_bar_value`).style.width = `${calculatesPercent(NAME, VALUE)}%`;
    }
    REF_ELEMENT.classList.remove("stats-container-auto-scroll");
    REF_ELEMENT.classList.add("stats-container-no-scroll");
    REF_ELEMENT.classList.remove('force-row');
    setBorderBottomNavStats("pokemonSecondStats");
}

function pokemonShowEvo(pokemonID, i) {
    const REF_ELEMENT = document.getElementById(`${i}_stats`);
    REF_ELEMENT.innerHTML = POKEMON_EVO_CHAIN();
    REF_ELEMENT.classList.remove("stats-container-no-scroll");
    REF_ELEMENT.classList.add("stats-container-auto-scroll");
    document.getElementById("pokemonEvoChainDiv").innerHTML = "";
    pokemonShowEvoForm(pokemonID)
    REF_ELEMENT.classList.remove('force-row');
    setBorderBottomNavStats("pokemonEvoChain");
}

async function pokemonShowEvoForm(pokemonID) {
    const EVOLUTION_NAMES = await getEvolutionChainNames(pokemonID);
    for (let i = 0; i < EVOLUTION_NAMES.length; i++) {
        const NR = i + 1;
        const NAME = capitalizeFirstLetter(EVOLUTION_NAMES[i]);
        const CURRENT_POKEMON_ID = await getPokemonID(`${NAME}`)
        const URL = getPokemonPhoto(CURRENT_POKEMON_ID);
        document.getElementById("pokemonEvoChainDiv").innerHTML += POKEMON_EVO_CHAIN_FORM(URL, NAME, NR);
    }
}


function setBorderBottomNavStats(elementID) {
    const MAIN_STATS = document.getElementById("pokemonMainStats");
    const SECOND_STATS = document.getElementById("pokemonSecondStats");
    const EVO_CHAIN = document.getElementById("pokemonEvoChain");
    MAIN_STATS.classList.remove("active-nav-stats");
    SECOND_STATS.classList.remove("active-nav-stats");
    EVO_CHAIN.classList.remove("active-nav-stats");
    document.getElementById(`${elementID}`).classList.add("active-nav-stats");

}

function search() {
    let REF = document.getElementById("pokemonSearching").value;
    REF = REF.trim();
    REF = REF.toLowerCase();
    if (REF.length < 3) {
        inputHaveTooLittleLetters();
    } else {
        searchResult(REF)
    }
}

function inputHaveTooLittleLetters() {
    const POKEMON_LIST_REF = document.getElementById("pokemonList");
    pokemonMainRender(DATA_FOUND);
    DATA_FOUND = [];
    POKEMON_LIST_REF.style.display = "flex";
    POKEMON_LIST_REF.style.flexDirection = "column";
    POKEMON_LIST_REF.innerHTML = MESSAGE[0].too_short_Pokemon_name;
    POKEMON_LIST_REF.innerHTML += BUTTON_TO_BACK();
}

function searchResult(searchChar) {
    const POKEMON_LIST_REF = document.getElementById("pokemonList");
    DATA_FOUND = DATA.filter((element) => element.name.includes(searchChar));
    pokemonMainRender(DATA_FOUND);
    if (DATA_FOUND.length == 0) {
        POKEMON_LIST_REF.style.display = "flex";
        POKEMON_LIST_REF.style.flexDirection = "column";
        POKEMON_LIST_REF.innerHTML = MESSAGE[0].no_search_results;
    }
    POKEMON_LIST_REF.innerHTML += BUTTON_TO_BACK();
}

async function load() {
    enableLoadingSpinner();
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${pokemonAmount}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        responseAsJson = await response.json();
        responseAsJson = responseAsJson.results;
        pokemonAmount += responseAsJson.length;
        loadSinglePokemon();

        return;
    } catch (error) {
        console.error("Data could not be retrieved:", error);
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
            console.error("Data could not be retrieved:", error);
        }
    }
    pokemonMainRender(DATA);
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
    });
    singlePokemon = [];
}

function pokemonBackgrouColorGenerator(arr) {
    for (let i = 0; i < arr.length; i++) {
        let type = arr[i].types;
        const idElement = `pokemonMain${arr[i].id}`;
        pokemonWindowBackgroundColor(type, idElement);
    }
}

function pokemonWindowBackgroundColor(type, idElement) {
    const NUMBER_OF_COLORS = type.length;
    const BACKGROUD_REF = document.getElementById(`${idElement}`);
    if (NUMBER_OF_COLORS == 2) {
        const COLOR_FIRST = colorSearch(type[0]);
        const COLOR_SECOND = colorSearch(type[1]);
        BACKGROUD_REF.style.background = `linear-gradient(0deg, ${COLOR_SECOND} 0%, ${COLOR_FIRST} 100%)`;
    }
    else if (NUMBER_OF_COLORS == 1) {
        BACKGROUD_REF.style.backgroundColor = `${colorSearch(type[0])}`;
    }
    else {
        BACKGROUD_REF.style.backgroundColor = "#FFFFFF";
    }
}

function openDialog(parameter) {
    dialogRef = document.getElementById("myDialog");
    if (parameter == "LOADING") {
        dialogRef.innerHTML = LOADING_IMG();
        dialogRef.style.height = "400px";
        dialogRef.style.justifyContent = "center";
    } else if (parameter != "LOADING") {
        openDialogWithPokemonStats(parameter);
    }
    document.body.style.overflow = "clip";
    dialogRef.showModal();
    dialogRef.classList.add("opened");
}

function openDialogWithPokemonStats(parameter) {
    dialogRef.innerHTML = DIALOG_WINDOW(parameter);
    currentPokemonNr = parameter;
    pokemonShowMain(parameter);
    closeDialogListner();
    removeKeyListner();
    addKeyListner();
    pokemonWindowBackgroundColor(RENDERED_ARRAY[parameter].types, `${parameter}_img`);
    addingPokemonTypeImg(`${parameter}_types`, parameter);
}

function closeDialog() {
    dialogRef.close();
    dialogRef.innerHTML = "";
    dialogRef.classList.remove("opened");
    dialogRef.style.height = "";
    dialogRef.style.justifyContent = "";
    document.body.style.overflow = "auto";
}

function closeDialogListner() {
    dialogRef.addEventListener('click', function (event) {
        if (event.target === dialogRef) {
            closeDialog();
        }
    }
    );
}

function addKeyListner() {
    document.addEventListener('keydown', handleKeyDown);
}

function removeKeyListner() {
    document.removeEventListener('keydown', handleKeyDown);
}

function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function filterAbilities(array) {
    const NEW_ARRAY = [];
    array.forEach(element => { NEW_ARRAY.push(`${element.ability.name}`); });
    return NEW_ARRAY;
}

function filterTypes(array) {
    const NEW_ARRAY = [];
    array.forEach(element => { NEW_ARRAY.push(`${element.type.name}`); });
    return NEW_ARRAY;
}

function filterStats(array) {
    const NEW_ARRAY = [];
    array.forEach(element => {
        const OBJ = {};
        OBJ.name = element.stat.name;
        OBJ.stat = element.base_stat;
        NEW_ARRAY.push(OBJ);
    });
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
    const NUMBER_OF_TYPES = RENDERED_ARRAY[index].types.length;

    for (let i = 0; i < NUMBER_OF_TYPES; i++) {
        POKEMON_TYPE_IMG_REF.innerHTML += `<img src="${typeImgSearch(RENDERED_ARRAY[index].types[i])}" alt="">`
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

function nextPokemon(value) {
    const result = value + 1;

    if (result >= RENDERED_ARRAY.length) {
        return 0;
    } else {
        return result;
    }
}

function prevPokemon(value) {
    const result = value - 1;

    if (result < 0) {
        return RENDERED_ARRAY.length - 1;
    } else {
        return result;
    }
}

function calculatesPercent(NAME, VALUE) {
    for (let i = 0; i < POWERFULL_POKEMON.length; i++) {
        if (NAME == POWERFULL_POKEMON[i].stat) {
            result = (VALUE / POWERFULL_POKEMON[i].value) * 100;
            result = parseInt(result);
            return result;
        }
    }
}

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        if (dialogRef.open) {
            closeDialog();
        }
    }

    if (dialogRef.open) {
        if (event.key === 'ArrowLeft') {
            openDialog(prevPokemon(currentPokemonNr));

        } else if (event.key === 'ArrowRight') {
            openDialog(nextPokemon(currentPokemonNr));

        }
    }
}

async function fetchEvolutionChainUrl(pokemonID) {
    const SPECIES_URL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonID}/`;
    const RESPONSE = await fetch(SPECIES_URL);
    const DATA_FETCH = await RESPONSE.json();
    return DATA_FETCH.evolution_chain.url;
}

async function fetchAndProcessChain(chainUrl) {
    if (!chainUrl) return [];

    const EVO_CHAIN_NAMES = [];
    const CHAIN_RESPONSE = await fetch(chainUrl);
    const CHAIN_DATA = await CHAIN_RESPONSE.json();
    let currentChain = CHAIN_DATA.chain;

    while (currentChain && (currentChain.evolves_to.length <= 1)) {
        EVO_CHAIN_NAMES.push(currentChain.species.name);
        if (currentChain.evolves_to.length === 0) break;
        currentChain = currentChain.evolves_to[0];
    }

    return EVO_CHAIN_NAMES;
}

async function getEvolutionChainNames(pokemonID) {
    const CHAIN_URL = await fetchEvolutionChainUrl(pokemonID);
    const NAMES = await fetchAndProcessChain(CHAIN_URL);
    return NAMES;
}

async function getPokemonID(pokemonName) {
    const FETCH_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const response = await fetch(FETCH_URL);
    const FETCHED_DATA = await response.json();
    const POKEMON_ID = FETCHED_DATA.id;
    return POKEMON_ID;
}

function getPokemonPhoto(pokemonID) {
    const PHOTO_URL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg`
    return PHOTO_URL;
}

function getPokemonGif(pokemonID) {
    const GIF_URL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonID}.gif`
    return GIF_URL;
}

function shwoToolTip(parametr, value, i, indexInDATA) {
    const REF = document.getElementById(`tooltip_${i}`);
    REF.innerHTML += TOOLTIP(parametr, value, i, indexInDATA);
}

function closeToolTip(i) {
    const REF = document.getElementById(`tooltip_${i}`);
    REF.innerHTML = "";
}

function dataGifVeryfication(i) {
    if (RENDERED_ARRAY[i].gif == null) {
        return RENDERED_ARRAY[i].foto;
    } else {
        return RENDERED_ARRAY[i].gif;
    }
}
