window.addEventListener("load", () => {

    const nuevo = document.querySelector("#crear");
    nuevo.addEventListener("click", () => {
        modalCrearNuevo();
    });

    fetchDomicilios();
});

function fetchDomicilios() {
    fetch("http://localhost:8080/domicilios")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ''; // Limpiar el contenido previo

            data.forEach(domicilio => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${domicilio.id}</td>
                    <td>${domicilio.calle}</td>
                    <td>${domicilio.numero}</td>
                    <td>${domicilio.localidad}</td>
                    <td>${domicilio.provincia}</td>
                    <td>
                        <button class="btn btn-sm btn-warning mr-2 editar">Editar</button>
                        <button class="btn btn-sm btn-danger eliminar">Eliminar</button>
                    </td>
                `;

                const btnEditar = tr.querySelector('.editar');
                const btnEliminar = tr.querySelector('.eliminar');

                btnEditar.addEventListener("click", () => { modalEditarInformacion(domicilio.id) });
                btnEliminar.addEventListener("click", () => { modalConfirmarEliminar(domicilio.id) });

                tbody.appendChild(tr);
            });
        })
        .catch(() => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Error al cargar los domicilios</td></tr>';
        });
}

function modalCrearNuevo() {
    const form = `<form id="crearForm">
                    <div class="mb-3">
                      <label for="calle" class="form-label">Calle</label>
                      <input type="text" class="form-control" id="calle">
                    </div>
                    <div class="mb-3">
                      <label for="numero" class="form-label">Numero</label>
                      <input type="text" class="form-control" id="numero">
                    </div>
                    <div class="mb-3">
                      <label for="localidad" class="form-label">Localidad</label>
                      <input type="text" class="form-control" id="localidad">
                    </div>
                    <div class="mb-3">
                      <label for="provincia" class="form-label">Provincia</label>
                      <input type="text" class="form-control" id="provincia">
                    </div>
                  </form>`;

    Swal.fire({
        title: "Crear nuevo Domicilio",
        html: form,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        preConfirm: () => {
            const domicilio = {
                calle: document.getElementById('calle').value,
                numero: document.getElementById('numero').value,
                localidad: document.getElementById('localidad').value,
                provincia: document.getElementById('provincia').value
            };

            return fetch("http://localhost:8080/domicilio", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(domicilio)
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        let errorMessage = "Error desconocido del servidor.";
                        if (typeof err.errors === 'string') {
                            errorMessage = err.errors;
                        } else if (typeof err.errors === 'object') {
                            errorMessage = Object.values(err.errors).join(", ");
                        }
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            }).catch(error => {
                Swal.showValidationMessage(`Error: ${error.message}`);
                throw error;
            });
        }
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire('Creado!', 'El domicilio ha sido creado.', 'success');
            refreshDomicilios(); // Refresca la lista después de crear
        }
    }).catch(error => {
        console.error('Error al crear el domicilio:', error);
        Swal.fire('Error!', `No se pudo crear el domicilio: ${error.message}`, 'error');
    });
}


function modalEditarInformacion(id) {
    fetch(`http://localhost:8080/domicilio/${id}`)
        .then(response => response.json())
        .then(data => {
            const form = `<form id="editarForm">
                            <div class="mb-3">
                              <label for="calle" class="form-label">Calle</label>
                              <input type="text" class="form-control" id="calle" value="${data.calle}">
                            </div>
                            <div class="mb-3">
                              <label for="numero" class="form-label">Numero</label>
                              <input type="text" class="form-control" id="numero" value="${data.numero}">
                            </div>
                            <div class="mb-3">
                              <label for="localidad" class="form-label">Localidad</label>
                              <input type="text" class="form-control" id="localidad" value="${data.localidad}">
                            </div>
                            <div class="mb-3">
                              <label for="provincia" class="form-label">Provincia</label>
                              <input type="text" class="form-control" id="provincia" value="${data.provincia}">
                            </div>
                          </form>`;

            Swal.fire({
                title: `Editar Domicilio #${id}`,
                html: form,
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                preConfirm: () => {
                    const domicilio = {
                        calle: document.getElementById('calle').value,
                        numero: document.getElementById('numero').value,
                        localidad: document.getElementById('localidad').value,
                        provincia: document.getElementById('provincia').value
                    };

                    return fetch(`http://localhost:8080/domicilio/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(domicilio)
                    }).then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                let errorMessage = "Error desconocido del servidor.";
                                if (typeof err.errors === 'string') {
                                    errorMessage = err.errors;
                                } else if (typeof err.errors === 'object') {
                                    errorMessage = Object.values(err.errors).join(", ");
                                }
                                throw new Error(errorMessage);
                            });
                        }
                        return response.json();
                    }).catch(error => {
                        Swal.showValidationMessage(`Error: ${error.message}`);
                        throw error;
                    });
                }
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire('Modificado!', 'El domicilio ha sido actualizado.', 'success');
                    refreshDomicilios();
                }
            }).catch(error => {
                console.error('Error al editar el domicilio:', error);
                Swal.fire('Error!', `No se pudo editar el domicilio: ${error.message}`, 'error');
            });
        });
}


function modalConfirmarEliminar(id) {
    Swal.fire({
        title: `¿Seguro que deseas eliminar el domicilio #${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        preConfirm: () => {
            return fetch(`http://localhost:8080/domicilio/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        let errorMessage = "Error desconocido del servidor.";
                        if (typeof err.errors === 'string') {
                            errorMessage = err.errors;
                        } else if (typeof err.errors === 'object') {
                            errorMessage = Object.values(err.errors).join(", ");
                        }
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            }).catch(error => {
                Swal.showValidationMessage(`Error: ${error.message}`);
                throw error;
            });
        }
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire('Eliminado!', 'El domicilio ha sido eliminado.', 'success');
            refreshDomicilios();
        }
    }).catch(error => {
        console.error('Error al eliminar el domicilio:', error);
        Swal.fire('Error!', `No se pudo eliminar el domicilio: ${error.message}`, 'error');
    });
}

function refreshDomicilios() {
    fetchDomicilios();
}
