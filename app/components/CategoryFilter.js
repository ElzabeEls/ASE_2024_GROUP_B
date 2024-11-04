const CategoryFilter = ({ categories, onCategoryChange }) => {
    const handleChange = (event) => {
      const selectedCategory = event.target.value;
      onCategoryChange(selectedCategory);
    };
  
    // Log categories before the return statement
    console.log('Categories:', categories);
  
    return (
      <div className="flex items-center space-x-2">
        <label htmlFor="category" className="text-gray-700">
          Categories:
        </label>
        <select
          id="categories"
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>
      </div>
    );
  };
  
  export default CategoryFilter;
  