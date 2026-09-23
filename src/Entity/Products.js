import {EntitySchema} from "typeorm";

export default new EntitySchema({
    name: "Products",
    tableName:"products",
    columns:{
        id:{
            type:"int",
            primary: true,
            generated: true
        },
        name:{
            type: "varchar",
            length: 255
        },
        description:{
            type: "text"
        },
        price: {
            type: "float"
        },
        stock: {
            type: "int"
        },
        imageURL : {
            type : "text"
        }
    },
    relations:{
        Category: {
            type:"many-to-one",
            target : "categories"
        }
    }
});