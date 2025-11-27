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
                            <li>main</li>
                            <li>stats</li>
                            <li>evo chain</li>
                        </nav>
                    </section>
                    <section class="myDialog_sectionStats" id="">
                    </section>
                </main>
                <footer>

                </footer>
`;

const BUTTON_TO_LOAD_MORE = (pokemonAmount) => `
    <button class="button_for_more" id="button_for_more" onclick="load(20, ${pokemonAmount})">Load more</button>
`;

const LOADING_IMG = () => `
    <img src="./assets/img/Loading.png" alt="Loading animation" id="myLoadIMG">
`;