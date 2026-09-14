import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/items'
const AUTH_URL = 'http://localhost:8080/auth'
const PAGE_SIZE = 5

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || null)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const handleLogout = () => {
    localStorage.removeItem('jwt_token')
    setToken(null)
    setItems([])
  }

  const fetchItems = () => {
    if (!token) return
    setLoading(true)
    const params = new URLSearchParams({
      page: page,
      size: PAGE_SIZE,
    })
    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim())
    }

    fetch(`${API_URL}/search?${params.toString()}`, {
      headers: authHeaders(),
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          handleLogout()
          throw new Error('Session expired')
        }
        return res.json()
      })
      .then(data => {
        setItems(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(err => console.error('Error fetching items:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (token) fetchItems()
  }, [page, searchTerm, token])

  const handleAuthSubmit = (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    fetch(`${AUTH_URL}/${authMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: authUsername, password: authPassword }),
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
        return data
      })
      .then(data => {
        if (authMode === 'login') {
          localStorage.setItem('jwt_token', data.token)
          setToken(data.token)
        } else {
          // registered successfully — switch to login mode
          setAuthMode('login')
          setAuthPassword('')
          setAuthError('Registered! You can now log in.')
        }
      })
      .catch(err => setAuthError(err.message))
      .finally(() => setAuthLoading(false))
  }

  const resetForm = () => {
    setProductName('')
    setCategory('')
    setQuantity('')
    setPrice('')
    setEditingId(null)
    setFormError('')
  }

  const validate = () => {
    if (!productName.trim()) return 'Product name is required.'
    if (quantity === '' || Number(quantity) < 0) return 'Quantity must be 0 or more.'
    if (price === '' || Number(price) < 0) return 'Price must be 0 or more.'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const error = validate()
    if (error) {
      setFormError(error)
      return
    }
    setFormError('')

    const itemData = {
      productName,
      category,
      quantity: Number(quantity),
      price: Number(price)
    }

    const request = editingId
      ? fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(itemData)
        })
      : fetch(API_URL, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(itemData)
        })

    request
      .then(res => res.json())
      .then(() => {
        fetchItems()
        resetForm()
      })
      .catch(err => console.error('Error saving item:', err))
  }

  const handleEditClick = (item) => {
    setEditingId(item.id)
    setProductName(item.productName || '')
    setCategory(item.category || '')
    setQuantity(item.quantity ?? '')
    setPrice(item.price ?? '')
    setFormError('')
  }

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: authHeaders() })
      .then(() => {
        fetchItems()
        if (editingId === id) resetForm()
      })
      .catch(err => console.error('Error deleting item:', err))
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  // ---- LOGIN / REGISTER SCREEN ----
  if (!token) {
    return (
      <div className="app">
        <h1>FDE Inventory Console</h1>
        <form onSubmit={handleAuthSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={authUsername}
            onChange={(e) => setAuthUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={authLoading}>
            {authMode === 'login' ? 'Log In' : 'Register'}
          </button>
        </form>

        {authError && <p className="form-error">{authError}</p>}

        <p className="editing-note">
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'register' : 'login')
              setAuthError('')
            }}
          >
            {authMode === 'login' ? 'Register' : 'Log In'}
          </button>
        </p>
      </div>
    )
  }

  // ---- MAIN INVENTORY SCREEN (only reachable once logged in) ----
  return (
    <div className="app">
      <div className="header-row">
        <h1>FDE Inventory Console</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className={formError && !productName.trim() ? 'invalid' : ''}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={formError && (quantity === '' || Number(quantity) < 0) ? 'invalid' : ''}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={formError && (price === '' || Number(price) < 0) ? 'invalid' : ''}
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? 'Update Item' : 'Add Item'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </form>

      {formError && <p className="form-error">{formError}</p>}
      {editingId && !formError && (
        <p className="editing-note">Editing item #{editingId}</p>
      )}

      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {loading ? (
        <div className="loading-state">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? 'No items match your search.' : 'No items yet — add your first one above.'}
        </div>
      ) : (
        <>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEditClick(item)} className="btn btn-secondary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span className="page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App