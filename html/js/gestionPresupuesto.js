// Array donde guardamos los gastos 
let gastos = [];

// Variable para generar ids automáticos
let siguienteId = 1;

// Presupuesto inicial
let presupuesto = 0;


// Actualizar presupuesto
function actualizarPresupuesto(valor) {
    if (typeof valor !== "number" || valor < 0) {
        return false;
    }
    presupuesto = valor;
    return true;
}


// Crear gasto
function CrearGasto(descripcion, valor, fecha, etiquetas = []) {

    if (!descripcion || typeof descripcion !== "string") return null;
    if (typeof valor !== "number" || valor <= 0) return null;
    if (!fecha) return null;

    return {
        id: siguienteId++,
        descripcion,
        valor,
        fecha,
        etiquetas
    };
}


// Añadir gasto
function anyadirGasto(gasto) {
    if (!gasto || typeof gasto !== "object") return false;
    gastos.push(gasto);
    return true;
}

// Listar gastos
function listarGastos() {
    return gastos;
}


// Borrar gasto
function borrarGasto(id) {
    gastos = gastos.filter(g => g.id !== id);
    return true;
}


// Calcular total de gastos
function calcularTotalGastos() {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}


// Sobrescribir gastos 
function sobrescribirGastos(nuevosGastos) {
    gastos = nuevosGastos;
}


// Exportar
export {
    actualizarPresupuesto,
    CrearGasto,
    anyadirGasto,
    listarGastos,
    borrarGasto,
    calcularTotalGastos,
    sobrescribirGastos
};
