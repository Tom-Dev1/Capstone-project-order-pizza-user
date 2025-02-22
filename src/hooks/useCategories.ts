
import { useState, useEffect } from 'react';
// import { CategoryModel } from '@/models/category.models';
import { getAllCategory } from '@/apis/category.api';
import { CategoryModel } from '@/models/category.models';

const useCategories = () => {
  // const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [foodCategory_id, setFoodCategory_Id] = useState<string>();
  const [drinkCategory_id, setDrinkCategory_Id] = useState<string>();
  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllCategory();
        if (response.result.items && response.result.items.length > 0) {
          const drinkCategory = response.result.items.find((category: CategoryModel) => category.id === "fb66e60f-a554-433a-898b-f31512b7fed4");
          if (drinkCategory) {
            setDrinkCategory_Id(drinkCategory.id);
          }
          const remainingCategories = response.result.items.filter((category: CategoryModel) => category.id !== "fb66e60f-a554-433a-898b-f31512b7fed4");
          if (remainingCategories.length > 0) {
            setFoodCategory_Id(remainingCategories[0].id);
          }
        }
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCategories();
  }, []);

  return { foodCategory_id, drinkCategory_id, loading, error };
};

export default useCategories;
