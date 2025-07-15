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

export class Casilla {
    constructor(gen) {
        this.gen = gen
        this.casillas = [null, null, null, null]
    }

    conectarCasilla(posicion, casilla) {
        this.casillas[posicion] = casilla
        casilla.casillas[(posicion + 2) % 4] = this
    }

    desconectarCasilla(posicion) {
        const casilla = this.casillas[posicion];
        if (casilla) {
            casilla.casillas[(posicion + 2) % 4] = null;
            this.casillas[posicion] = null;
        }
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

export function cromosomaDorado(casillaIndex, cromosoma, genes) {
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

export function cromosomaDoradoNoRepetidos(casillaIndex, cromosoma, genesDisp) {
    if (casillaIndex == Object.keys(cromosoma).length) {
        return true
    }
    const casillaActual = cromosoma[casillaIndex]

    for (let index = 0; index < genesDisp.length; index++) {
        const gen = genesDisp[index] 
        if (!casillaActual) {
            cromosomaDoradoNoRepetidos(casillaIndex + 1, cromosoma, genesDisp)
            return true
        }
        
        if (casillaActual.insertarGenDorado(gen)) {
            const siguienteGen = genesDisp.slice(0, index).concat(genesDisp.slice(index + 1))
            if (cromosomaDoradoNoRepetidos(casillaIndex + 1, cromosoma, siguienteGen)) {
                return true
            }
            casillaActual.gen = null
        }
    }
    return false
}

export async function cargarGenesDesdeAPI() {
    const response = await fetch("http://localhost:5000/genes");
    const datos = await response.json();
    return mezclar(datos); 
}

const n = 22;
let cromosoma = {};
for (let i = 0; i < n; i++) {
    cromosoma[i] = new Casilla();
}
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
    const GENES = await cargarGenesDesdeAPI();
    if (cromosomaDoradoNoRepetidos(0, cromosoma, GENES)) {
        for (const key in cromosoma) {
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
}

// iniciar();

export default { Casilla, cromosomaDorado, cromosomaDoradoNoRepetidos, cargarGenesDesdeAPI };