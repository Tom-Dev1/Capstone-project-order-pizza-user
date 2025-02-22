
import { CategoryModel } from '@/types/category';

interface CategoryTitleProps {
    categories: CategoryModel[];
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ categories }) => {
    return (
        <div>
            {categories.map((item) => (
                <div key={item.id}>
                    <h1>{item.name}</h1>
                    <h1>{item.description}</h1>
                </div>
            ))}
        </div>
    );
};

export default CategoryTitle;