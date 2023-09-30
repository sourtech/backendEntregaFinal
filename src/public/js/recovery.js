const form = document.getElementById("loginForm");
const urlParams = new Proxy(new URLSearchParams(window.location.search),{
    get : (searchParams,prop) => searchParams.get(prop)
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    obj.token = urlParams.token;
    const response = await fetch("/api/sessions/recovery", {
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
            icon: "success",
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

});