export async function actualizarVariosGenes(datos) {
    const response = await fetch(`http://localhost:5000/genes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error(`Error al actualizar el gen con ID ${id}`);
    }
    const data = await response.json();
    return data; 
    
}
export function mezclar(lista) {
    let listaMezclada = [];
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
        if (this.casillas[posicion]) {
            this.desconectarCasilla(posicion, casilla);
            return false;
        }
        this.casillas[posicion] = casilla
        casilla.casillas[(posicion + 2) % 4] = this
        return true;
    }

    desconectarCasilla(posicion, casilla) {
        this.casillas[posicion] = null;
        casilla.casillas[(posicion + 2) % 4] = null;
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

export function cromosomaDoradoNoRepetidos(casillaIndex, cromosomaCopy, genesDisp, maxIndex) {
    if (casillaIndex > maxIndex) {
        return true
    }
    const casillaActual = cromosomaCopy[casillaIndex]
    
    for (let index = 0; index < genesDisp.length; index++) {
        const gen = genesDisp[index] 
        if (!casillaActual) {            
            return cromosomaDoradoNoRepetidos(casillaIndex + 1, cromosomaCopy, genesDisp, maxIndex)
        }
        
        if (casillaActual.insertarGenDorado(gen)) {
            
            const siguienteGen = genesDisp.slice(0, index).concat(genesDisp.slice(index + 1))
            if (cromosomaDoradoNoRepetidos(casillaIndex + 1, cromosomaCopy, siguienteGen, maxIndex)) {
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
    return datos; 
}

export async function actualizarGenesDesdeApi(datos) {
    const id = datos.id;

    const response = await fetch(`http://localhost:5000/genes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error(`Error al actualizar el gen con ID ${id}`);
    }
    const data = await response.json();
    return data; 
}


export default { Casilla, cromosomaDorado, cromosomaDoradoNoRepetidos, cargarGenesDesdeAPI, mezclar, actualizarGenesDesdeApi};

