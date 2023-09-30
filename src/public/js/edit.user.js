const form = document.getElementById('nuevoUsuario');
const userID = document.getElementById('idUser');
const deleteBtn = document.querySelectorAll('.delete');
const selectRol = document.getElementById('selectRol');
const RoleActual = document.getElementById("role");
const deleteUsers = document.getElementById("deleteUsers");

deleteUsers.addEventListener('click', async (e) => {
    e.preventDefault();
    Swal.fire({title: "Eliminando...",html: "Espere por favor"});
    Swal.showLoading();
    const responseProcess = await fetch("/api/users/", {
        method: "DELETE"
    });
    Swal.close();
    const r = await responseProcess.json();
    if (r.status === "success") {
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: 'Usuarios eliminados correctamente',
            icon: "success",
        });
        setTimeout(() => {  window.location.replace("/admin/users"); }, 1500);
    } else {
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: r.payload,
            icon: "error",
        });
    }
});
//dejo seleccionado el rol del usuario
if(RoleActual){
    for (var i=0; i<selectRol.options.length; i++) {
        let opt = selectRol.options[i];
        if(opt.value === RoleActual.value)  opt.setAttribute('selected', true);
    }
}


if(deleteBtn){
    deleteBtn.forEach((item) => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            Swal.fire({title: "Eliminando...",html: "Espere por favor"});
            Swal.showLoading();
            const responseDelete = await fetch("/api/users/"+item.dataset.user, {
                method: "DELETE"
            });
            Swal.close();
            const responseDeleteData = await responseDelete.json();
            if (responseDeleteData.status === "success") {
                Swal.fire({
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2500,
                    title: 'Usuario eliminado correctamente',
                    icon: "success",
                });
                setTimeout(() => {  window.location.replace("/admin/users"); }, 1500);
            } else {
                Swal.fire({
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2500,
                    title: responseDeleteData.error,
                    icon: "error",
                });
            }
        });
      });
}

if(form){
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let message = '';
        let response = '';
        const data = new FormData(form);
        const obj = {};
        data.forEach((value, key) => (obj[key] = value)); 
        message = 'Usuario actualizado correctamente';
        response = await fetch("/api/users/"+userID.value, {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });    
        const resposeData = await response.json();    
        if (resposeData.status === "success") {
            Swal.fire({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2500,
                title: message,
                icon: "success",
            });
            setTimeout(() => {  window.location.replace("/admin/users"); }, 1500);
        } else {
            Swal.fire({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2500,
                title: resposeData.error,
                icon: "error",
            });
        }
    })
}