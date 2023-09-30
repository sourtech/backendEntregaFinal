const form = document.getElementById('documentos');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form); 
    //console.log(Array.from(data));
    //console.log(productID.value);
    const response = await fetch("/api/users/documents", {
        method: "POST",
        body: data,
    });
    const resposeData = await response.json();
    if (resposeData.status === "success") {
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: 'Documentos subidos correctamente!',
            icon: "success",
        });
        setTimeout(() => {  window.location.replace("/documents"); }, 1500);
    } else {
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: resposeData.payload.error,
            icon: "error",
        });
    }
})
