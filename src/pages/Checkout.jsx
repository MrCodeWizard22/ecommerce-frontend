const checkout = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.userId);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const handleAddToCart = (productId, quantity) => {
    if (userId) {
      dispatch(addToCart({ userId, productId, quantity }));
    }
  };

  const handleUpdateQuantity = (cartId, quantity) => {
    dispatch(updateCartItemQuantity({ cartId, quantity }));
  };

  const handleRemoveFromCart = (cartId) => {
    dispatch(removeFromCart(cartId));
  };

  const handleClearCart = () => {
    if (userId) {
      dispatch(clearCart(userId));
    }
  };

  const handleQuantityChange = (cartId, quantity) => {
    setQuantities({ ...quantities, [cartId]: quantity });
  };

  const handlePlaceOrder = () => {
    navigate("/checkout");
    console.log("order placed");
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error: {JSON.stringify(error)}</p>
    );
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return (
    <div className="container min-h-screen mx-auto p-6 dark:text-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Checkout
      </h1>
      {items.length === 0 ? (
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Your cart is empty.
        </p>
      ) : (
        <div>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.cartId}
                className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    ₹{item.product.price} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.cartId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Total:</h2>
            <p className="text-lg text-blue-600">₹{totalPrice}</p>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};
export default checkout;
