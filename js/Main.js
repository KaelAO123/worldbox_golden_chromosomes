function mezclar(lista) {
    let listaMezclada = [];
    // Copiamos la lista original para no modificarla
    let listaOriginal = lista.slice();

    while (listaOriginal.length > 0) {
        let posicion = Math.floor(Math.random() * listaOriginal.length);
        let elemento = listaOriginal.splice(posicion, 1)[0];
        listaMezclada.unshift(elemento);
    }

    return listaMezclada;
}


class Casilla {
    constructor(gen) {
        this.gen = gen
        this.casillas = [null, null, null, null]
    }

    conectarCasilla(posicion, casilla) {
        this.casillas[posicion] = casilla
        casilla.casillas[(posicion + 2) % 4] = this
    }

    insertarGenDorado(gen) {
        for (let index = 0; index < this.casillas.length; index++) {
            if (!this.casillas[index]) {
                continue
            }

            if (this.casillas[index].gen) {
                const ramaConexion = this.casillas[index].gen.ramas[((index + 2) % 4)]
                const rama = gen.ramas[index]
                if (ramaConexion != rama) {
                    return false
                }
            }
        }
        this.gen = gen
        return true
    }
}

function cromosomaDorado(casillaIndex, cromosoma, genes) {
    if (casillaIndex == cromosoma.length) {
        return true
    }
    const casillaActual = cromosoma[casillaIndex]
    genes.forEach(gen => {
        if (casillaActual.insertarGenDorado(gen)) {
            if (cromosomaDorado(casillaIndex + 1, cromosoma, genes)) {
                return true
            }
            casillaActual.gen = null
        }
    });
    return false
}
function cromosomaDoradoNoRepetidos(casillaIndex, cromosoma, genesDisp) {
    if (casillaIndex == cromosoma.length) {
        return true
    }
    const casillaActual = cromosoma[casillaIndex]

    for (let index = 0; index < genesDisp.length; index++) {
        const gen = genesDisp[index]
        if (casillaActual.insertarGenDorado(gen)) {
            siguienteGen = genesDisp.slice(0, index).concat(genesDisp.slice(index + 1))            
            if (cromosomaDoradoNoRepetidos(casillaIndex + 1, cromosoma, siguienteGen)) {
                return true
            }
            casillaActual.gen = null
        }
    }
    return false
}

async function cargarGenesDesdeAPI() {
    const response = await fetch("http://localhost:5000/genes");
    const datos = await response.json();
    return mezclar(datos); 
}

let GENES = [];
const n = 22;
const cromosoma = Array.from({ length: n }, () => new Casilla());

cromosoma[0].conectarCasilla(3, cromosoma[1]);
cromosoma[1].conectarCasilla(2, cromosoma[2]);
cromosoma[1].conectarCasilla(3, cromosoma[3]);
cromosoma[2].conectarCasilla(2, cromosoma[8]);
cromosoma[3].conectarCasilla(3, cromosoma[4]);
cromosoma[4].conectarCasilla(2, cromosoma[5]);
cromosoma[5].conectarCasilla(3, cromosoma[6]);
cromosoma[6].conectarCasilla(2, cromosoma[7]);
cromosoma[8].conectarCasilla(2, cromosoma[9]);
cromosoma[8].conectarCasilla(3, cromosoma[10]);
cromosoma[9].conectarCasilla(1, cromosoma[12]);
cromosoma[9].conectarCasilla(2, cromosoma[15]);
cromosoma[9].conectarCasilla(3, cromosoma[11]);
cromosoma[10].conectarCasilla(2, cromosoma[11]);
cromosoma[11].conectarCasilla(2, cromosoma[18]);
cromosoma[11].conectarCasilla(3, cromosoma[19]);
cromosoma[12].conectarCasilla(2, cromosoma[13]);
cromosoma[13].conectarCasilla(2, cromosoma[14]);
cromosoma[13].conectarCasilla(3, cromosoma[15]);
cromosoma[14].conectarCasilla(3, cromosoma[16]);
cromosoma[15].conectarCasilla(3, cromosoma[18]);
cromosoma[15].conectarCasilla(2, cromosoma[16]);
cromosoma[16].conectarCasilla(3, cromosoma[17]);
cromosoma[17].conectarCasilla(4, cromosoma[18]);
cromosoma[18].conectarCasilla(3, cromosoma[20]);
cromosoma[19].conectarCasilla(2, cromosoma[20]);
cromosoma[20].conectarCasilla(3, cromosoma[21]);


async function iniciar() {
    GENES = await cargarGenesDesdeAPI();
    if (cromosomaDoradoNoRepetidos(0, cromosoma, GENES)) {
        cromosoma.forEach((c, i) => console.log(`${i}: ${c.gen.nombre}`));
    } else {
        console.log("No fue posible generar un cromosoma dorado");
    }
}

iniciar();

