window.addEventListener("load", () => {
    const nuevo = document.querySelector("#crear");
    nuevo.addEventListener("click", () => {
        modalCrearNuevo();
    });

    refreshPacientes();
});

function refreshPacientes() {
    fetch("http://localhost:8080/pacientes")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ''; // Limpiar el tbody antes de llenarlo

            data.forEach(paciente => {
                const tr = document.createElement('tr');

                tr.innerHTML = `<td>${paciente.dni}</td>
                                <td>${paciente.nombre}</td>
                                <td>${paciente.apellido}</td>
                                <td>${paciente.alta}</td>
                                <td>${paciente.domicilio.calle}, ${paciente.domicilio.numero}, ${paciente.domicilio.localidad}, ${paciente.domicilio.provincia}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm editar" data-id="${paciente.dni}">Editar</button>
                                    <button class="btn btn-danger btn-sm eliminar" data-id="${paciente.dni}">Eliminar</button>
                                </td>`;

                tbody.appendChild(tr);
            });

            document.querySelectorAll(".editar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    modalEditarInformacion(e.target.dataset.id);
                });
            });

            document.querySelectorAll(".eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    modalConfirmarEliminar(e.target.dataset.id);
                });
            });
        });
}

function modalCrearNuevo() {
    fetch("http://localhost:8080/domicilios")  // Obtener direcciones para el dropdown
        .then(response => response.json())
        .then(domicilios => {
            const dropdownOptions = domicilios.map(domicilio =>
                `<option value="${domicilio.id}">${domicilio.calle}, ${domicilio.numero}, ${domicilio.localidad}, ${domicilio.provincia}</option>`
            ).join("");

            const form = `<form id="crearForm">
                            <div class="mb-3">
                              <label for="dni" class="form-label">DNI</label>
                              <input type="text" class="form-control" id="dni">
                            </div>
                            <div class="mb-3">
                              <label for="nombre" class="form-label">Nombre</label>
                              <input type="text" class="form-control" id="nombre">
                            </div>
                            <div class="mb-3">
                              <label for="apellido" class="form-label">Apellido</label>
                              <input type="text" class="form-control" id="apellido">
                            </div>
                            <div class="mb-3">
                              <label for="alta" class="form-label">Fecha de Alta</label>
                              <input type="date" class="form-control" id="alta">
                            </div>
                            <div class="mb-3">
                              <label for="domicilio" class="form-label">Dirección</label>
                              <select class="form-control" id="domicilio">${dropdownOptions}</select>
                            </div>
                          </form>`;

            Swal.fire({
                title: "Crear nuevo Paciente",
                html: form,
                showCancelButton: true,
                confirmButtonText: 'Crear',
                preConfirm: () => {
                    const paciente = {
                        dni: document.getElementById('dni').value,
                        nombre: document.getElementById('nombre').value,
                        apellido: document.getElementById('apellido').value,
                        alta: document.getElementById('alta').value,
                        domicilioId: document.getElementById('domicilio').value
                    };

                    return fetch("http://localhost:8080/paciente", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(paciente)
                    }).then(response => response.json());
                }
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire('Creado!', 'El paciente ha sido creado.', 'success');
                    refreshPacientes();
                }
            });
        });
}

function modalEditarInformacion(dni) {
    fetch(`http://localhost:8080/paciente/${dni}`)
        .then(response => response.json())
        .then(data => {
            fetch("http://localhost:8080/domicilios")
                .then(response => response.json())
                .then(domicilios => {
                    const dropdownOptions = domicilios.map(domicilio =>
                        `<option value="${domicilio.id}" ${domicilio.id === data.domicilio.id ? 'selected' : ''}>${domicilio.calle}, ${domicilio.numero}, ${domicilio.localidad}, ${domicilio.provincia}</option>`
                    ).join("");

                    const form = `<form id="editarForm">
                                    <div class="mb-3">
                                      <label for="dni" class="form-label">DNI</label>
                                      <input type="text" class="form-control" id="dni" value="${data.dni}" disabled>
                                    </div>
                                    <div class="mb-3">
                                      <label for="nombre" class="form-label">Nombre</label>
                                      <input type="text" class="form-control" id="nombre" value="${data.nombre}">
                                    </div>
                                    <div class="mb-3">
                                      <label for="apellido" class="form-label">Apellido</label>
                                      <input type="text" class="form-control" id="apellido" value="${data.apellido}">
                                    </div>
                                    <div class="mb-3">
                                      <label for="alta" class="form-label">Fecha de Alta</label>
                                      <input type="date" class="form-control" id="alta" value="${data.alta.substring(0, 10)}">
                                    </div>
                                    <div class="mb-3">
                                      <label for="domicilio" class="form-label">Dirección</label>
                                      <select class="form-control" id="domicilio">${dropdownOptions}</select>
                                    </div>
                                  </form>`;

                    Swal.fire({
                        title: `Editar Paciente #${dni}`,
                        html: form,
                        showCancelButton: true,
                        confirmButtonText: 'Actualizar',
                        preConfirm: () => {
                            const paciente = {
                                nombre: document.getElementById('nombre').value,
                                apellido: document.getElementById('apellido').value,
                                alta: document.getElementById('alta').value,
                                domicilioId: document.getElementById('domicilio').value
                            };

                            return fetch(`http://localhost:8080/paciente/${dni}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(paciente)
                            }).then(response => response.json());
                        }
                    }).then(result => {
                        if (result.isConfirmed) {
                            Swal.fire('Modificado!', 'El paciente ha sido actualizado.', 'success');
                            refreshPacientes();
                        }
                    });
                });
        });
}

function modalConfirmarEliminar(dni) {
    Swal.fire({
        title: `¿Seguro que deseas eliminar el paciente #${dni}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        preConfirm: () => {
            return fetch(`http://localhost:8080/paciente/${dni}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    Swal.fire('Eliminado!', 'El paciente ha sido eliminado.', 'success');
                    refreshPacientes();
                }
            });
        }
    });
}
