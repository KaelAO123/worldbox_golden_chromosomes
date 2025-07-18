import { cargarGenesDesdeAPI, actualizarGenesDesdeApi } from "../js/Main.js";
const cromosomas = await cargarGenesDesdeAPI();

const contenedor = document.getElementById("contenedor-cromosomas");


cromosomas.forEach((cromo) => {
    const card = document.createElement("div");
    card.className = "card";

    const nombre = document.createElement("h2");
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
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Guardar";
    botonGuardar.className = "guardar-btn";
    botonGuardar.disabled = true;
    botonGuardar.addEventListener("click", () => {
        botonGuardar.disabled = true;
        const datos = {
            id: cromo.id,
            nombre: cromo.nombre,
            ramas:[ramaUp.value, ramaRight.value, ramaDown.value, ramaLeft.value]
        };
        console.log(datos.ramas, datos.id, datos.nombre);
        
        actualizarGenesDesdeApi(datos)
            .then(() => {
                alert("Cromosoma actualizado correctamente");
            })
            .catch((error) => {
                console.error("Error al actualizar el cromosoma:", error);
                alert("Error al actualizar el cromosoma");
            });
    });
    const ramas = [ramaUp, ramaRight, ramaDown, ramaLeft];
    ramas.forEach(rama => {
        rama.addEventListener("change", (e) => {
            if (rama.className != e.target.className) {
                return;
            }
            console.log(`Cambiando color de rama: ${rama.className} a ${e.target.value}`);
            botonGuardar.disabled = false;
            const color = e.target.value.toLowerCase();
            rama.className = `rama ${rama.className.split(' ')[1]} ${color}`;
        });
    });
    wrapper.append(...ramas, img);
    card.append(nombre, wrapper,botonGuardar);
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