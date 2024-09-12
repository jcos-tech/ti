window.addEventListener("load", () => {
    const nuevo = document.querySelector("#crear");
    nuevo.addEventListener("click", () => {
        modalCrearNuevo();
    });

    refreshOdontologos();
});

function refreshOdontologos() {
    fetch("http://localhost:8080/odontologos")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ''; // Limpiar el tbody antes de llenarlo

            data.forEach(odontologo => {
                const tr = document.createElement('tr');

                tr.innerHTML = `<td>${odontologo.id}</td>
                                <td>${odontologo.matricula}</td>
                                <td>${odontologo.nombre}</td>
                                <td>${odontologo.apellido}</td>
                                <td>${odontologo.domicilio ? `${odontologo.domicilio.calle} ${odontologo.domicilio.numero}, ${odontologo.domicilio.localidad}, ${odontologo.domicilio.provincia}` : 'Sin domicilio'}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm editar" data-id="${odontologo.id}">Editar</button>
                                    <button class="btn btn-danger btn-sm eliminar" data-id="${odontologo.id}">Eliminar</button>
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
                              <label for="matricula" class="form-label">Matrícula</label>
                              <input type="text" class="form-control" id="matricula">
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
                              <label for="domicilio" class="form-label">Domicilio</label>
                              <select class="form-control" id="domicilio">${domicilioOptions}</select>
                            </div>
                          </form>`;

            Swal.fire({
                title: "Crear nuevo Odontólogo",
                html: form,
                showCancelButton: true,
                confirmButtonText: 'Crear',
                preConfirm: () => {
                    const odontologo = {
                        matricula: document.getElementById('matricula').value,
                        nombre: document.getElementById('nombre').value,
                        apellido: document.getElementById('apellido').value,
                        domicilio: {
                            id: document.getElementById('domicilio').value
                        }
                    };

                    return fetch("http://localhost:8080/odontologo", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(odontologo)
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
                    Swal.fire('Creado!', 'El odontólogo ha sido creado.', 'success');
                    refreshOdontologos();
                }
            }).catch(error => console.error('Error:', error));
        });
}

function modalEditarInformacion(id) {
    fetch(`http://localhost:8080/odontologo/${id}`)
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
                                      <label for="matricula" class="form-label">Matrícula</label>
                                      <input type="text" class="form-control" id="matricula" value="${data.matricula}">
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
                                      <label for="domicilio" class="form-label">Domicilio</label>
                                      <select class="form-control" id="domicilio">${domicilioOptions}</select>
                                    </div>
                                  </form>`;

                    Swal.fire({
                        title: "Editar Odontólogo",
                        html: form,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        preConfirm: () => {
                            const odontologo = {
                                matricula: document.getElementById('matricula').value,
                                nombre: document.getElementById('nombre').value,
                                apellido: document.getElementById('apellido').value,
                                domicilio: {
                                    id: document.getElementById('domicilio').value
                                }
                            };

                            return fetch(`http://localhost:8080/odontologo/${id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(odontologo)
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
                            Swal.fire('Actualizado!', 'El odontólogo ha sido actualizado.', 'success');
                            refreshOdontologos();
                        }
                    }).catch(error => console.error('Error:', error));
                });
        });
}



function modalConfirmarEliminar(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás recuperar este odontólogo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:8080/odontologo/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    Swal.fire('Eliminado!', 'El odontólogo ha sido eliminado.', 'success');
                    refreshOdontologos();
                } else {
                    Swal.fire('Error!', 'No se pudo eliminar el odontólogo.', 'error');
                }
            }).catch(error => console.error('Error:', error));
        }
    });
}

