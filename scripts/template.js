const POKEMON_FIRST_WINDOW = (i, name) => `
    <div class="pokemonRender" id="pokemonRender${renderedArray[i].id}" onclick="pokemonShowWindowStats(${i})">
        <div class="pokemonHeader">
            <h2>#${renderedArray[i].id}</h2>
            <h2>${name}</h2>
        </div>
        <div class="pokemonMain" id="pokemonMain${renderedArray[i].id}">
            <img src="${renderedArray[i].foto}" alt="Image of ${renderedArray[i].name}">
        </div>
        <div class="pokemonFooter" id="pokemonImgFooter${renderedArray[i].id}">
        </div>
    </div>
`;

const DIALOG_WINDOW = (i) => `
    <header>
        <h2>#${renderedArray[i].id}</h2>
        <h2>${capitalizeFirstLetter(renderedArray[i].name)}</h2>
        <img src="./assets/img/Close.png" alt="Close" onclick="closeDialog()">
    </header>
    <main class="myDialog_main">
        <section class="myDialog_sectionImg">
            <div class="image" id="${i}_img">
                <img src="${dataGifVeryfication(i)}" alt="Image of ${renderedArray[i].name}">
            </div>
            <div class="types" id="${i}_types">
            </div>
        </section>
        <section class="myDialog_sectionNav">
            <nav>
                <li onclick="pokemonShowMain(${i})" id="pokemonMainStats">main</li>
                <li onclick="pokemonShowStats(${i})" id="pokemonSecondStats">stats</li>
                <li onclick="pokemonShowEvo(${renderedArray[i].id}, ${i})" id="pokemonEvoChain">evo chain</li>
            </nav>
        </section>
        <section class="myDialog_sectionStats" id="${i}_stats">
        </section>
    </main>
    <footer>
        <img src="./assets/img/LeftArrow.png" alt="vorheriges Pokemon" id="arrowLeft" onclick="openDialog(prevPokemon(${i}))">
        <img src="./assets/img/RightArrow.png" alt="nächstes Pokemon" id="arrowRight" onclick="openDialog(nextPokemon(${i}))">
    </footer>
`;

const BUTTON_TO_LOAD_MORE = (pokemonAmount) => `
    <div>
        <button class="button_for_more" id="button_for_more" onclick="load(20, ${pokemonAmount})">Load more</button>
    </div>
`;

const BUTTON_TO_BACK = () => `
    <div>
        <button class="button_for_more" id="button_for_more" onclick="pokemonMainRender()">Back</button>
    </div>
`;

const LOADING_IMG = () => `
    <img src="./assets/img/Loading.png" alt="Loading animation" id="myLoadIMG">
`;

const POKEMON_MAIN_STATS = (HEIGHT, WEIGHT, ABILITIES) => `
    <table>
        <tbody>
            <tr>
                <td width="20%">Height</td>
                <td width="80%">: ${HEIGHT} cm</td>
            </tr>
            <tr>
                <td>Weight</td>
                <td>: ${WEIGHT} kg</td>
            </tr>
            <tr>
                <td>Abilities</td>
                <td>:${ABILITIES}</td>
            </tr>
        </tbody>
    </table>
`;

const POKEMON_DETAILED_STATS = () => `
    <table>
        <tbody id="tableOfPokemonDetailedStat">
        </tbody>
    </table>
`;

const POKEMON_DETAILED_STATS_VALUE = (NAME, i, VALUE, INDEX_IN_DATA) => `
    <tr>
        <td width="40%">${capitalizeFirstLetter(NAME)}</td>
        <td width="100%" class="tooltip" onmouseover="shwoToolTip('${NAME}', ${VALUE}, ${i}, ${INDEX_IN_DATA})" onmouseout="closeToolTip(${i}, ${INDEX_IN_DATA})">
            <div class="progress_bar_background" id="progress_bar_background_${i}">
                <div class="progress_bar_value" id="${i}_progress_bar_value"></div>
            </div>
            <div id="tooltip_${i}"></div>
        </td>
    </tr>
`;

const POKEMON_EVO_CHAIN = () => `
    <div class="evo_chain" id="pokemonEvoChainDiv"></div>
`;

const POKEMON_EVO_CHAIN_FORM = (url, name, i) => `
    <div class="evo_chain_contPic">
        <img src="${url}" alt="${name}">
        <p>${i}. ${name}</p>
    </div>
`;

const TOOLTIP = (parametr, value, i, indexInDATA) => `
    <span class="tooltiptext">
        <p>${capitalizeFirstLetter(parametr)} of ${capitalizeFirstLetter(renderedArray[indexInDATA].name)} is ${value}.</p>
        <p>Pokemon with the highest ${parametr} is ${capitalizeFirstLetter(POWERFULL_POKEMON[i].name)} (${POWERFULL_POKEMON[i].value}).</p>
    </span>
`;