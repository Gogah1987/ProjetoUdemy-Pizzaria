import { Request, Response } from "express";
import { ListByProductService } from "../../services/product/ListByProductService";


class ListByCategoryController{
    async handle(req: Request, res: Response){
        const category_id = req.query.category_id as string;

        const listByCategory = new ListByProductService();

        const products = await listByCategory.execute({
            category_id
        });

        return res.json(products)
    }

}

export { ListByCategoryController }