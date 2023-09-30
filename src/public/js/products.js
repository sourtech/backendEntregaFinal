const socket = io()
const products = document.getElementById('products');
const form = document.getElementById('nuevoProducto');

/* Borrado */
const deleteProduct = () => {
    document.querySelectorAll('.delete').forEach(el => el.addEventListener('click', event => {
        event.preventDefault();
        let idProduct = event.target.getAttribute("data-id");
        socket.emit('delete', idProduct);
    }));    
}
/* Agregar */
const getData = (form) =>{
    const formData = new FormData(form);  
    return Object.fromEntries(formData);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = getData(e.target);
    socket.emit('add', product);
    //por el momento no valido la respuesta para saber realmente si pudo agregarlo
    alert("Producto agregado con exito!");    
})
/* listado */
socket.on('products', data => {
    let list = '';
    data.forEach(prod => {        
        list +=`
            <div class="col-md-4">
                <div class="card text-bg-light mb-3">
                    <h4 class="card-header">#${prod.title}</h4>
                    <div class="card-body">
                        <p class="card-text">${prod.description}</p>                  
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Precio: ${prod.price} $</li>
                        <li class="list-group-item">Categoría: ${prod.category}</li>
                        <li class="list-group-item">Estado: ${prod.status}</li>
                        <li class="list-group-item">Stock: ${prod.stock}</li>
                        <li class="list-group-item">Imagenes: ${prod.thumbnail}</li>
                    </ul>  
                    <div class="card-body text-center">
                        <a href="#" class="btn btn-primary delete" data-id="${prod._id}">Borrar</a>                    
                    </div>                               
                </div>
            </div>
        `;        
    });
    products.innerHTML = list;
    deleteProduct();
})