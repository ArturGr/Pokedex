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

const DIALOG_WINDOW = () => `
            <dialog id="myDialog">
                <header>
                    <h2>test</h2>
                </header>
                <section>
                    test
                </section>
                <footer>
                    test
                </footer>
            </dialog>
`;

const BUTTON_TO_LOAD_MORE = (pokemonAmount) => `
    <button class="button_for_more" onclick="load(20, ${pokemonAmount})">Load more</button>
`;