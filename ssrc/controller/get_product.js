import { AppDataSource } from "../server.js";
import Products from "../Entity/Products.js";

export async function display_product_list(ctx) {
    const productrepo = AppDataSource.getRepository(Products);
    const data = await productrepo.find({
        relations:{
            Category: true
        }
    });
    ctx.body = data;
}

export async function get_product_by_id(ctx) {
    const productrepo = AppDataSource.getRepository(Products);
    const data = await productrepo.findOne({
        where:{
            id : ctx.params.id
        },
        relations:{
            Category: true
        }
    })
    if(!data) {
        ctx.throw(404,"Not found");
    } else {
        ctx.body = data;
    }
}