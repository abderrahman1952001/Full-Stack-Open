const Filter = ({ filter, handleFilter }) => (
    <div>
      Filter shown people with: <input value={filter} onChange={handleFilter} />
    </div>
  )

export default Filter