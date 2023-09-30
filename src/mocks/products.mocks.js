import { faker } from "@faker-js/faker/locale/es";

//Documentacion
//https://fakerjs.dev/api/
export const generateProduct = () =>{
    const category = ["Drama", "Acción","Ciencia ficción","Romance", "Animación"];
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        thumbnail: [],
        code: faker.string.alphanumeric(10),
        stock: faker.number.int({ max: 20 }),
        status: faker.datatype.boolean(),
        category: faker.helpers.arrayElement(category),
        price: faker.commerce.price(),
        
    }
}