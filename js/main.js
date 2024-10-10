/* VARIABLES */
const urlBase = 'https://api.pexels.com/v1';
const searchInput = document.querySelector("input");
const btnOrientation = document.querySelector("select");
const btnRodens = document.querySelector("#btnRodens");
const btnFelines = document.querySelector("#btnFelines");
const btnReptiles = document.querySelector("#btnReptiles");
const gallery = document.querySelector(".gallery");
const btnLeft = document.querySelector("#btnLeft");
const btnRight = document.querySelector("#btnRight");
const btnCategories = document.querySelector('#btnCategories')

/* EVENTOS */
btnCategories.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'BUTTON') {

        const texTag = ev.target.id;
        console.log(texTag)
    }


})




/* FUNCIONES*/
const conection = async (action) => {
    try {
        const resp = await fetch(`${urlBase}/${action}`, {
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
    const arrayBtones = [
        {
            categoria: 'reptiles',
            id: '2078809'
        },
        {
            categoria: 'roedores',
            id: '28826036',
        },
        {
            categoria: 'felinos',
            id: '51340'

        }
    ]

    try {


        arrayBtones.forEach(async ({ categoria, id }) => {
            const { alt, src } = await conection(`photos/${id}`)
            let img = document.createElement("IMG");
            img.src = src.original;
            img.alt = alt;
            buttons[index].append(img);

        });
    } catch (error) {
        throw (error.message)
    }
};

const drawImages = async (action) => {
    try {
        const resp = await conection(action);
        resp.photos.forEach(({ src, alt }) => {
            let img = document.createElement("IMG");
            img.src = src.original;
            img.alt = alt;
            gallery.append(img);
        });
    } catch (error) {
        throw (error.message)
    }
};

drawInitialImages();

