import { ProductCategory } from "../../lib/types";

type CategoryTabsProps = {
    categories: ProductCategory[];
    selectedCategory: ProductCategory;
    onSelectCategory: (category: ProductCategory) => void;
};

function formatCategory(category) {
    return category
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

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
                    {formatCategory(category)}
                </button>
            ))}
        </div>
    );
}