import {
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    sobrescribirGastos
} from "./gestionPresupuesto.js";

function actualizarTotal() {
    const totalDiv = document.getElementById("total");
    totalDiv.textContent = `Total de gastos: ${calcularTotalGastos()} €`;
}

function guardarEnLocalStorage() {
    localStorage.setItem("misGastos", JSON.stringify(listarGastos()));
    alert("Gastos guardados correctamente");
}

function cargarDesdeLocalStorage() {
    const datos = localStorage.getItem("misGastos");
    if (!datos) return alert("No hay datos guardados");

    const lista = JSON.parse(datos);

    sobrescribirGastos(lista);

    pintarListado();
    actualizarTotal();
}

// formulario
function crearFormulario() {
    const contenedor = document.getElementById("formulario-container");
    const form = document.createElement("form");

    form.innerHTML = `
        <input type="text" name="descripcion" placeholder="Descripción" required><br>
        <input type="number" step="0.01" name="valor" placeholder="Valor" required><br>
        <input type="date" name="fecha" required><br>
        <input type="text" name="etiquetas" placeholder="etiquetas separadas por ,"><br>
        <button type="submit">Añadir gasto</button>
    `;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(form);

        const gasto = CrearGasto(
            fd.get("descripcion"),
            parseFloat(fd.get("valor")),
            fd.get("fecha"),
            fd.get("etiquetas")
                .split(",")
                .map(e => e.trim())
                .filter(e => e.length > 0)
        );

        anyadirGasto(gasto);

        form.reset();
        pintarListado();
        actualizarTotal();
    });

    contenedor.appendChild(form);
}

// Web
class MiGasto extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const template = document.getElementById("template-gasto");
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set data(gasto) {
        this.gasto = gasto;
        this.render();
    }

    render() {
        const root = this.shadowRoot;

        root.querySelector(".desc").textContent = this.gasto.descripcion;
        root.querySelector(".valor").textContent = this.gasto.valor;
        root.querySelector(".fecha").textContent = this.gasto.fecha;
        root.querySelector(".etiquetas").textContent =
            this.gasto.etiquetas.join(", ");

        root.querySelector(".btn-borrar").onclick = () => {
            borrarGasto(this.gasto.id);
            pintarListado();
            actualizarTotal();
        };
    }
}

customElements.define("mi-gasto", MiGasto);

function pintarListado() {
    const contenedor = document.getElementById("listado-container");
    contenedor.innerHTML = "";

    listarGastos().forEach(gasto => {
        const item = document.createElement("mi-gasto");
        item.data = gasto;
        contenedor.appendChild(item);
    });
}

document.getElementById("btn-guardar").onclick = guardarEnLocalStorage;
document.getElementById("btn-cargar").onclick = cargarDesdeLocalStorage;

crearFormulario();
pintarListado();
actualizarTotal();
