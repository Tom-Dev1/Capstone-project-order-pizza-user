import BottomTabs from '@/components/BottomTabs';
import Header from '@/components/HeaderComponents/HeaderComponents';
import useCategories from '@/hooks/useCategories';
import useProducts from '@/hooks/useProductsFood';
import { CategoryModel } from '@/models/category.models';
import { ProductModels } from '@/models/product.models';
import React, { useEffect, useState } from 'react';


const OrderHome: React.FC = () => {
    const [filteredProducts, setFilteredProducts] = useState<ProductModels[]>([]);
    const [category, setCategory] = useState<CategoryModel[]>([]);
    const { foodCategory_id } = useCategories();
    const { products } = useProducts();


    console.log(foodCategory_id);


    // useEffect(() => {
    //     if (foodCategory_id && products) {
    //         const filtered = products.filter((product: any) => product.categoryId === foodCategory_id);
    //         console.log('filtered', filtered);
    //         setFilteredProducts(filtered);
    //     }
    // }, [foodCategory_id, products]);
    // setCategory(foodCategory_id);

    // console.log('filteredProducts', filteredProducts);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-col items-center mt-4">
                <h2 className="text-xl font-semibold">Products in this category:</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
                                <img
                                    src={product.image || 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F20200001_2.jpg&w=640&q=75'}
                                    alt={product.name}
                                    className="w-full h-40 object-cover mb-4 rounded"
                                />
                                <h3 className="text-lg font-bold">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                <p className="text-xl text-green-500">{product.price.toLocaleString()} VND</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available in this category.</p>
                    )}
                </div>
            </div>
            <BottomTabs />
        </div>
    );
};

export default OrderHome;
