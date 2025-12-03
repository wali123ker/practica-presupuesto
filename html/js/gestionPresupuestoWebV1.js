
// Contenedores dom
const contenedorTotal = document.getElementById("total-gastos");
const contenedorFormulario = document.getElementById("formulario-gasto");
const contenedorLista = document.getElementById("lista-gastos");

// Crear formulario
function crearFormulario() {
    const form = document.createElement("form");

    form.innerHTML = `
        <label>Descripción:</label><br>
        <input type="text" id="desc" required><br><br>

        <label>Valor (€):</label><br>
        <input type="number" id="valor" step="0.01" required><br><br>

        <label>Fecha (opcional):</label><br>
        <input type="text" id="fecha" placeholder="2024-01-01 10:30"><br><br>

        <label>Etiquetas (separadas por coma):</label><br>
        <input type="text" id="etiquetas"><br><br>

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

        const gasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);

        anyadirGasto(gasto);

        pintarTodo();
        form.reset();
    });

    contenedorFormulario.appendChild(form);
}


function pintarLista() {
    contenedorLista.innerHTML = ""; 

    const lista = listarGastos();

    lista.forEach(gasto => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";

        div.innerHTML = `
            <strong>${gasto.descripcion}</strong><br>
            Valor: ${gasto.valor} €<br>
            Fecha: ${new Date(gasto.fecha).toLocaleString()}<br>
            Etiquetas: ${gasto.etiquetas.join(", ")}<br>
            <button data-id="${gasto.id}">Borrar</button>
        `;

        div.querySelector("button").addEventListener("click", function () {
            if (confirm("¿Seguro que quieres borrar este gasto?")) {
                borrarGasto(gasto.id);
                pintarTodo();
            }
        });

        contenedorLista.appendChild(div);
    });
}

function pintarTotal() {
    const total = calcularTotalGastos();
    contenedorTotal.innerHTML = `<h2>Total gastado: ${total} €</h2>`;
}

function pintarTodo() {
    pintarTotal();
    pintarLista();
}

crearFormulario();
pintarTodo();
