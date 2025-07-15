import { Casilla } from "../js/Main.js";

const altoCromosoma = document.getElementById("cromosomaAlto");
const anchoCromosoma = document.getElementById("cromosomaAncho");

const botonCrearCromosoma = document.getElementById("crearCromosoma");
const matrizCromosoma = document.getElementById("matrizCromosoma");

const asociarCasilla = document.getElementById("asociarCasillas");
const insertarCasilla = document.getElementById("insertarCasilla");

var cromosomaCeldas = document.querySelectorAll(".cromosoma-cell");

var agregarCasilla = false;
var primeraCasilla = null;
var unirCasilla = false;

var anchoCromosomaValue = 0;
var altoCromosomaValue = 0;

const cromosoma = {};

botonCrearCromosoma.addEventListener("click", () => {
    anchoCromosomaValue = parseInt(anchoCromosoma.value);
    altoCromosomaValue = parseInt(altoCromosoma.value);
    crearCromosoma(anchoCromosomaValue, altoCromosomaValue);
    
    console.log(`Cromosoma creado con ancho: ${anchoCromosomaValue} y alto: ${altoCromosomaValue}`);
    
});

//082016

function botonesAsociarInsertar(auxAgregar, auxUnir) {
    primeraCasilla = null;
    if (auxAgregar) {
        asociarCasilla.classList.remove("presionado");
        unirCasilla = false; // Desactivar unir casilla si se va a agregar
        return;
    }
    if (auxUnir) {
        insertarCasilla.classList.remove("presionado");
        agregarCasilla = false; // Desactivar agregar casilla si se va a unir
        return;
    }
}

insertarCasilla.addEventListener("click", () => {
    agregarCasilla = insertarCasilla.classList.toggle("presionado"); // Desactivar unir casilla si se va a agregar
    botonesAsociarInsertar(true, false);
    console.log(`Agregar Casilla: ${agregarCasilla}`);
});

asociarCasilla.addEventListener("click", () => {
    unirCasilla = asociarCasilla.classList.toggle("presionado");
    botonesAsociarInsertar(false, true);
    console.log(`Unir Casilla: ${unirCasilla}`);
});

const crearCromosoma = (ancho, alto) => {
    matrizCromosoma.innerHTML = "";
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
    celdasListener();
};


function juntarCasilla(index, indexDestino, casilla) {
    if (index - anchoCromosomaValue === indexDestino) {
        casilla.conectarCasilla(1, cromosoma[indexDestino]);
        console.log(`Conectando casilla desde arriba ${index} con ${indexDestino}`);
        return true;
    }
    if (index + anchoCromosomaValue === indexDestino) {
        casilla.conectarCasilla(2, cromosoma[indexDestino]);
        console.log(`Conectando casilla desde abajo ${index} con ${indexDestino}`);
        return true;
    }
    if (index - 1 === indexDestino && index % anchoCromosomaValue !== 0) {
        casilla.conectarCasilla(3, cromosoma[indexDestino]);
        console.log(`Conectando casilla desde la izquierda ${index} con ${indexDestino}`);
        return true;
    }
    if (index + 1 === indexDestino && (index + 1) % anchoCromosomaValue !== 0) {
        casilla.conectarCasilla(4, cromosoma[indexDestino]);
        console.log(`Conectando casilla desde la derecha ${index} con ${indexDestino}`);
        return true;
    }
}

function celdasListener() {
    cromosomaCeldas.forEach((celda, index) => {
        celda.addEventListener("click", () => {
            if (unirCasilla) {
                console.log(unirCasilla);
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
                        }else{
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
                for (const key in cromosoma) {
                    if (Object.prototype.hasOwnProperty.call(cromosoma, key)) {
                        console.log(key, index);
                        if (key == index) {
                            console.log(`Eliminando casilla en el índice: ${index}`);
                            delete cromosoma[index];
                            celda.style.backgroundColor = "";
                            delete celda.dataset.casillaIndex;
                            celda.classList.remove("casilla");
                            return;
                        }
                    }
                }
            }
        });
    });
}