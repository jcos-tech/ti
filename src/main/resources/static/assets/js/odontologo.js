window.addEventListener("load", (event) => {
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

                tr.innerHTML = `<td>${odontologo.matricula}</td>
                                <td>${odontologo.nombre}</td>
                                <td>${odontologo.apellido}</td>
                                <td>${odontologo.domicilio ? odontologo.domicilio.calle : 'N/A'}</td>
                                <td>${odontologo.domicilio ? odontologo.domicilio.numero : 'N/A'}</td>
                                <td>${odontologo.domicilio ? odontologo.domicilio.localidad : 'N/A'}</td>
                                <td>${odontologo.domicilio ? odontologo.domicilio.provincia : 'N/A'}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm editar" data-id="${odontologo.matricula}">Editar</button>
                                    <button class="btn btn-danger btn-sm eliminar" data-id="${odontologo.matricula}">Eliminar</button>
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
    fetch("http://localhost:8080/domicilios")  // Suponiendo que esta es la URL para obtener las direcciones
        .then(response => response.json())
        .then(domicilios => {
            const dropdownOptions = domicilios.map(domicilio =>
                `<option value="${domicilio.id}">${domicilio.calle}, ${domicilio.numero}, ${domicilio.localidad}, ${domicidio.provincia}</option>`
            ).join("");

            const form = `<form id="crearForm">
                            <div class="mb-3">
                              <label for="matricula" class="form-label">Matrícula</label>
                              <input type="text" class="form-control" id="matricula" required>
                            </div>
                            <div class="mb-3">
                              <label for="nombre" class="form-label">Nombre</label>
                              <input type="text" class="form-control" id="nombre" required>
                            </div>
                            <div class="mb-3">
                              <label for="apellido" class="form-label">Apellido</label>
                              <input type="text" class="form-control" id="apellido" required>
                            </div>
                            <div class="mb-3">
                              <label for="domicilio" class="form-label">Dirección</label>
                              <select class="form-control" id="domicilio" required>${dropdownOptions}</select>
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
                        domicilioId: document.getElementById('domicilio').value
                    };

                    return fetch("http://localhost:8080/odontologo", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(odontologo)
                    }).then(response => response.json());
                }
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire('Creado!', 'El odontólogo ha sido creado.', 'success');
                    refreshOdontologos();
                }
            }).catch(error => {
                console.error('Error al crear el odontólogo:', error);
                Swal.fire('Error!', 'No se pudo crear el odontólogo.', 'error');
            });
        })
        .catch(error => {
            console.error('Error al cargar domicilios:', error);
            Swal.fire('Error!', 'No se pudieron cargar los domicilios.', 'error');
        });
}

function modalEditarInformacion(matricula) {
    fetch(`http://localhost:8080/odontologo/${matricula}`)
        .then(response => response.json())
        .then(data => {
            fetch("http://localhost:8080/domicilios")
                .then(response => response.json())
                .then(domicilios => {
                    const dropdownOptions = domicilios.map(domicilio =>
                        `<option value="${domicilio.id}" ${domicilio.id === data.domicilio.id ? 'selected' : ''}>${domicilio.calle}, ${domicilio.numero}, ${domicidio.localidad}, ${domicidio.provincia}</option>`
                    ).join("");

                    const form = `<form id="editarForm">
                                    <div class="mb-3">
                                      <label for="matricula" class="form-label">Matrícula</label>
                                      <input type="text" class="form-control" id="matricula" value="${data.matricula}" disabled>
                                    </div>
                                    <div class="mb-3">
                                      <label for="nombre" class="form-label">Nombre</label>
                                      <input type="text" class="form-control" id="nombre" value="${data.nombre}" required>
                                    </div>
                                    <div class="mb-3">
                                      <label for="apellido" class="form-label">Apellido</label>
                                      <input type="text" class="form-control" id="apellido" value="${data.apellido}" required>
                                    </div>
                                    <div class="mb-3">
                                      <label for="domicilio" class="form-label">Dirección</label>
                                      <select class="form-control" id="domicilio" required>${dropdownOptions}</select>
                                    </div>
                                  </form>`;

                    Swal.fire({
                        title: `Editar Odontólogo #${matricula}`,
                        html: form,
                        showCancelButton: true,
                        confirmButtonText: 'Actualizar',
                        preConfirm: () => {
                            const odontologo = {
                                nombre: document.getElementById('nombre').value,
                                apellido: document.getElementById('apellido').value,
                                domicilioId: document.getElementById('domicilio').value
                            };

                            return fetch(`http://localhost:8080/odontologo/${matricula}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(odontologo)
                            }).then(response => response.json());
                        }
                    }).then(result => {
                        if (result.isConfirmed) {
                            Swal.fire('Modificado!', 'El odontólogo ha sido actualizado.', 'success');
                            refreshOdontologos();
                        }
                    }).catch(error => {
                        console.error('Error al actualizar el odontólogo:', error);
                        Swal.fire('Error!', 'No se pudo actualizar el odontólogo.', 'error');
                    });
                })
                .catch(error => {
                    console.error('Error al cargar domicilios:', error);
                    Swal.fire('Error!', 'No se pudieron cargar los domicilios.', 'error');
                });
        })
        .catch(error => {
            console.error('Error al obtener el odontólogo:', error);
            Swal.fire('Error!', 'No se pudo obtener la información del odontólogo.', 'error');
        });
}

function modalConfirmarEliminar(matricula) {
    Swal.fire({
        title: `¿Seguro que deseas eliminar el odontólogo #${matricula}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        preConfirm: () => {
            return fetch(`http://localhost:8080/odontologo/${matricula}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    Swal.fire('Eliminado!', 'El odontólogo ha sido eliminado.', 'success');
                    refreshOdontologos();
                } else {
                    Swal.fire('Error!', 'No se pudo eliminar el odontólogo.', 'error');
                }
            }).catch(error => {
                console.error('Error al eliminar el odontólogo:', error);
                Swal.fire('Error!', 'No se pudo eliminar el odontólogo.', 'error');
            });
        }
    });
}
