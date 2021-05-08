let apiPreUrl = 'https://pokeapi.co/api/v2/';

let pokemonSelected = false;
let currentPageOpen = 0;

function init() {
    createTemplatePokemonImgs();
    showPage(0);
}


function createTemplatePokemonImgs() {
    let previewContainer = document.getElementById('preview-container');
    // create 5 pages container for pokemons
    for (let p = 0; p < 5; p++) {
        let pageContainer = document.createElement('div');
        pageContainer.id = 'page-container-' + p;
        pageContainer.setAttribute('must-load-pokemons', true);
        pageContainer.classList.add('page-container');
        previewContainer.appendChild(pageContainer);

        // create 30 img for pokemons
        for (let i = 0; i < 30; i++) {
            let pokemonId = i + (p * 30 + 1);
            let img = getImgTemplate(pokemonId);
            pageContainer.appendChild(img);
        }
    }
}

function getImgTemplate(id) {
    // return pokemon small img template
    let img = document.createElement('img');
    img.id = 'pokemon-id-' + id;
    img.classList.add('preview-img');
    img.setAttribute('pokemon-id', id);
    img.onmousemove = onMouseOverImg;
    img.onmouseout = setDefaultPreview;
    img.onclick = showPokemonDetails;
    return img;
}

function onMouseOverImg() {
    // set values from Pokemon on mouse over the pokemon small img
    if (pokemonSelected) { // if selected -> do nothing
        return;
    }
    // set parameter from img (>this< is the triggering img ) for detail
    document.getElementById('big-pokemon-img').src = this.src;
    document.getElementById('detail-name').innerHTML = this.getAttribute('pokemon-name');
    document.getElementById('detail-id').innerHTML = this.getAttribute('pokemon-id');
    document.getElementById('detail-hp').innerHTML = this.getAttribute('pokemon-hp');
    document.getElementById('detail-atk').innerHTML = this.getAttribute('pokemon-atk');
    document.getElementById('detail-def').innerHTML = this.getAttribute('pokemon-def');
    document.getElementById('detail-spec-atk').innerHTML = this.getAttribute('pokemon-spec-atk');
    document.getElementById('detail-spec-def').innerHTML = this.getAttribute('pokemon-spec-def');
    document.getElementById('detail-speed').innerHTML = this.getAttribute('pokemon-speed');
    document.getElementById('progress-hp').value = this.getAttribute('pokemon-hp');
    document.getElementById('progress-atk').value = this.getAttribute('pokemon-atk');
    document.getElementById('progress-def').value = this.getAttribute('pokemon-def');
    document.getElementById('progress-spec-atk').value = this.getAttribute('pokemon-spec-atk');
    document.getElementById('progress-spec-def').value = this.getAttribute('pokemon-spec-def');
    document.getElementById('progress-speed').value = this.getAttribute('pokemon-speed');
}

function setDefaultPreview() {
    if (pokemonSelected) { // if selected -> do nothing
        return;
    }
    document.getElementById('big-pokemon-img').src = './img/pokemon-ball.png';
    document.getElementById('detail-name').innerHTML = '';
    document.getElementById('detail-id').innerHTML = '';
}

function showPokemonDetails() {
    //close overview and open detailsview
    pokemonSelected = true;
    document.getElementById('preview-container').classList.add('height-0');
    document.getElementById('detail-info-box').classList.remove('height-0');
    document.getElementById('page-nav-bar').classList.add('d-none');
    document.getElementById('detail-nav-bar').classList.remove('d-none');
}

function closePokemonDetails() {
    //close detailview and open overview
    pokemonSelected = false;
    document.getElementById('preview-container').classList.remove('height-0');
    document.getElementById('detail-info-box').classList.add('height-0');
    document.getElementById('page-nav-bar').classList.remove('d-none');
    document.getElementById('detail-nav-bar').classList.add('d-none');
    setDefaultPreview();
}

function previewPage() {
    currentPageOpen--;
    showPage(currentPageOpen);
}

function nextPage() {
    currentPageOpen++;
    showPage(currentPageOpen);
}

function showPage(page) {
    // show current page and hidden all other
    currentPageOpen = page;
    for (let p = 0; p < 5; p++) {
        let pageContainer = document.getElementById('page-container-' + p);
        if (p == currentPageOpen) {
            pageContainer.classList.remove('d-none');
        } else {
            pageContainer.classList.add('d-none');
        }
    }
    hiddenPreviewButtonIfFirstPage();
    hiddenNextButtonIfLasttPage();
    loadImgInPagesContainer(); // load pokemon -> from -1 to +1 from current page
    
}

function hiddenPreviewButtonIfFirstPage() {
    if (currentPageOpen == 0) {
        document.getElementById('preview-button').classList.add('d-none');
    } else {
        document.getElementById('preview-button').classList.remove('d-none');
    }
}

function hiddenNextButtonIfLasttPage() {
    if (currentPageOpen == 4) {
        document.getElementById('next-button').classList.add('d-none');
    } else {
        document.getElementById('next-button').classList.remove('d-none');
    }
}

async function loadImgInPagesContainer() {
    // load pokemon -> from -1 to +1 from current page
    for (let i = currentPageOpen-1; i < currentPageOpen+2; i++) {
        let pageContainer = document.getElementById('page-container-' + i);
        // when page exist and must load from pokemon api then load for all pokemon in page
        if (pageContainer && pageContainer.getAttribute('must-load-pokemons')) {
            pageContainer.setAttribute('must-load-pokemons', '');
            let imgsArray = pageContainer.childNodes;
            for (let j = 0; j < imgsArray.length; j++) {
                let img = imgsArray[j];
                let id = img.getAttribute('pokemon-id');
                let pokemonJson = await getLoadedPokemonById(id);
                setPokemonImgFromJson(img, pokemonJson);
            }
        }
    }
}

function setPokemonImgFromJson(img, json) {
    // set values for the pokemon
    img.setAttribute('pokemon-name', json['name'].toUpperCase());
    img.setAttribute('pokemon-hp', json['stats'][0]['base_stat']);
    img.setAttribute('pokemon-atk', json['stats'][1]['base_stat']);
    img.setAttribute('pokemon-def', json['stats'][2]['base_stat']);
    img.setAttribute('pokemon-spec-atk', json['stats'][3]['base_stat']);
    img.setAttribute('pokemon-spec-def', json['stats'][4]['base_stat']);
    img.setAttribute('pokemon-speed', json['stats'][5]['base_stat']);
    img.src = json['sprites']['front_default'];
}

async function getLoadedPokemonById(loadId) {
    // load pokemon from api and return as json
    let url = apiPreUrl + 'pokemon/' + loadId; // complete url for the pokemon
    let response = await fetch(url);
    let responsoAsJson = await response.json();
    return responsoAsJson;
}