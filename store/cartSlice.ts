import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";


// product - price, name, quantity, image, category

export interface CartItem {
    id: number,
    name: string,
    image: string,
    category: string,
    price: number,
    quantity: number
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [],

}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            // if  the product is new , then add the complete item 
            const exisitingItem = state.items.find(item => item.id === action.payload.id) 
            // if the product already exists, then only increase the quantity

            if (exisitingItem) {
                exisitingItem.quantity += action.payload.quantity
            } else {
                state.items.push({...action.payload, quantity: 1})
            }
        },
        removeFromCart: (state, action) => {
            const exisitingItem = state.items.find(item => item.id === action.payload.id)
            if (exisitingItem) {
                exisitingItem.quantity -= action.payload.quantity
            }
        },
        clearCart: (state) => {
            state.items = []
        }
    }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer