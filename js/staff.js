// staff.js
const LS = {
    MEDICOS: "medicos",
    ESPECIALIDADES: "especialidades",
    OBRAS: "obrasSociales",
};

const $grid = document.getElementById("staffGrid");
const $q = document.getElementById("q");
const $filtroEsp = document.getElementById("filtroEspecialidad");
const PLACEHOLDER = "img/doctor-placeholder.jpg";

const lsGet = (k) => JSON.parse(localStorage.getItem(k) || "null");
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

async function ensureSeed() {
    let medicos = lsGet(LS.MEDICOS);
    if (!medicos) {
        const mod = await import("./data-medicos.js");
        if (!lsGet(LS.ESPECIALIDADES)) lsSet(LS.ESPECIALIDADES, mod.ESPECIALIDADES_SEED);
        if (!lsGet(LS.OBRAS)) lsSet(LS.OBRAS, mod.OBRAS_SOCIALES_SEED);
        lsSet(LS.MEDICOS, mod.MEDICOS_SEED);
        medicos = mod.MEDICOS_SEED;
    }
    return medicos;
}

function cardTemplate(m) {
    const obras = (m.obrasSociales || []).join(", ") || "—";
    const honor = typeof m.honorarios === "number"
        ? Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(m.honorarios)
        : "—";
    const foto = m.foto || PLACEHOLDER;

    return `
  <div class="col-12 col-sm-6 col-lg-4">
    <div class="card h-100 shadow-sm">
      <img src="${foto}" class="card-img-top" alt="${m.apellidoNombre}" onerror="this.src='${PLACEHOLDER}'" />
      <div class="card-body d-flex flex-column">
        <h3 class="h6 card-title mb-1">${m.apellidoNombre}</h3>
        <p class="text-primary mb-2">${m.especialidad || ""}</p>
        <p class="small text-body-secondary mb-2"><strong>Honorarios:</strong> ${honor}</p>
        <p class="small text-body-secondary mb-2"><strong>Obras sociales:</strong> ${obras}</p>
        ${m.bio ? `<p class="small flex-grow-1 mb-3">${m.bio}</p>` : `<div class="flex-grow-1"></div>`}
        <div class="d-flex gap-2 mt-auto">
          ${m.email ? `<a href="mailto:${m.email}" class="btn btn-outline-primary btn-sm">Email</a>` : ""}
          ${m.telefono ? `<a href="tel:${m.telefono.replace(/\s+/g, '')}" class="btn btn-outline-secondary btn-sm">Llamar</a>` : ""}
        </div>
      </div>
    </div>
  </div>`;
}

function renderFiltros(especialidades) {
    if ($filtroEsp && $filtroEsp.options.length <= 1) {
        const opts = especialidades.map(e => `<option value="${e}">${e}</option>`).join("");
        $filtroEsp.insertAdjacentHTML("beforeend", opts);
    }
}

function filtrar(medicos) {
    const term = ($q?.value || "").trim().toLowerCase();
    const esp = $filtroEsp?.value || "";
    return medicos.filter(m => {
        const matchNombre = !term || (m.apellidoNombre || "").toLowerCase().includes(term);
        const matchEsp = !esp || m.especialidad === esp;
        return matchNombre && matchEsp;
    });
}

function render(medicos) {
    const list = filtrar(medicos);
    if (!list.length) {
        $grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-light border text-center m-0">No hay profesionales para mostrar.</div>
      </div>`;
        return;
    }
    $grid.innerHTML = list.map(cardTemplate).join("");
}

(async function init() {
    const medicos = await ensureSeed();
    const especialidades = lsGet(LS.ESPECIALIDADES) || [];
    renderFiltros(especialidades);
    render(medicos);

    $q?.addEventListener("input", () => render(lsGet(LS.MEDICOS) || []));
    $filtroEsp?.addEventListener("change", () => render(lsGet(LS.MEDICOS) || []));
})();
