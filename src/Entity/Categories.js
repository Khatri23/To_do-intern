import { EntitySchema } from "typeorm";

export default new EntitySchema({
    name : "Categories",
    tableName : "categories",
    columns : {
        id:{
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar",
            length: 255
        }
    },
    relations:{
        Products:{
            type: "one-to-many",
            target: "products"
        }
    }
});