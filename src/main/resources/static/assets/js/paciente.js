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
            tbody.innerHTML = '';

            data.forEach(paciente => {
                const tr = document.createElement('tr');

                tr.innerHTML = `<td>${paciente.id}</td>
                                <td>${paciente.dni}</td>
                                <td>${paciente.nombre}</td>
                                <td>${paciente.apellido}</td>
                                <td>${paciente.alta}</td>
                                <td>${paciente.domicilio.calle}, ${paciente.domicilio.numero}, ${paciente.domicilio.localidad}, ${paciente.domicilio.provincia}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm editar" data-id="${paciente.id}">Editar</button>
                                    <button class="btn btn-danger btn-sm eliminar" data-id="${paciente.id}">Eliminar</button>
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
        })
        .catch(() => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Error al cargar los pacientes</td></tr>';
        });
}

function modalCrearNuevo() {
    fetch("http://localhost:8080/domicilios")
        .then(response => response.json())
        .then(domicilios => {
            const domicilioOptions = domicilios.map(domicilio =>
                `<option value="${domicilio.id}">
                    ${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad}, ${domicilio.provincia}
                </option>`
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
                              <label for="domicilio" class="form-label">Domicilio</label>
                              <select class="form-control" id="domicilio">${domicilioOptions}</select>
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
                        domicilio: {
                            id: document.getElementById('domicilio').value
                        }
                    };

                    return fetch("http://localhost:8080/paciente", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(paciente)
                    }).then(response => response.json())
                      .then(data => {
                          if (data.errors) {
                              Swal.showValidationMessage(
                                  `Error: ${data.errors.join(", ")}`
                              );
                              throw new Error(data.errors.join(", "));
                          }
                          return data;
                      });
                }
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire('Creado!', 'El paciente ha sido creado.', 'success');
                    refreshPacientes();
                }
            }).catch(error => console.error('Error:', error));
        });
}


function modalEditarInformacion(id) {
    fetch(`http://localhost:8080/paciente/${id}`)
        .then(response => response.json())
        .then(data => {
            fetch("http://localhost:8080/domicilios")
                .then(response => response.json())
                .then(domicilios => {
                    const domicilioOptions = domicilios.map(domicilio =>
                        `<option value="${domicilio.id}" ${domicilio.id === data.domicilio.id ? 'selected' : ''}>
                            ${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad}, ${domicilio.provincia}
                        </option>`
                    ).join("");

                    const form = `<form id="editarForm">
                                    <div class="mb-3">
                                      <label for="dni" class="form-label">DNI</label>
                                      <input type="text" class="form-control" id="dni" value="${data.dni}">
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
                                      <input type="date" class="form-control" id="alta" value="${data.alta}">
                                    </div>
                                    <div class="mb-3">
                                      <label for="domicilio" class="form-label">Domicilio</label>
                                      <select class="form-control" id="domicilio">${domicilioOptions}</select>
                                    </div>
                                  </form>`;

                    Swal.fire({
                        title: "Editar Paciente",
                        html: form,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        preConfirm: () => {
                            const paciente = {
                                dni: document.getElementById('dni').value,
                                nombre: document.getElementById('nombre').value,
                                apellido: document.getElementById('apellido').value,
                                alta: document.getElementById('alta').value,
                                domicilio: {
                                    id: document.getElementById('domicilio').value
                                }
                            };

                            return fetch(`http://localhost:8080/paciente/${id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(paciente)
                            }).then(response => response.json())
                              .then(data => {
                                  if (data.errors) {
                                      Swal.showValidationMessage(
                                          `Error: ${data.errors.join(", ")}`
                                      );
                                      throw new Error(data.errors.join(", "));
                                  }
                                  return data;
                              });
                        }
                    }).then(result => {
                        if (result.isConfirmed) {
                            Swal.fire('Actualizado!', 'El paciente ha sido actualizado.', 'success');
                            refreshPacientes();
                        }
                    }).catch(error => console.error('Error:', error));
                });
        });
}


function modalConfirmarEliminar(id) {
    Swal.fire({
        title: `¿Seguro que deseas eliminar el paciente #${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        preConfirm: () => {
            return fetch(`http://localhost:8080/paciente/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    Swal.fire('Eliminado!', 'El paciente ha sido eliminado.', 'success');
                    refreshPacientes();
                } else {
                    return response.json().then(data => {
                        Swal.showValidationMessage(
                            `Error: ${data.errors ? data.errors.join(", ") : "No se pudo eliminar el paciente"}`
                        );
                    });
                }
            }).catch(error => console.error('Error:', error));
        }
    });
}
