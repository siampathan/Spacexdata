const SearchFilter = ({ search, handleChange }: any) => {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchFilter;
