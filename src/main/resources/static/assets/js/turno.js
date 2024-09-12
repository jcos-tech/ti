window.addEventListener("load", () => {
    const nuevo = document.querySelector("#crear");
    nuevo.addEventListener("click", () => {
        modalCrearNuevo();
    });

    refreshTurnos();
});

function refreshTurnos() {
    fetch("http://localhost:8080/turnos")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = '';

            data.forEach(turno => {
                const tr = document.createElement('tr');

                tr.innerHTML = `<td>${turno.id}</td>
                                <td>${turno.odontologo.nombre} ${turno.odontologo.apellido}</td>
                                <td>${turno.paciente.nombre} ${turno.paciente.apellido}</td>
                                <td>${turno.fecha}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm editar" data-id="${turno.id}">Editar</button>
                                    <button class="btn btn-danger btn-sm eliminar" data-id="${turno.id}">Eliminar</button>
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
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error al cargar los turnos</td></tr>';
        });
}

function modalCrearNuevo() {
    Promise.all([
        fetch("http://localhost:8080/odontologos").then(response => response.json()),
        fetch("http://localhost:8080/pacientes").then(response => response.json())
    ]).then(([odontologos, pacientes]) => {
        const odontologoOptions = odontologos.map(odontologo =>
            `<option value="${odontologo.id}">${odontologo.nombre} ${odontologo.apellido}</option>`
        ).join("");

        const pacienteOptions = pacientes.map(paciente =>
            `<option value="${paciente.id}">${paciente.nombre} ${paciente.apellido}</option>`
        ).join("");

        const form = `<form id="crearForm">
                        <div class="mb-3">
                          <label for="odontologo" class="form-label">Odontólogo</label>
                          <select class="form-control" id="odontologo">${odontologoOptions}</select>
                        </div>
                        <div class="mb-3">
                          <label for="paciente" class="form-label">Paciente</label>
                          <select class="form-control" id="paciente">${pacienteOptions}</select>
                        </div>
                        <div class="mb-3">
                          <label for="fecha" class="form-label">Fecha</label>
                          <input type="date" class="form-control" id="fecha">
                        </div>
                      </form>`;

        Swal.fire({
            title: "Crear nuevo Turno",
            html: form,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            preConfirm: () => {
                const selectedOdontologoId = document.getElementById('odontologo').value;
                const selectedPacienteId = document.getElementById('paciente').value;
                const fecha = document.getElementById('fecha').value;

                // Obtener los objetos completos de Odontologo y Paciente
                const odontologo = odontologos.find(od => od.id == selectedOdontologoId);
                const paciente = pacientes.find(pa => pa.id == selectedPacienteId);

                const turno = {
                    odontologo: odontologo,  // Enviar el objeto completo
                    paciente: paciente,      // Enviar el objeto completo
                    fecha: fecha
                };

                return fetch("http://localhost:8080/turno", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(turno)
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
                Swal.fire('Creado!', 'El turno ha sido creado.', 'success');
                refreshTurnos();
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function modalEditarInformacion(id) {
    fetch(`http://localhost:8080/turno/${id}`)
        .then(response => response.json())
        .then(turno => {
            Promise.all([
                fetch("http://localhost:8080/odontologos").then(response => response.json()),
                fetch("http://localhost:8080/pacientes").then(response => response.json())
            ]).then(([odontologos, pacientes]) => {
                const odontologoOptions = odontologos.map(odontologo =>
                    `<option value="${odontologo.id}" ${odontologo.id === turno.odontologo.id ? 'selected' : ''}>${odontologo.nombre} ${odontologo.apellido}</option>`
                ).join("");

                const pacienteOptions = pacientes.map(paciente =>
                    `<option value="${paciente.id}" ${paciente.id === turno.paciente.id ? 'selected' : ''}>${paciente.nombre} ${paciente.apellido}</option>`
                ).join("");

                const form = `<form id="editarForm">
                                <div class="mb-3">
                                  <label for="odontologo" class="form-label">Odontólogo</label>
                                  <select class="form-control" id="odontologo">${odontologoOptions}</select>
                                </div>
                                <div class="mb-3">
                                  <label for="paciente" class="form-label">Paciente</label>
                                  <select class="form-control" id="paciente">${pacienteOptions}</select>
                                </div>
                                <div class="mb-3">
                                  <label for="fecha" class="form-label">Fecha</label>
                                  <input type="date" class="form-control" id="fecha" value="${turno.fecha}">
                                </div>
                              </form>`;

                Swal.fire({
                    title: `Editar Turno #${id}`,
                    html: form,
                    showCancelButton: true,
                    confirmButtonText: 'Actualizar',
                    preConfirm: () => {
                        const selectedOdontologoId = document.getElementById('odontologo').value;
                        const selectedPacienteId = document.getElementById('paciente').value;
                        const fecha = document.getElementById('fecha').value;

                        // Obtener los objetos completos de Odontologo y Paciente
                        const odontologo = odontologos.find(od => od.id == selectedOdontologoId);
                        const paciente = pacientes.find(pa => pa.id == selectedPacienteId);

                        const updatedTurno = {
                            id: id,
                            odontologo: odontologo,  // Enviar el objeto completo
                            paciente: paciente,      // Enviar el objeto completo
                            fecha: fecha
                        };

                        return fetch(`http://localhost:8080/turno/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedTurno)
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
                        Swal.fire('Modificado!', 'El turno ha sido actualizado.', 'success');
                        refreshTurnos();
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });
}

function modalConfirmarEliminar(id) {
    Swal.fire({
        title: `¿Seguro que deseas eliminar el turno #${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        preConfirm: () => {
            return fetch(`http://localhost:8080/turno/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    Swal.fire('Eliminado!', 'El turno ha sido eliminado.', 'success');
                    refreshTurnos();
                } else {
                    return response.json().then(data => {
                        Swal.showValidationMessage(
                            `Error: ${data.errors ? data.errors.join(", ") : "No se pudo eliminar el turno"}`
                        );
                    });
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
}


