import ProductOptionItems from "./option-items";

export default interface ProductOptionModels {
    id: string,
    name: string,
    description: string,
    optionItems: ProductOptionItems[]
}


