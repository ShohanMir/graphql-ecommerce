import React, { createContext, useState, useEffect, useContext } from 'react';
import toast, { Toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  //add products in the cart with price and quantity functionality
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItem.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    if (checkProductInCart) {
      const updatedCartItems = cartItem.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        } else {
          return { ...cartProduct };
        }
      });

      setCartItem(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItem([...cartItem, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  //removing cart product and quantities, price and update with existing product
  const onRemove = (product) => {
    foundProduct = cartItem.find((item) => item._id === product._id);
    const newCartItems = cartItem.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItem(newCartItems);
  };

  //updating cart Items and changing item queantities and items price
  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItem.find((item) => item._id === id);
    index = cartItem.findIndex((product) => product._id === id);
    const newCartItems = cartItem.filter((item) => item._id !== id);

    if (value == 'inc') {
      // setCartItem([
      //   ...newCartItems,
      //   { ...foundProduct, quantity: foundProduct.quantity + 1 },
      // ]);
      newCartItems.splice(index, 0, {
        ...foundProduct,
        quantity: foundProduct.quantity + 1,
      });
      setCartItem(newCartItems);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);

      // cartItem[index] = foundProduct;
    } else if (value == 'dec') {
      if (foundProduct.quantity > 1) {
        // setCartItem([
        //   ...newCartItems,
        //   { ...foundProduct, quantity: foundProduct.quantity - 1 },
        // ]);
        newCartItems.splice(index, 0, {
          ...foundProduct,
          quantity: foundProduct.quantity - 1,
        });
        setCartItem(newCartItems);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  //increase product items using increase and decrease (plus and minus) button in the individual product page
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => (prevQty < 2 ? 1 : prevQty - 1));
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItem,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItem,
        setTotalQuantities,
        setTotalPrice,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
