import { CategoryModel } from "./category";

export interface ProductModel {
    id: string
    name: string
    price: number
    imageUrl: string
    description: string
    categoryId: string
    productType: "HotKitchen" | "ColdKitchen"
    category: CategoryModel | null
    options: Option[]
}

export interface Option {
    id: string;
    name: string;
    description: string;
    optionItems: OptionItem[];
}

export default interface OptionItem {
    id: string,
    name: string,
    additionalPrice: number
}


export interface ProductsResult {
    items: ProductModel[]
    totalCount: number
}