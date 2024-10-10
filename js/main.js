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
    try {
        const responses = [
            await conection("photos/51340"),
            await conection("photos/28826036"),
            await conection("photos/2078809")
        ]
        const buttons = [btnRodens, btnFelines, btnReptiles];
        responses.forEach((item, index) => {
            const { src, alt } = item;
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