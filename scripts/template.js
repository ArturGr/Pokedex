const POKEMON_FIRST_WINDOW = (i, name) => `
            <div class="pokemonRender" id="pokemonRender${DATA[i].id}" onclick="pokemonShowWindowStats(${i})">
                <div class="pokemonHeader">
                    <h2>#${DATA[i].id}</h2>
                    <h2>${name}</h2>
                </div>
                <div class="pokemonMain" id="pokemonMain${DATA[i].id}">
                    <img src="${DATA[i].foto}" alt="Image of ${DATA[i].name}">
                </div>
                <div class="pokemonFooter" id="pokemonImgFooter${DATA[i].id}">

                </div>
            </div>
`;

const DIALOG_WINDOW = (i) => `
                <header>
                    <h2>#${DATA[i].id}</h2>
                    <h2>${capitalizeFirstLetter(DATA[i].name)}</h2>
                </header>
                <main class="myDialog_main">
                    <section class="myDialog_sectionImg">
                        <div class="image" id="${i}_img">
                        <img src="${DATA[i].gif}" alt="Image of ${DATA[i].name}">
                        </div>
                        <div class="types" id="${i}_types">
                        </div>
                    </section>
                    <section class="myDialog_sectionNav">
                        <nav>
                            <li onclick="pokemonShowMain(${i})">main</li>
                            <li onclick="pokemonShowStats(${i})">stats</li>
                            <li onclick="pokemonShowEvo(${i})">evo chain</li>
                        </nav>
                    </section>
                    <section class="myDialog_sectionStats" id="${i}_stats">
                    </section>
                </main>
                <footer>
                    <img src="./assets/img/LeftArrow.png" alt="vorheriges Pokemon" onclick="openDialog(PrevPokemon(${i}))">
                    <img src="./assets/img/RightArrow.png" alt="nächstes Pokemon" onclick="openDialog(NextPokemon(${i}))">
                </footer>
`;

const BUTTON_TO_LOAD_MORE = (pokemonAmount) => `
    <button class="button_for_more" id="button_for_more" onclick="load(20, ${pokemonAmount})">Load more</button>
`;

const LOADING_IMG = () => `
    <img src="./assets/img/Loading.png" alt="Loading animation" id="myLoadIMG">
`;

const POKEMON_MAIN_STATS = (HEIGHT, WEIGHT, ABILITIES) => `
    <table>
        <tr>
            <td>Height</td>
            <td>: ${HEIGHT} cm</td>
        </tr>
        <tr>
            <td>Weight</td>
            <td>: ${WEIGHT} kg</td>
        </tr>
        <tr>
            <td>Abilities</td>
            <td>:${ABILITIES}</td>
        </tr>
    </table>
`;

const POKEMON_DETAILED_STATS = () => `

`;

const POKEMON_EVO_CHAIN = () => `

`;