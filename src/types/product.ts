import { CategoryModel } from "./category";
import { ProductOption } from "./product-option";

export interface ProductModel {
    id: string
    name: string
    price: number
    image: string
    imageUrl: string | null
    imagePublicId: string | null
    description: string
    categoryId: string
    productType: string
    category: CategoryModel | null
    options: ProductOption[]
}


export interface ProductsResult {
    items: ProductModel[]
    totalCount: number
}