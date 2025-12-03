import {
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos
} from "./gestionPresupuesto.js";


function actualizarTotal() {
    const totalDiv = document.getElementById("total");
    totalDiv.textContent = `Total de gastos: ${calcularTotalGastos()} €`;
}

function guardarEnLocalStorage() {
    const lista = listarGastos();
    localStorage.setItem("misGastos", JSON.stringify(lista));
    alert("Gastos guardados correctamente");
}

function cargarDesdeLocalStorage() {
    const datos = localStorage.getItem("misGastos");

    if (!datos) {
        alert("No hay datos guardados");
        return;
    }

    const listaPlana = JSON.parse(datos);

    // reconstrucción de objetos Gasto

    const reconstruidos = listaPlana.map(g =>
        Object.assign(new CrearGasto(), g)
    );

    sobrescribirGastos(reconstruidos);

    pintarListado();
    actualizarTotal();

    alert("Gastos cargados desde almacenamiento");
}


// formulario

function crearFormulario() {
    const contenedor = document.getElementById("formulario-container");

    const form = document.createElement("form");

    form.innerHTML = `
        <input type="text" name="descripcion" placeholder="Descripción" required><br>
        <input type="number" step="0.01" name="valor" placeholder="Valor" required><br>
        <input type="date" name="fecha"><br>
        <input type="text" name="etiquetas" placeholder="etiquetas separadas por ,"><br>
        <button type="submit">Añadir gasto</button>
    `;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(form);

        const descripcion = fd.get("descripcion");
        const valor = parseFloat(fd.get("valor"));
        const fecha = fd.get("fecha");
        const etiquetas = fd.get("etiquetas")
            .split(",")
            .map(e => e.trim())
            .filter(e => e.length > 0);

        const gasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);

        anyadirGasto(gasto);

        form.reset();
        pintarListado();
        actualizarTotal();
    });

    contenedor.appendChild(form);
}

// mi gasto

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
        root.querySelector(".fecha").textContent =
            new Date(this.gasto.fecha).toLocaleDateString();
        root.querySelector(".etiquetas").textContent = this.gasto.etiquetas.join(", ");

        const btnBorrar = root.querySelector(".btn-borrar");
        const btnEditar = root.querySelector(".btn-editar");
        const formEditar = root.querySelector(".form-editar");

     
        btnBorrar.onclick = () => {
            if (confirm("¿Borrar este gasto?")) {
                borrarGasto(this.gasto.id);
                pintarListado();
                actualizarTotal();
            }
        };
  
        btnEditar.onclick = () => {
            formEditar.style.display = formEditar.style.display === "none" ? "block" : "none";

            formEditar.descripcion.value = this.gasto.descripcion;
            formEditar.valor.value = this.gasto.valor;
            formEditar.fecha.value = new Date(this.gasto.fecha).toISOString().slice(0, 10);
            formEditar.etiquetas.value = this.gasto.etiquetas.join(",");
        };

        formEditar.onsubmit = (e) => {
            e.preventDefault();

            this.gasto.actualizarDescripcion(formEditar.descripcion.value);
            this.gasto.actualizarValor(parseFloat(formEditar.valor.value));
            this.gasto.actualizarFecha(formEditar.fecha.value);

            const nuevasEtiquetas = formEditar.etiquetas.value
                .split(",")
                .map(e => e.trim())
                .filter(e => e.length > 0);

            this.gasto.etiquetas = nuevasEtiquetas;

            formEditar.style.display = "none";
            pintarListado();
            actualizarTotal();
        };

        formEditar.querySelector(".cancelar").onclick = () => {
            formEditar.style.display = "none";
        };
    }
}

customElements.define("mi-gasto", MiGasto);

function pintarListado() {
    const contenedor = document.getElementById("listado-container");
    contenedor.innerHTML = "";

    const lista = listarGastos();

    lista.forEach(gasto => {
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
