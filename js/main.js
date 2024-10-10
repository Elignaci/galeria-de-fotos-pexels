/* VARIABLES */
const urlBase = 'https://api.pexels.com/v1';
const searchInput = document.querySelector("input");
const btnOrientation = document.querySelector("select");
const btnRodens = document.querySelector("#btnRodens");
const btnFelines = document.querySelector("#btnFelines");
const btnReptiles = document.querySelector("#btnReptiles");
const galery = document.querySelector(".galery");
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


conection()