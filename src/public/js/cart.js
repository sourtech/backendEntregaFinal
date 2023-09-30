const form = document.getElementById('submit');
const toCart = document.querySelectorAll('.addToCart'); 
const removeProd = document.querySelectorAll('.removeProd');

if(form){
    form.addEventListener('click', async (e) => {
        Swal.fire({title: "Procesando...",html: "Espere por favor"});
        Swal.showLoading();
    });
}

if(removeProd){
    removeProd.forEach((prod) => {
        prod.addEventListener('click', async (e) => {
           e.preventDefault();
           Swal.fire({title: "Eliminado...",html: "Espere por favor"});
           Swal.showLoading();
           let productID = prod.dataset.id;
           prod.disabled = true;
           response = await fetch("/api/carts/remove/"+productID, {
               method: "GET"
           });
           Swal.close();
           const resposeData = await response.json();
           if (resposeData.status === "success") {
                Swal.fire({
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2500,
                    title: resposeData.payload.message,
                    icon: "success",
                });
                setTimeout(() => {  window.location.replace(resposeData.payload.redirect); }, 1000);
            } else {
                let message = response.status==403 ? 'para agregar productos crea tu usuario' :resposeData.error
                Swal.fire({
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2500,
                    title: message,
                    icon: "error",
                });
            }
            prod.disabled = false;
        })
    });
}

if(toCart){
    toCart.forEach((prod) => {
        prod.addEventListener('click', async (e) => {
           let productID = prod.dataset.id;
           prod.disabled = true;
           response = await fetch("/api/carts/add/"+productID, {
               method: "GET"
           });
           const resposeData = await response.json();
           if (resposeData.status === "success") {
                Swal.fire({
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2500,
                    title: resposeData.payload.message,
                    icon: "success",
                });
            } else {
                let message = response.status==403 ? 'para agregar productos crea tu usuario' :resposeData.error
                Swal.fire({
                    toast: true,
                    position: "top",
                    showConfirmButton: false,
                    timer: 2500,
                    title: message,
                    icon: "error",
                });
            }
            prod.disabled = false;
        })
    });
}

