const form = document.getElementById('registerForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    Swal.fire({title: "Registrando...",html: "Espere por favor"});
    Swal.showLoading();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseData = await response.json();
    Swal.close();
    if (responseData.status === 'success') {
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: 'Gracias por registrarte',
            icon: "success",
        });
        setTimeout(() => {  window.location.replace("/login"); }, 1000);
    } else {
        //console.log(responseData);
        //alert("aca");
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: responseData.error,
            icon: "error",
        });
    }
});