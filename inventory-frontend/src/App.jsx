import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/items'

function App() {
  const [items, setItems] = useState([])
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  const fetchItems = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching items:', err))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleAddItem = (e) => {
    e.preventDefault()

    const newItem = {
      productName,
      category,
      quantity: Number(quantity),
      price: Number(price)
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
      .then(res => res.json())
      .then(() => {
        fetchItems()
        setProductName('')
        setCategory('')
        setQuantity('')
        setPrice('')
      })
      .catch(err => console.error('Error adding item:', err))
  }

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetchItems())
      .catch(err => console.error('Error deleting item:', err))
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>FDE Inventory Console</h1>

      <form onSubmit={handleAddItem} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={{ marginRight: '8px', padding: '6px', width: '90px' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ marginRight: '8px', padding: '6px', width: '90px' }}
        />
        <button type="submit" style={{ padding: '6px 12px' }}>Add Item</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{item.productName}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App