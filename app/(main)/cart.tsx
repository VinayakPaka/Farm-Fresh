import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' 
import { useRouter } from 'expo-router';
import { addToCart, clearCart, removeFromCart } from '@/store/cartSlice';

const cart = () => {

  const cartItems = useSelector((state:any) => state.cart.items)
  // console.log(cartItems)
  const dispatch = useDispatch();
  const router = useRouter();

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: any) => {
      const rawPrice = item?.price ?? 0;
      const price =
        typeof rawPrice === 'number'
          ? rawPrice
          : parseFloat(String(rawPrice).replace(/[^\d.-]/g, '')) || 0;
      const quantity = typeof item?.quantity === 'number' ? item.quantity : 1;
      return total + price * quantity;
    }, 0);
  };


  

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="bg-emerald-600 px-4 py-4">
          <Text className="text-white text-2xl font-bold">Cart</Text>
          <Text className="text-white/80 text-sm">{cartItems.length} item(s)</Text>
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-white border-b border-gray-200 px-4 py-4">
              <View className="flex-row items-center">
                <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mr-4">
                <Image 
                      source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                </View>
                
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                  <Text className="text-sm text-gray-500">{item.category}</Text>
                  <Text className="text-lg font-bold text-emerald-600 mt-1">
                    ₹{typeof item.price === 'number' ? item.price : item.price}
                  </Text>
                </View>

                <View className="items-end">
                  <TouchableOpacity
                  onPress={() => {
                    dispatch(clearCart(item.id))
                  }}
                    className="mb-2" 
                  >
                    <Text className="text-red-500 text-xs">Remove</Text>
                  </TouchableOpacity>
                  
                  <View className="flex-row items-center border border-gray-300 rounded-lg">
                    <TouchableOpacity
                     
                      className="px-3 py-1" onPress={() => {
                        dispatch(removeFromCart(item))
                      }}
                    >
                      <Text className="text-gray-700 font-bold">-</Text>
                    </TouchableOpacity>
                    
                    <Text className="px-4 py-1 text-gray-800 font-semibold">{item.quantity}</Text>
                    
                    <TouchableOpacity
                     
                      className="px-3 py-1" onPress= {() => {
                        dispatch(addToCart(item))
                      }}
                    >
                      <Text className="text-gray-700 font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          className="flex-1"
        />

        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Total:</Text>
            <Text className="text-2xl font-bold text-emerald-600">₹ {calculateTotal()}</Text>
          </View>
          
          <TouchableOpacity 
            className="bg-emerald-600 rounded-xl py-4 items-center"
            onPress={() => router.push('/(main)/checkout')}
            disabled={cartItems.length === 0}
          >
            <Text className="text-white text-lg font-semibold">Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 10,
  },
});