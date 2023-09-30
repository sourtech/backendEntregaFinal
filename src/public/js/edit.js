const form = document.getElementById('nuevoProducto');
const productID = document.getElementById('idProduct');
const deleteBtn = document.querySelectorAll('.delete');

if(deleteBtn){
    deleteBtn.forEach((item) => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            Swal.fire({title: "Cargando...",html: "Espere por favor"});
            Swal.showLoading();
            const responseDelete = await fetch("/api/products/"+item.dataset.product, {
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
                    title: 'Producto eliminado correctamente',
                    icon: "success",
                });
                setTimeout(() => {  window.location.replace("/admin/products"); }, 1500);
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
        });
      });
}

if(form){
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let message = '';
        let response = '';
        const data = new FormData(form); 
        //console.log(Array.from(data));
        //console.log(productID.value);
        if(productID.value){
            message = 'Producto actualizado correctamente';
            response = await fetch("/api/products/"+productID.value, {
                method: "PUT",
                body: data,
            });
        }else{
            message = 'Producto creado correctamente';
            response = await fetch("/api/products/", {
                method: "POST",
                body: data,
            });
        }
    
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
            setTimeout(() => {  window.location.replace("/admin/products"); }, 1500);
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

