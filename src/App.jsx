import './index.css'
import React, { useState, useEffect } from 'react'
import { FaHome, FaEnvelope, FaShoppingCart, FaStar, FaSearch } from 'react-icons/fa'


function App() {
  const [products, setProducts] = useState({})
  const [cart, setCart] = useState([])
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)
  const [showCartDialog, setShowCartDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
          // Fetch the products.json file from the public directory
          fetch('/starkinc/products.json')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data)
            setProducts(data); // Assuming the JSON structure has a 'products' key
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          });
  }, [])

  const addToCart = (product) => {
    setSelectedProduct(product)
    setShowQuantityDialog(true)
  }

  const confirmAddToCart = () => {
    setCart([...cart, { ...selectedProduct, quantity }])
    setShowQuantityDialog(false)
    setQuantity(1)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <FaHome className="mr-2" />
            <a href="/" className="text-gray-800 text-xl font-bold">Home</a>
          </div>
          <div className="flex items-center">
            <a href="#" className="text-gray-800 mx-4"><FaEnvelope /></a>
            <button onClick={() => setShowCartDialog(true)} className="text-gray-800 mx-4"><FaShoppingCart /></button>
          </div>
        </div>
      </nav>
      <h1 className='text-3xl p-4'>Starkinc</h1>
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-96" style={{backgroundImage: "url('/starkinc/images/bg.webp')"}}>
  <div className="absolute inset-0 bg-black opacity-50"></div>
  <div className="container mx-auto px-6 py-24 relative z-10">
    <h2 className="text-4xl font-bold mb-2 text-white">Summer Collection</h2>
    <h3 className="text-2xl mb-8 text-white">New arrivals are here</h3>
    <button className="bg-white text-gray-800 font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider hover:bg-gray-200">
      Shop Now
    </button>
  </div>
</div>

      {/* Search Bar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 rounded-full border focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Product Sections */}
      {Object.entries(products).map(([category, items]) => (
        <div key={category} className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={`/images/${product.image}`} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${parseFloat(product.price).toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity Dialog */}
      {showQuantityDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Select Quantity</h3>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowQuantityDialog(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddToCart}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Dialog */}
      {showCartDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Your Cart</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name} (x{item.quantity})</span>
                    <div>
                      <span className="mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${getTotalPrice()}</span>
                </div>
                <button
                  onClick={() => {
                    setShowCartDialog(false)
                    setShowConfirmDialog(true)
                  }}
                  className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Buy Now
                </button>
              </>
            )}
            <button
              onClick={() => setShowCartDialog(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Purchase Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Purchase</h3>
            <p>Are you sure you want to buy all items in your cart?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Implement purchase logic here
                  setShowConfirmDialog(false)
                  setCart([])
                  alert('Thank you for your purchase!')
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
