import { CategoryModel } from "./category";
export interface ProductModel {
    id: string
    name: string
    price: number
    imageUrl: string
    description: string
    categoryId: string
    productType: ProductType
    category: CategoryModel | null
    productRole: ProductRole
    productStatus: ProductStatus
    productOptions: ProductOption[]
    childProducts: ChildProducts[]
    productComboSlots: ProductComboSlots[]

}
export type ProductRole = "Master" | "Child" | "Combo"
export type ProductStatus = "Available" | "OutOfIngredient" | "Locked"
export type ProductType = "HotKitchen" | "ColdKitchen"
export interface ProductComboSlots {
    id: string
    slotName: string
    productComboSlotItems: ProductComboSlotItem[]
}
export interface ProductComboSlotItem {
    id: string
    productId: string
    product: ChildProducts
}
export interface ChildProducts {
    id: string
    name: string
    price: number
}
export interface ProductOption {
    id: string;
    optionId: string;
    option: Option
}
export interface Option {
    id: string;
    name: string;
    selectMany: boolean
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