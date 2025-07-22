import { Casilla, cromosomaDoradoNoRepetidos, cargarGenesDesdeAPI, mezclar } from "./utils.js";

const botonCrearCromosoma = document.getElementById("crearCromosoma");
const botonGenerarCromosomaDorado = document.getElementById("generarCromosomaDorado");
botonGenerarCromosomaDorado.addEventListener("click", generarCromosomaDorado);
const asociarCasilla = document.getElementById("asociarCasillas");
const insertarCasilla = document.getElementById("insertarCasilla");

var cromosomaCeldas = document.querySelectorAll(".cromosoma-cell");

var agregarCasilla = false;
var primeraCasilla = null;
var unirCasilla = false;

var anchoCromosomaValue = 0;
var altoCromosomaValue = 0;

var cromosoma = {};

botonCrearCromosoma.addEventListener("click", () => {
    anchoCromosomaValue = parseInt(document.getElementById("cromosomaAncho").value);
    altoCromosomaValue = parseInt(document.getElementById("cromosomaAlto").value);
    crearCromosoma(anchoCromosomaValue, altoCromosomaValue);

    console.log(`Cromosoma creado con ancho: ${anchoCromosomaValue} y alto: ${altoCromosomaValue}`);

});

function botonesAsociarInsertar(auxAgregar, auxUnir) {
    primeraCasilla = null;
    if (auxAgregar) {
        asociarCasilla.classList.remove("presionado");
        unirCasilla = false; 
        return;
    }
    if (auxUnir) {
        insertarCasilla.classList.remove("presionado");
        agregarCasilla = false; 
        return;
    }
}

insertarCasilla.addEventListener("click", () => {
    agregarCasilla = insertarCasilla.classList.toggle("presionado"); 
    botonesAsociarInsertar(true, false);
    console.log(`Agregar Casilla: ${agregarCasilla}`);
});

asociarCasilla.addEventListener("click", () => {
    unirCasilla = asociarCasilla.classList.toggle("presionado");
    botonesAsociarInsertar(false, true);
    console.log(`Unir Casilla: ${unirCasilla}`);
});

const crearCromosoma = (ancho, alto) => {
    cromosoma = {};
    const matrizCromosoma = document.getElementById("matrizCromosoma");
    let auxiliar = "";
    for (let i = 0; i < alto; i++) {
        auxiliar += `<div class="cromosoma-row">`;
        for (let j = 0; j < ancho; j++) {
            auxiliar += `<div class="cromosoma-cell"></div>`;
        }
        auxiliar += `</div>`;
    }
    matrizCromosoma.innerHTML = auxiliar;
    cromosomaCeldas = document.querySelectorAll(".cromosoma-cell");
    console.log(cromosomaCeldas);
    
    celdasListener();
};


function juntarCasilla(index, indexDestino, casilla) {
    if (index - anchoCromosomaValue === indexDestino) {
        if (casilla.conectarCasilla(0, cromosoma[indexDestino])) {
            cromosomaCeldas[index].classList.add("conectado", "up");
            cromosomaCeldas[indexDestino].classList.add("conectado", "down");
            console.log(`Conectando casilla desde arriba ${index} con ${indexDestino}`);
        } else {
            cromosomaCeldas[index].classList.remove("conectado", "up");
            cromosomaCeldas[indexDestino].classList.remove("conectado", "down");
            console.log(`Desconectado casilla desde arriba ${index} con ${indexDestino}`);
        }
        return true;
    }
    if (index + anchoCromosomaValue === indexDestino) {
        if (casilla.conectarCasilla(2, cromosoma[indexDestino])) {
            cromosomaCeldas[index].classList.add("conectado", "down");
            cromosomaCeldas[indexDestino].classList.add("conectado", "up");
            console.log(`Conectando casilla desde abajo ${index} con ${indexDestino}`);
        } else {
            cromosomaCeldas[index].classList.remove("conectado", "down");
            cromosomaCeldas[indexDestino].classList.remove("conectado", "up");
            console.log(`Desconectado casilla desde abajo ${index} con ${indexDestino}`);
        }
        return true;
    }
    if (index - 1 === indexDestino && index % anchoCromosomaValue !== 0) {
        if (casilla.conectarCasilla(3, cromosoma[indexDestino])) {
            cromosomaCeldas[index].classList.add("conectado", "left");
            cromosomaCeldas[indexDestino].classList.add("conectado", "right");
            console.log(`Conectando casilla desde la izquierda ${index} con ${indexDestino}`);
        } else {
            cromosomaCeldas[index].classList.remove("conectado", "left");
            cromosomaCeldas[indexDestino].classList.remove("conectado", "right");
            console.log(`Desconectado casilla desde la izquierda ${index} con ${indexDestino}`);
        }
        return true;
    }
    if (index + 1 === indexDestino && (index + 1) % anchoCromosomaValue !== 0) {
        if (casilla.conectarCasilla(1, cromosoma[indexDestino])) {
            cromosomaCeldas[index].classList.add("conectado", "right");
            cromosomaCeldas[indexDestino].classList.add("conectado", "left");
            console.log(`Conectando casilla desde la derecha ${index} con ${indexDestino}`);
        } else {
            cromosomaCeldas[index].classList.remove("conectado", "right");
            cromosomaCeldas[indexDestino].classList.remove("conectado", "left");
            console.log(`Desconectado casilla desde la derecha ${index} con ${indexDestino}`);   
        }
        return true;
    }
    return false;
}

function celdasListener() {
    cromosomaCeldas.forEach((celda, index) => {
        celda.addEventListener("click", () => {
            if (unirCasilla) {
                if (primeraCasilla === null) {
                    primeraCasilla = index;
                    console.log(`Primera casilla seleccionada: ${primeraCasilla}`);
                } else {
                    if (primeraCasilla === index) {
                        console.log("No se puede asociar una casilla consigo misma.");
                        primeraCasilla = null;
                        return;
                    }
                    const casillaActual = cromosoma[primeraCasilla];
                    const casillaDestino = cromosoma[index];
                    if (casillaActual && casillaDestino) {
                        if (juntarCasilla(primeraCasilla, index, casillaActual)) {
                            console.log("Conexion exitosa entre casillas.");
                        } else {
                            console.log("No se puede unir las casillas, no están adyacentes.");
                        }
                    } else {
                        console.log("Una de las casillas no existe.");
                    }
                    primeraCasilla = null;
                }
                return;
            }
            if (agregarCasilla) {
                if (celda.classList.contains("casilla")) {
                    console.log(`Casilla ya existe en el índice: ${index}`);
                    return;
                }
                cromosoma[index] = new Casilla();
                celda.style.backgroundColor = "lightblue";
                celda.dataset.casillaIndex = index;
                celda.classList.add("casilla");
                console.log(`Casilla creada en el índice: ${index}`);
            } else {
                cromosomaCeldas[index].classList.remove("conectado", "up", "down", "left", "right");
                cromosomaCeldas[index - anchoCromosomaValue]?.classList.remove("conectado", "down");
                cromosomaCeldas[index + anchoCromosomaValue]?.classList.remove("conectado", "up");
                cromosomaCeldas[index - 1]?.classList.remove("conectado", "right");
                cromosomaCeldas[index + 1]?.classList.remove("conectado", "left");
                celda.style.backgroundColor = "";
                delete celda.dataset.casillaIndex;
                celda.classList.remove("casilla", "conectado", "up", "down", "left", "right");
                console.log(`Casilla eliminada en el índice: ${index}`);
                delete cromosoma[index];
                celda.textContent = "";
                // for (const key in cromosoma) {
                //     if (Object.prototype.hasOwnProperty.call(cromosoma, key)) {
                //         console.log(key, index);
                //         if (key == index) {
                //             console.log(`Eliminando casilla en el índice: ${index}`);
                //             delete cromosoma[index];
                //             celda.style.backgroundColor = "";
                //             delete celda.dataset.casillaIndex;
                //             celda.classList.remove("casilla","conectado", "up", "down", "left", "right");
                //             celda.textContent = "";
                //             return;
                //         }
                //     }
                // }
            }
            console.log(cromosoma);
        });
    });
    
}

async function generarCromosomaDorado() {
    const GENES = mezclar(await cargarGenesDesdeAPI());
    const maximoIndex = Math.max(...Object.keys(cromosoma).map(Number), 0);
    
    if (cromosomaDoradoNoRepetidos(0, cromosoma, GENES, maximoIndex)) {
        for (const key in cromosoma) {
            const casilla = cromosoma[key];
            const img = document.createElement("img");
            cromosomaCeldas[key].innerHTML = ""

            img.src = `../img/${casilla.gen.id}.png`;
            img.alt = casilla.gen.nombre;
            img.className = "gen-img";            
            cromosomaCeldas[key].style.backgroundColor = "gold";
            cromosomaCeldas[key].append(img)
            if (Object.prototype.hasOwnProperty.call(cromosoma, key)) {
                const element = cromosoma[key];
                if (!element.gen) {
                    console.log(`Casilla ${key} sin gen asignado`);
                    continue;
                }
                console.log(`${key}: ${element.gen.nombre}`);
            }
        }
    } else {
        console.log("No fue posible generar un cromosoma dorado");
    }
    console.log(cromosoma);
    
}

