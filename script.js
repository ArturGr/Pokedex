const DATA = [];
const LIMIT = 20;
let dataFound = [];
let renderedArray = [];
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
    renderArraySet(arr);
    MAIN_POKE_WINDOW_REF.classList.add("pokemonListGrid");
    MAIN_POKE_WINDOW_REF.classList.remove("pokemonListFlex");
    MAIN_POKE_WINDOW_REF.innerHTML = "";
    for (let i = 0; i < renderedArray.length; i++) {
        const name = capitalizeFirstLetter(renderedArray[i].name);
        MAIN_POKE_WINDOW_REF.innerHTML += POKEMON_FIRST_WINDOW(i, name);
        addingPokemonTypeImg(`pokemonImgFooter${renderedArray[i].id}`, i);
    }
    pokemonBackgrouColorGenerator(renderedArray);
    disableLoadingSpinner();
}

function renderArraySet(arr) {
    if (arr == null) {
        renderedArray = DATA;
        document.getElementById("pokemonSearching").value = "";
    } else {
        renderedArray = arr;
    }
}

function pokemonShowWindowStats(i) {
    openDialog(i);
    pokemonShowMain(i);
}

function pokemonShowMain(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);
    const HEIGHT = renderedArray[parameter].height * 10;
    const WEIGHT = renderedArray[parameter].weight / 10;
    const ABILITIES = [];
    renderedArray[parameter].abilities.forEach(element => { ABILITIES.push(" " + capitalizeFirstLetter(element)); });
    REF_ELEMENT.innerHTML = POKEMON_MAIN_STATS(HEIGHT, WEIGHT, ABILITIES);
    REF_ELEMENT.classList.add('forceRow');
    setBorderBottomNavStats("pokemonMainStats");
}

function pokemonShowStats(parameter) {
    const REF_ELEMENT = document.getElementById(`${parameter}_stats`);
    REF_ELEMENT.innerHTML = POKEMON_DETAILED_STATS();
    statsGenerator(parameter);
    REF_ELEMENT.classList.remove("statsContainerAutoScroll");
    REF_ELEMENT.classList.add("statsContainerNoScroll");
    REF_ELEMENT.classList.remove('forceRow');
    setBorderBottomNavStats("pokemonSecondStats");
}

function statsGenerator(parameter) {
    const STATS_CONTAINER_REF = document.getElementById("tableOfPokemonDetailedStat");
    const ROOT_ELEMENT = document.documentElement;
    let htmlFragment = '';
    for (let i = 0; i < renderedArray[parameter].stats.length; i++) {
        const CSS_VARIABLE_NAME = `--stat_width_${i}`;
        const NAME = renderedArray[parameter].stats[i].name;
        const VALUE = renderedArray[parameter].stats[i].stat;
        const INDEX_IN_DATA = parameter;
        STATS_CONTAINER_REF.innerHTML += POKEMON_DETAILED_STATS_VALUE(NAME, i, VALUE, INDEX_IN_DATA);
        htmlFragment += POKEMON_DETAILED_STATS_VALUE(NAME, i, VALUE, INDEX_IN_DATA);
        ROOT_ELEMENT.style.setProperty(CSS_VARIABLE_NAME, `${calculatesPercent(NAME, VALUE)}%`);
    }
    STATS_CONTAINER_REF.innerHTML = htmlFragment;
}

function pokemonShowEvo(pokemonID, i) {
    const REF_ELEMENT = document.getElementById(`${i}_stats`);
    REF_ELEMENT.innerHTML = POKEMON_EVO_CHAIN();
    REF_ELEMENT.classList.remove("statsContainerNoScroll");
    REF_ELEMENT.classList.add("statsContainerAutoScroll");
    document.getElementById("pokemonEvoChainDiv").innerHTML = "";
    enableEvoChainLoading();
    pokemonShowEvoForm(pokemonID);
    REF_ELEMENT.classList.remove('forceRow');
    setBorderBottomNavStats("pokemonEvoChain");
}

async function pokemonShowEvoForm(pokemonID) {
    const EVO_CHAIN_DIV_REF = document.getElementById("pokemonEvoChainDiv");
    const EVOLUTION_NAMES = await getEvolutionChainNames(pokemonID);
    for (let i = 0; i < EVOLUTION_NAMES.length; i++) {
        const NR = i + 1;
        const NAME = capitalizeFirstLetter(EVOLUTION_NAMES[i]);
        const CURRENT_POKEMON_ID = await getPokemonID(`${NAME}`)
        const URL = getPokemonPhoto(CURRENT_POKEMON_ID);
        if (!EVO_CHAIN_DIV_REF) {
            return;
        } else {
            EVO_CHAIN_DIV_REF.innerHTML += POKEMON_EVO_CHAIN_FORM(URL, NAME, NR);
        }
    }
    disableEvoChainLoading();
}

function setBorderBottomNavStats(elementID) {
    const MAIN_STATS = document.getElementById("pokemonMainStats");
    const SECOND_STATS = document.getElementById("pokemonSecondStats");
    const EVO_CHAIN = document.getElementById("pokemonEvoChain");
    MAIN_STATS.classList.remove("activeNavStats");
    SECOND_STATS.classList.remove("activeNavStats");
    EVO_CHAIN.classList.remove("activeNavStats");
    document.getElementById(`${elementID}`).classList.add("activeNavStats");
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
    pokemonMainRender(dataFound);
    dataFound = [];
    POKEMON_LIST_REF.classList.add("pokemonListFlex");
    POKEMON_LIST_REF.innerHTML = MESSAGE[0].too_short_Pokemon_name;
    POKEMON_LIST_REF.innerHTML += BUTTON_TO_BACK();
}

function searchResult(searchChar) {
    const POKEMON_LIST_REF = document.getElementById("pokemonList");
    dataFound = DATA.filter((element) => element.name.includes(searchChar));
    pokemonMainRender(dataFound);
    if (dataFound.length == 0) {
        POKEMON_LIST_REF.classList.add("pokemonListFlex");
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
    const BACKGROUD_REF = document.getElementById(idElement);
    removeBackgroundClasses(BACKGROUD_REF);
    if (NUMBER_OF_COLORS === 2) {
        const COLOR_FIRST_COLOR = colorSearch(type[0]);
        const COLOR_SECOND_COLOR = colorSearch(type[1]);
        setColorStyle(BACKGROUD_REF, COLOR_FIRST_COLOR, COLOR_SECOND_COLOR);
    } else if (NUMBER_OF_COLORS === 1) {
        const typeName = type[0].toLowerCase();
        BACKGROUD_REF.classList.add(`bg_type_${typeName}`);
    } else {
        BACKGROUD_REF.classList.add('bg_type_default');
    }
}

function getAllTypeClasses() {
    const SINGLE_TYPE_CLASSES = [];
    BACKGROUND_COLOR.forEach(element => {
        SINGLE_TYPE_CLASSES.push(`bg_type_${element.type.toLowerCase()}`)
    });
    return ['bg_type_gradient', 'bg_type_default', SINGLE_TYPE_CLASSES];
}

function removeBackgroundClasses(element) {
    const ALL_CLASSES = getAllTypeClasses();
    element.classList.remove(...ALL_CLASSES);
    element.style.removeProperty('--color_top');
    element.style.removeProperty('--color_bottom');
}

function setColorStyle(BACKGROUD_REF, COLOR_FIRST_COLOR, COLOR_SECOND_COLOR) {
    BACKGROUD_REF.style.setProperty('--color_top', COLOR_FIRST_COLOR);
    BACKGROUD_REF.style.setProperty('--color_bottom', COLOR_SECOND_COLOR);
    BACKGROUD_REF.classList.add('bg_type_gradient');
}

function openDialog(parameter) {
    dialogRef = document.getElementById("myDialog");
    if (parameter == "LOADING") {
        dialogRef.innerHTML = LOADING_IMG();
        dialogRef.classList.add("opened");
        dialogRef.classList.add("dialogLoadingStyle");
    } else if (parameter != "LOADING") {
        openDialogWithPokemonStats(parameter);
    }
    document.body.classList.remove("overflowStyleAuto");
    document.body.classList.add("overflowStyleClip");
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
    pokemonWindowBackgroundColor(renderedArray[parameter].types, `${parameter}_img`);
    addingPokemonTypeImg(`${parameter}_types`, parameter);
    navArrowsHide();
}

function navArrowsHide() {
    const LEFT_ARROW_REF = document.getElementById("arrowLeft");
    const RIGHT_ARROW_REF = document.getElementById("arrowRight");
    if (renderedArray.length == 1) {
        LEFT_ARROW_REF.classList.add("hidden");
        RIGHT_ARROW_REF.classList.add("hidden");
    } else {
        LEFT_ARROW_REF.classList.remove("hidden");
        RIGHT_ARROW_REF.classList.remove("hidden");
    }
}

function closeDialog() {
    dialogRef.close();
    dialogRef.innerHTML = "";
    dialogRef.classList.remove("opened");
    dialogRef.classList.remove("dialogLoadingStyle");
    document.body.classList.remove("overflowStyleClip");
    document.body.classList.add("overflowStyleAuto");
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
        }
    }
    return "#FFFFFF";
}

function typeImgSearch(type) {
    for (let i = 0; i < TYPES_IMG.length; i++) {
        if (type == TYPES_IMG[i].type) {
            return TYPES_IMG[i].url;
        }
    }
    return "";
}

function addingPokemonTypeImg(idElement, index) {
    const POKEMON_TYPE_IMG_REF = document.getElementById(`${idElement}`);
    const NUMBER_OF_TYPES = renderedArray[index].types.length;
    for (let i = 0; i < NUMBER_OF_TYPES; i++) {
        POKEMON_TYPE_IMG_REF.innerHTML += `<img src="${typeImgSearch(renderedArray[index].types[i])}" alt="">`
    }
}

function enableLoadingSpinner() {
    const BUTTON_FOR_MORE_REF = document.getElementById("button_for_more");
    if (BUTTON_FOR_MORE_REF != null) {
        BUTTON_FOR_MORE_REF.classList.add("hidden");
    }
    openDialog("LOADING");
}

function disableLoadingSpinner() {
    const BUTTON_FOR_MORE_REF = document.getElementById("button_for_more");
    BUTTON_FOR_MORE_REF.classList.remove("hidden");
    closeDialog();
}

function nextPokemon(value) {
    const result = value + 1;
    if (result >= renderedArray.length) {
        return 0;
    } else {
        return result;
    }
}

function prevPokemon(value) {
    const result = value - 1;
    if (result < 0) {
        return renderedArray.length - 1;
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
    while (currentChain && (currentChain.evolves_to.length <= 2)) {
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
    if (renderedArray[i].gif == null) {
        return renderedArray[i].foto;
    } else {
        return renderedArray[i].gif;
    }
}

function enableEvoChainLoading() {
    document.getElementById("pokemonMainStats").classList.add("disabledNav");
    document.getElementById("pokemonSecondStats").classList.add("disabledNav");
    document.getElementById("pokemonEvoChain").classList.add("disabledNav");
    document.getElementById("pokemonEvoChainDiv").innerHTML = LOADING_IMG();
}

function disableEvoChainLoading() {
    const EVO_CHAIN_DIV_REF = document.getElementById("pokemonEvoChainDiv");
    if (!EVO_CHAIN_DIV_REF) {
        return;
    } else {
        document.getElementById("pokemonMainStats").classList.remove("disabledNav");
        document.getElementById("pokemonSecondStats").classList.remove("disabledNav");
        document.getElementById("pokemonEvoChain").classList.remove("disabledNav");
        document.getElementById("myLoadIMG").remove();
    }
}