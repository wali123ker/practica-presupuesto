import {
    CrearGasto,
    anyadirGasto,
    listarGastos,
    borrarGasto,
    calcularTotalGastos
} from "./gestionPresupuesto.js";

// Contenedores dom
const contenedorTotal = document.getElementById("total-gastos");
const contenedorFormulario = document.getElementById("formulario-gasto");
const contenedorLista = document.getElementById("lista-gastos");

// Crear formulario
function crearFormulario() {
    const form = document.createElement("form");

    form.innerHTML = `
        <input type="text" id="desc" placeholder="Descripción" required><br>
        <input type="number" id="valor" step="0.01" placeholder="Valor" required><br>
        <input type="date" id="fecha" required><br>
        <input type="text" id="etiquetas" placeholder="etiquetas separadas por ,"><br>
        <button type="submit">Añadir gasto</button>
    `;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const descripcion = document.getElementById("desc").value;
        const valor = Number(document.getElementById("valor").value);
        const fecha = document.getElementById("fecha").value;
        const etiquetas = document.getElementById("etiquetas").value
            .split(",")
            .map(e => e.trim())
            .filter(e => e.length > 0);

        const gasto = CrearGasto(descripcion, valor, fecha, etiquetas);

        anyadirGasto(gasto);

        pintarTodo();
        form.reset();
    });

    contenedorFormulario.appendChild(form);
}

function pintarLista() {
    contenedorLista.innerHTML = "";

    listarGastos().forEach(gasto => {
        const div = document.createElement("div");

        div.innerHTML = `
            <strong>${gasto.descripcion}</strong><br>
            Valor: ${gasto.valor} €<br>
            Fecha: ${gasto.fecha}<br>
            Etiquetas: ${gasto.etiquetas.join(", ")}<br>
            <button data-id="${gasto.id}">Borrar</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            borrarGasto(gasto.id);
            pintarTodo();
        });

        contenedorLista.appendChild(div);
    });
}

function pintarTotal() {
    contenedorTotal.innerHTML =
        `<h2>Total gastado: ${calcularTotalGastos()} €</h2>`;
}

function pintarTodo() {
    pintarTotal();
    pintarLista();
}

crearFormulario();
pintarTodo();
