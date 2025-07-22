import { cargarGenesDesdeAPI, actualizarVariosGenes } from "./utils.js";
const cromosomas = await cargarGenesDesdeAPI();

const contenedor = document.getElementById("contenedor-cromosomas");

const botonGuardarCambios = document.getElementById("guardarCambios")

botonGuardarCambios.addEventListener("click", async () => {
    const cambios = Object.values(elementosCambios);
    try {
        const resultados = (actualizarVariosGenes(cambios)
    );
        alert("Todos los genes actualizados correctamente:", resultados);
    } catch (error) {
        alert("Error actualizando genes:", error);
    } 
});


const elementosCambios = {}

cromosomas.forEach((cromo, i) => {
    const card = document.createElement("div");
    card.className = "card";

    const nombre = document.createElement("h3");
    nombre.textContent = cromo.nombre;

    const wrapper = document.createElement("div");
    wrapper.className = "cromo-wrapper";

    const ramaUp = document.createElement("select");
    ramaUp.className = `rama up ${cromo.ramas[0].toLowerCase()}`;
    ramaUp.innerHTML = opciones(cromo.ramas[0].toLowerCase());
    const ramaRight = document.createElement("select");
    ramaRight.className = `rama right ${cromo.ramas[1].toLowerCase()}`;
    ramaRight.innerHTML = opciones(cromo.ramas[1].toLowerCase());
    const ramaDown = document.createElement("select");
    ramaDown.className = `rama down ${cromo.ramas[2].toLowerCase()}`;
    ramaDown.innerHTML = opciones(cromo.ramas[2].toLowerCase());
    const ramaLeft = document.createElement("select");
    ramaLeft.className = `rama left ${cromo.ramas[3].toLowerCase()}`;
    ramaLeft.innerHTML = opciones(cromo.ramas[3].toLowerCase());
    const img = document.createElement("img");
    img.src = `../img/${cromo.id}.png`;
    img.alt = cromo.nombre;
    img.className = "cromo-img";
    const ramas = [ramaUp, ramaRight, ramaDown, ramaLeft];
    ramas.forEach((rama, j) => {
        rama.addEventListener("change", (e) => {
            if (rama.className != e.target.className) {
                return;
            }
            console.log(`Cambiando color de rama: ${rama.className} a ${e.target.value}`);
            const color = e.target.value.toLowerCase();
            rama.className = `rama ${rama.className.split(' ')[1]} ${color}`;
            cromo.ramas[j] = e.target.value;
            elementosCambios[i] = cromo;
        });
    });
    wrapper.append(...ramas, img);
    card.append(nombre, wrapper);
    contenedor.appendChild(card);
})

function opciones(color) {
    if (color == 'rojo') {
        return `<option class="rojo" value="rojo" selected></option>
                <option class="azul" value="azul"></option>
                <option class="verde" value="verde"></option>
                <option class="amarillo" value="amarillo"></option>`;
    }
    if (color == 'azul') {
        return `<option class="rojo" value="rojo"></option>
                <option class="azul" value="azul" selected></option>
                <option class="verde" value="verde"></option>
                <option class="amarillo" value="amarillo"></option>`;
    }
    if (color == 'verde') {
        return `<option class="rojo" value="rojo"></option>
                <option class="azul" value="azul"></option>
                <option class="verde" value="verde" selected></option>
                <option class="amarillo" value="amarillo"></option>`;
    }
    if (color == 'amarillo') {
        return `<option class="rojo" value="rojo"></option>
                <option class="azul" value="azul"></option>
                <option class="verde" value="verde"></option>
                <option class="amarillo" value="amarillo" selected></option>`;
    }
}