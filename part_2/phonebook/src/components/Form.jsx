const Form = (props) => {
  const {addName, newName, handleNewName, newNumber, handleNewNumber} = props
  return (
    <form onSubmit={addName}>
        <div>
          Name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNewNumber} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
  )
}

export default Form