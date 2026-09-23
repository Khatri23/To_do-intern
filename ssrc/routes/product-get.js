import koarouter from "koa-router";
import {
    display_product_list,
    get_product_by_id
} from "../controller/get_product.js"

const router = new koarouter({prefix:"/products"});
router.get("/",display_product_list);

router.get("/:id", get_product_by_id);

export default router;