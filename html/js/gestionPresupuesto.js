
let presupuesto = 0;
let gastos = [];
let siguienteId = 0;

function actualizarPresupuesto(valor) {
    
    if (typeof valor === "number" && !isNaN(valor) && valor >= 0) {
        presupuesto = valor;
        return presupuesto;
    } else {
        console.error("Error: El presupuesto debe ser un número no negativo.");
        return -1;
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor, fechaISO, ...etiquetas) {

    if (!(this instanceof CrearGasto)) {
        return new CrearGasto(descripcion, valor, fechaISO, ...etiquetas);
    }

    this.descripcion = descripcion;
    if (typeof valor === "number" && !isNaN(valor) && valor >= 0) {
        this.valor = valor;
    } else {
        this.valor = 0;
    }
    if (typeof fechaISO === "string") {
        const parsed = Date.parse(fechaISO);
        if (!isNaN(parsed)) {
            this.fecha = parsed;
        } else {
            this.fecha = Date.now();
        }
    } else {
  
        this.fecha = Date.now();
    }

    this.etiquetas = [];
    if (etiquetas && etiquetas.length > 0) {
 
        for (let t of etiquetas) {
            if (typeof t === "string" && !this.etiquetas.includes(t)) {
                this.etiquetas.push(t);
            }
        }
    }
}


CrearGasto.prototype.mostrarGasto = function () {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
};

CrearGasto.prototype.mostrarGastoCompleto = function () {
  
    const fechaLocal = new Date(this.fecha).toLocaleString();
    let etiquetasTexto = "";
    if (this.etiquetas.length > 0) {
        for (let e of this.etiquetas) {
            etiquetasTexto += `- ${e}\n`;
        }
    }
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaLocal}\nEtiquetas:\n${etiquetasTexto}`;
};

CrearGasto.prototype.actualizarDescripcion = function (nuevaDescripcion) {
    this.descripcion = nuevaDescripcion;
};

CrearGasto.prototype.actualizarValor = function (nuevoValor) {
    if (typeof nuevoValor === "number" && !isNaN(nuevoValor) && nuevoValor >= 0) {
        this.valor = nuevoValor;
    }
};

CrearGasto.prototype.actualizarFecha = function (fechaISO) {
    const parsed = Date.parse(fechaISO);
    if (!isNaN(parsed)) {
        this.fecha = parsed;
    }
};

CrearGasto.prototype.anyadirEtiquetas = function (...nuevas) {
    if (!nuevas || nuevas.length === 0) return;
    for (let t of nuevas) {
        if (typeof t === "string" && !this.etiquetas.includes(t)) {
            this.etiquetas.push(t);
        }
    }
};

CrearGasto.prototype.borrarEtiquetas = function (...aBorrar) {
    if (!aBorrar || aBorrar.length === 0) return;
    this.etiquetas = this.etiquetas.filter(et => !aBorrar.includes(et));
};

CrearGasto.prototype.obtenerPeriodoAgrupacion = function (periodo) {
    const d = new Date(this.fecha);
    const yyyy = d.getFullYear();
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");

    if (periodo === "mes") {
        return `${yyyy}-${mm}`;
    } else if (periodo === "anyo") {
        return `${yyyy}`;
    } else if (periodo === "dia") {
        return `${yyyy}-${mm}-${dd}`;
    } else {
        return `${yyyy}-${mm}-${dd}`;
    }
};

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = siguienteId++;
    gastos.push(gasto);
}

function borrarGasto(id) {
    gastos = gastos.filter(g => g.id !== id);
}

function calcularTotalGastos() {
    return gastos.reduce((acc, g) => acc + (typeof g.valor === "number" ? g.valor : 0), 0);
}

function calcularBalance() {
    return presupuesto - calcularTotalGastos();
}

function filtrarGastos(opciones = {}) {
    let res = gastos.slice();

    if (opciones.fechaDesde) {
        const desde = Date.parse(opciones.fechaDesde);
        if (!isNaN(desde)) {
            res = res.filter(g => g.fecha >= desde);
        } else {
        }
    }

    if (opciones.fechaHasta) {
        const hasta = Date.parse(opciones.fechaHasta);
        if (!isNaN(hasta)) {
            res = res.filter(g => g.fecha <= hasta);
        }
    }

    if (typeof opciones.valorMinimo === "number" && !isNaN(opciones.valorMinimo)) {
        res = res.filter(g => (typeof g.valor === "number" ? g.valor : 0) >= opciones.valorMinimo);
    }

    if (typeof opciones.valorMaximo === "number" && !isNaN(opciones.valorMaximo)) {
        res = res.filter(g => (typeof g.valor === "number" ? g.valor : 0) <= opciones.valorMaximo);
    }

    if (opciones.descripcionContiene) {
        const sub = String(opciones.descripcionContiene).toLowerCase();
        res = res.filter(g => String(g.descripcion).toLowerCase().includes(sub));
    }

    if (Array.isArray(opciones.etiquetasTiene) && opciones.etiquetasTiene.length > 0) {
        res = res.filter(g => {
            if (!Array.isArray(g.etiquetas) || g.etiquetas.length === 0) return false;
            for (let et of opciones.etiquetasTiene) {
                if (g.etiquetas.includes(et)) return true;
            }
            return false;
        });
    }

    return res;
}

function agruparGastos(periodo, etiquetasFiltro, fechaDesde, fechaHasta) {
    const opciones = {};
    if (Array.isArray(etiquetasFiltro) && etiquetasFiltro.length > 0) {
        opciones.etiquetasTiene = etiquetasFiltro;
    }
    if (fechaDesde) opciones.fechaDesde = fechaDesde;
    if (fechaHasta) opciones.fechaHasta = fechaHasta;

    const lista = filtrarGastos(opciones);
    const agrup = {};

    for (let g of lista) {
        const clave = g.obtenerPeriodoAgrupacion(periodo);
        if (!agrup[clave]) agrup[clave] = 0;
        agrup[clave] += (typeof g.valor === "number" ? g.valor : 0);
    }

    return agrup;
}

export {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos
};

function actualizarPresupuesto(valor) {
    if (typeof valor === "number" && valor >= 0) {
        presupuesto = valor;
        return presupuesto;
    } else {
        console.error("Error: el presupuesto debe ser un número no negativo");
        return -1;
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    if (typeof valor !== "number" || valor < 0) valor = 0;
    let fechaObj = fecha ? new Date(fecha) : new Date();
    if (isNaN(fechaObj.getTime())) fechaObj = new Date();
    const gasto = {
        descripcion: descripcion,
        valor: valor,
        fecha: fechaObj.getTime(),
        etiquetas: [],

        mostrarGasto() {
            return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.`;
        },

        mostrarGastoCompleto() {
            let txt = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`;
            txt += `Fecha: ${new Date(this.fecha).toLocaleString()}\n`;
            txt += `Etiquetas:\n`;

            this.etiquetas.forEach(e => {
                txt += `- ${e}\n`;
            });

            return txt.trimEnd();
        },

        actualizarDescripcion(nueva) {
            this.descripcion = nueva;
        },

        actualizarValor(nuevo) {
            if (typeof nuevo === "number" && nuevo >= 0) {
                this.valor = nuevo;
            }
        },

        actualizarFecha(nuevaFecha) {
            const f = new Date(nuevaFecha);
            if (!isNaN(f.getTime())) {
                this.fecha = f.getTime();
            }
        },

        anyadirEtiquetas(...nuevas) {
            nuevas.forEach(e => {
                if (!this.etiquetas.includes(e)) this.etiquetas.push(e);
            });
        },

        borrarEtiquetas(...lista) {
            this.etiquetas = this.etiquetas.filter(e => !lista.includes(e));
        }
    };

    if (etiquetas.length > 0) gasto.anyadirEtiquetas(...etiquetas);

    return gasto;
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
}

function borrarGasto(id) {
    gastos = gastos.filter(g => g.id !== id);
}

function calcularTotalGastos() {
    return gastos.reduce((acc, g) => acc + g.valor, 0);
}

function calcularBalance() {
    return presupuesto - calcularTotalGastos();
}

export function sobrescribirGastos(nuevaLista) {
    gastos = nuevaLista;
}


module.exports = {
    presupuesto,
    gastos,
    idGasto,
    actualizarPresupuesto,
    mostrarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance
};

