/* VARIABLES */
const urlBase = 'https://api.pexels.com/v1';
const searchInput = document.querySelector("input");
const btnImageSearch = document.querySelector("#btnImageSearch");
const btnOrientation = document.querySelector("#btnOrientation");
const gallery = document.querySelector(".gallery");
const btnLeft = document.querySelector("#btnLeft");
const btnRight = document.querySelector("#btnRight");
const btnCategories = document.querySelector('#btnCategories')
const pagination = document.querySelector('.pagination')

/* EVENTOS */
btnCategories.addEventListener('click', (ev) => {
    const button = ev.target.closest('BUTTON');
    if (button) {
        const texTag = button.innerText;
        drawImages(texTag, 1)
    }
})

btnImageSearch.addEventListener('click', (ev) => {
    //ev.preventDefault();
    const searchText = searchInput.value;
    //console.log(searchText)
    drawImages(searchText, 1)
});

btnOrientation.addEventListener('change', () => {
    const key = gallery.dataset.key;
    if (key !== '') drawImages(key, 1)
})

pagination.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'BUTTON') {
        const page = parseInt(ev.target.dataset.page);
        console.log(page)
        console.log(gallery.dataset.key)
        drawImages(gallery.dataset.key, page)

    }
})

/* FUNCIONES*/
const conection = async (action, page = 1, perPage = 10) => {
    try {
        const resp = await fetch(`${urlBase}/${action}&page=${page}&per_page=${perPage}`, {
            headers: {
                Authorization: 'Av9UYixj2OarcBJnjGlK75gMv8apHHKAxXd0re2k7WpLfHzDKPLfji17'
            }
        });
        if (resp.ok) {
            return resp.json()
        } else {
            throw Error("Error en la peticion")
        }
    } catch (error) {
        throw (error.message)
    }
}

const drawInitialImages = async () => {
    const arrayBotones = [
        {
            categoria: 'reptiles',
            id: '2078809'
        },
        {
            categoria: 'roedores',
            id: '51340',
        },
        {
            categoria: 'felinos',
            id: '16020397'
        }
    ]
    try {
        let fragment = document.createDocumentFragment();
        for (let { categoria, id } of arrayBotones) {
            const resp = await conection(`photos/${id}`)
            let button = document.createElement('BUTTON')
            let container = document.createElement("DIV")
            let img = document.createElement("IMG");
            img.src = resp.src.small;
            img.alt = resp.alt;
            button.innerText = categoria
            button.type = 'button'
            container.append(img);
            button.append(container)
            fragment.append(button)
        }
        btnCategories.append(fragment)
    } catch (error) {
        throw (error.message)
    }
};

const drawImages = async (action, page) => {
    try {
        gallery.dataset.key = action
        gallery.innerHTML = ``;
        const fragment = document.createDocumentFragment()
        //console.log(btnOrientation.value)
        const resp = await conection(`search?query=${action}&orientation=${btnOrientation.value}, page`);
        resp.photos.forEach(({ src, alt }) => {
            let container = document.createElement('DIV')
            let img = document.createElement("IMG");
            img.src = src.medium;
            img.alt = alt;
            container.append(img)
            fragment.append(container);
        });
        gallery.append(fragment)
        drawPagination(resp, page)
    } catch (error) {
        throw (error.message)
    }
}
const drawPagination = (resp, currentPage) => {
    pagination.innerHTML = ''
    const totalPages = Math.ceil(resp.total_results / resp.per_page)
    console.log(totalPages)
    const maxButtons = 5;
    let firstPage = (currentPage - 2)
    let lastPage = (currentPage + 2)
    if (currentPage <= 3) {
        if (totalPages <= maxButtons) {
            lastPage = totalPages;
        } else {
            lastPage = maxButtons;
        }
        firstPage = 1
    }
    if (lastPage > totalPages) {
        lastPage = totalPages;
    }
    for (let i = firstPage; i <= lastPage; i++) {
        const button = document.createElement('BUTTON')
        button.innerText = i
        button.dataset.page = i
        pagination.append(button);
    }

}
drawInitialImages();

