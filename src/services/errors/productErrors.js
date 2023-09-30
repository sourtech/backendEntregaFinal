export const productErrorIncomplete = (product) =>{
    return `Uno o más parámetros obligatorios no fueron proporcionados:
    Propiedades obligatorias:
    * title: se esperaba una cadena definida, y se recibió ${product.title};
    * description: se esperaba una cadena definida, y se recibió ${product.description};
    * price: se esperaba Number, y se recibió ${product.price};
    * thumbnail: se esperaba un array, y se recibió ${product.thumbnail};
    * code: se esperaba una cadena definida, y se recibió ${product.code};
    * stock: se esperaba Number, y se recibió ${product.stock};
    * status: se esperaba Boolean, y se recibió ${product.status};
    * category: se esperaba una cadena definida, y se recibió ${product.category};
    `
}