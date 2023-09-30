const form = document.getElementById("loginForm");
const button = document.querySelector("button");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    //deshabilito boton
    button.disabled = true;
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    const response = await fetch("/api/sessions/forgot", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "content-type": "application/json",
        },
    });

    const resposeData = await response.json();
    //console.log(resposeData)
    if (resposeData.status === "success") {
        Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2500,
            title: resposeData.message,
            icon: "info",
        });
        setTimeout(() => {  window.location.replace("/login"); }, 3000);
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
    button.disabled = false;
});