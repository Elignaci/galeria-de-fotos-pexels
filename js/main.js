/* VARIABLES */
// URL base de la api
const urlBase = 'https://api.pexels.com/v1';
// API key para la autenticacion
const apiKey = 'Av9UYixj2OarcBJnjGlK75gMv8apHHKAxXd0re2k7WpLfHzDKPLfji17'

// Elementos del DOM
const searchInput = document.querySelector("input");
const btnImageSearch = document.querySelector("#btnImageSearch");
const btnOrientation = document.querySelector("#btnOrientation");
const gallery = document.querySelector(".gallery");
const gallerySection = document.querySelector("#gallerySection");
const btnLeft = document.querySelector("#btnLeft");
const btnRight = document.querySelector("#btnRight");
const btnCategories = document.querySelector('#btnCategories');
const pagination = document.querySelector('.pagination');

/* EVENTOS */
// Evento para cargar las imagenes cuando se hace click en una categoria
btnCategories.addEventListener('click', (ev) => {
    const button = ev.target.closest('BUTTON');
    if (button) drawImages(button.innerText, 1);
});

// Evento para buscar imagenes al hacer click en la lupa
btnImageSearch.addEventListener('click', () => {
    const searchText = searchInput.value.trim();
    const regex = /^[a-zA-Z0-9 ]+$/;
    regex.test(searchText) ? 
    drawImages(searchText, 1) : 
    createErrorMessage("Introduce solo caracteres alfanuméricos.");
});

// Evento para cambiar la orientacion de las imagenes
btnOrientation.addEventListener('change', () => {
    const key = gallery.dataset.key;
    if (key) drawImages(key, 1);
});

// Evento para manejar la paginacion de las imagenes en gallery
pagination.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'BUTTON') {
        const page = parseInt(ev.target.dataset.page);
        drawImages(gallery.dataset.key, page);
    }
});

/* FUNCIONES*/
/**
 * Crea un mensaje de error y lo muestra en el elemento gallerySection
 * @param {string} message - El mensaje de error
 */
const createErrorMessage = (message) => {
    clearErrorMessage();
    const div = document.createElement('DIV');
    div.classList.add('error');
    div.innerText = message;
    gallerySection.append(div);
};

/**
 * Limpia el mensaje de error actual, si se ha mostrado previamente un 
 * mensaje de error
 */
const clearErrorMessage = () => {
    const actualErrorMessage = gallerySection.querySelector('.error');
    if (actualErrorMessage) actualErrorMessage.remove();
};

/**
 * Realiza la llamada a la api de Pexels.
 * @param {string} action - La accion a realizar (ej. buscar fotos o una foto unica)
 * @returns {Object} - La respuesta de la API en formato JSON
 */
const conection = async (action) => {
    try {
        const resp = await fetch(`${urlBase}/${action}`, {
            headers: { Authorization: apiKey }
        });
        if (!resp.ok) throw Error("Error en la peticion");
        return resp.json();
    } catch (error) {
        throw (error.message);
    }
};

/**
 * Crea un elemento de imagen y lo añade a un contenedor div
 * @param {string} src - La url de la imagen
 * @param {string} alt - El contenedor con la imagen
 * @returns {HTMLElement} - El contenedor con la imagen
 */
const createImgElement = (src, alt) => {
    const container = document.createElement('DIV');
    const img = document.createElement("IMG");
    img.src = src;
    img.alt = alt;
    container.append(img);
    return container;
};

/**
 * Dibuja las imagenes inciales segun las categorias definidas en arrayBotones
 */
const drawInitialImages = async () => {
    const arrayBotones = [
        { category: 'reptiles', id: '2078809' },
        { category: 'roedores', id: '51340' },
        { category: 'felinos', id: '16020397'}
    ];

    try {
        const fragment = document.createDocumentFragment();
        for (const { category, id } of arrayBotones) {
            const resp = await conection(`photos/${id}`);
            const button = document.createElement('BUTTON');
            button.innerText = category;
            button.type = 'button';
            button.append(createImgElement(resp.src.small, resp.alt));
            fragment.append(button);
        }
        btnCategories.append(fragment);
    } catch (error) {
        createErrorMessage(`Error al cargar imágenes iniciales: ${error.message}`);
    }
};

/**
 * Dibuja las imagenes en la galeria segun la busqueda y la pagina seleccionada
 * @param {string} action - La consulta de la busqueda
 * @param {number} page - El numero de la pagina a mostrar
 */
const drawImages = async (action, page) => {
    try {
        clearErrorMessage();
        gallery.dataset.key = action;
        pagination.innerHTML = ``;
        gallery.innerHTML = ``;

        const orientation = btnOrientation.value;
        const resp = await conection(`search?query=${action}&orientation=${orientation}&page=${page}`);
        if (resp.photos.length > 0) {
            const fragment = document.createDocumentFragment();
            resp.photos.forEach(({ src, alt }) => {
                fragment.append(createImgElement(src.medium, alt));
            });
            gallery.append(fragment);
            drawPagination(resp, page);
        } else {
            createErrorMessage("No se encontraron resultados.");
        }
    } catch (error) {
        createErrorMessage(`Error al cargar imágenes: ${error.message}`);
    }
};

/**
 * Dibuja los botones de la paginacion segun el numero total de los resultados obtenidos
 * @param {Object} resp - La respuesta de la API que tiene los datos de las imagenes encontradas
 * @param {number} currentPage - La pagina actual
 */
const drawPagination = (resp, currentPage) => {
    pagination.innerHTML = ''
    const totalPages = Math.ceil(resp.total_results / resp.per_page)
    const maxButtons = 5;

    let firstPage = (currentPage - 2)
    let lastPage = (currentPage + 2)

    // Ajustamos la pagina inicial y final para que esten en los limites
    if (firstPage < 1) firstPage = 1;
    if (lastPage > totalPages) lastPage = totalPages;

    const fragment = document.createDocumentFragment();

    // Boton para ir a la primera pagina
    const btnFirstPage = document.createElement('BUTTON');
    btnFirstPage.innerText = '<<'; 
    btnFirstPage.dataset.page = 1; 
    fragment.append(btnFirstPage); 

    // Añadir 3 puntitos si hay paginas anteriores
    if (firstPage > 1) {
        const dotsBefore = document.createElement('SPAN');
        dotsBefore.innerText = '...';
        fragment.append(dotsBefore);
    }

    // Crear los botones de las paginas
    for (let i = firstPage; i <= lastPage; i++) {
        const button = document.createElement('BUTTON');
        button.innerText = i;
        button.dataset.page = i;
        fragment.append(button);
    }

    // Añade 3 puntitos si hay paginas posteriores
    if (lastPage < totalPages) {
        const dotsAfter = document.createElement('SPAN');
        dotsAfter.innerText = '...';
        fragment.append(dotsAfter);
    }

    // Boton para ir a la ultima pagina
    const btnLastPage = document.createElement('BUTTON');
    btnLastPage.innerText = '>>'; 
    btnLastPage.dataset.page = totalPages; 
    fragment.append(btnLastPage); 

    pagination.append(fragment);
};

// Llamada a la funcion para dibujar las imagenes iniciales
drawInitialImages();

