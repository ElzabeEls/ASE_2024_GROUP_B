// components/CategoryFilter.js
const CategoryFilter = ({ categories, onCategoryChange }) => {
        const handleChange = (event) => {
            const selectedCategory = event.target.value;
            onCategoryChange(selectedCategory); // Call the onCategoryChange function with the selected category
        };
    
        return (
            <div className="flex items-center space-x-2">
                <label htmlFor="category" className="text-gray-700">Category:</label>
                <select
                    id="category"
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    onChange={handleChange} // Add onChange handler
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>
            </div>
        );
    };
    
    export default CategoryFilter;
    