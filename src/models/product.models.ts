import { CategoryModel } from "./category.models";
import ProductOptionModels from "./product-option.models";

export interface ProductModels {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    categoryId: string;
    productType: number;
    category: CategoryModel | null;
    productOption: ProductOptionModels | null;
}

export interface ProductsResult {
    items: ProductModels[];
    totalCount: number;
}