import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/items'

function App() {
  const [items, setItems] = useState([])
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState(null)

  const fetchItems = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching items:', err))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const resetForm = () => {
    setProductName('')
    setCategory('')
    setQuantity('')
    setPrice('')
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const itemData = {
      productName,
      category,
      quantity: Number(quantity),
      price: Number(price)
    }

    if (editingId) {
      // Update existing item
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      })
        .then(res => res.json())
        .then(() => {
          fetchItems()
          resetForm()
        })
        .catch(err => console.error('Error updating item:', err))
    } else {
      // Create new item
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      })
        .then(res => res.json())
        .then(() => {
          fetchItems()
          resetForm()
        })
        .catch(err => console.error('Error adding item:', err))
    }
  }

  const handleEditClick = (item) => {
    setEditingId(item.id)
    setProductName(item.productName || '')
    setCategory(item.category || '')
    setQuantity(item.quantity ?? '')
    setPrice(item.price ?? '')
  }

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchItems()
        if (editingId === id) resetForm()
      })
      .catch(err => console.error('Error deleting item:', err))
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>FDE Inventory Console</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
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
        <button type="submit" style={{ padding: '6px 12px' }}>
          {editingId ? 'Update Item' : 'Add Item'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ padding: '6px 12px', marginLeft: '8px' }}
          >
            Cancel
          </button>
        )}
      </form>

      {editingId && (
        <p style={{ color: '#888', marginTop: 0, marginBottom: '20px' }}>
          Editing item #{editingId}
        </p>
      )}

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
                <button onClick={() => handleEditClick(item)} style={{ marginRight: '6px' }}>
                  Edit
                </button>
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