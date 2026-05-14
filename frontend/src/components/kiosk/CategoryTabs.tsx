import { ProductCategory } from "../../lib/types";

type CategoryTabsProps = {
    categories: ProductCategory[];
    selectedCategory: ProductCategory;
    onSelectCategory: (category: ProductCategory) => void;
};

export default function CategoryTabs({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryTabsProps) {
    return (
        <div className="category-tabs">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`category-tab ${selectedCategory === category ? "active" : ""
                        }`}
                    onClick={() => onSelectCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}