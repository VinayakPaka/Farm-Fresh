import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, StatusBar, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationPicker from "../../components/LocationPicker";
import { productsApi } from "../../utils/api";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
  stock: number;
  createdAt?: string;
}

const Home = () => {
  const router = useRouter();
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [locationName, setLocationName] = useState("Home");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //intilize dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    loadSavedLocation();
    fetchProducts();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const saved = await AsyncStorage.getItem("userLocation");
      if (saved) {
        const location = JSON.parse(saved);
        setLocationName(location.address || "Home");
      }
    } catch (error) {
      console.error("Error loading location:", error);
    }
  };

  const handleLocationSelect = async (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => {
    console.log("handleLocationSelect called with:", location);
    const newLocationName = location.address || "Home";
    console.log("Setting location name to:", newLocationName);
    setLocationName(newLocationName);
    try {
      await AsyncStorage.setItem("userLocation", JSON.stringify(location));
      console.log("Location saved to AsyncStorage");
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
      console.log('✅ Fetched products:', data.length);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 1, name: "Fruits", icon: "🍎", color: "bg-red-100" },
    { id: 2, name: "Vegetables", icon: "🥬", color: "bg-green-100" },
    { id: 3, name: "Dairy", icon: "🥛", color: "bg-blue-100" },
    { id: 4, name: "Electronics", icon: "🥛", color: "bg-blue-100" },
    { id: 5, name: "Clothes", icon: "🥛", color: "bg-blue-100" },
    { id: 6, name: "Snacks", icon: "🥛", color: "bg-blue-100" },
  ];


  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <ScrollView className='flex-1'>
        <View className='bg-emerald-600 px-4 pt-2 pb-4'>
          {/* Header with location */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-white text-xs opacity-90">Delivery to</Text>
              <View className='flex-row items-center'>
                <Text className='text-white text-base font-bold mr-1'>{locationName} ▼</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setLocationPickerVisible(true)}
            >
              <Text className="text-white text-xl font-semibold">
                📍 Change
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="bg-white rounded-xl px-4 py-3 flex-row items-center">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              style={{ flex: 1, color: '#1F2937' }}
              placeholder="Search for products..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* {Delivery Banner} */}
        <View className="bg-emerald-50 px-4 py-3 flex-row items-center justify-between border-b border-emerald-100">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">⚡</Text>
            <View>
              <Text className="text-emerald-800 font-bold text-sm">
                Delivery in 10-15 mins
              </Text>
              <Text className="text-emerald-600 text-xs">
                Express delivery available
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text className="text-emerald-600 font-semibold text-xs">
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}

        <View className='px-4 py-4 bg-white'>
          <Text className=''>Categories</Text>
          <FlatList data={categories} horizontal
            renderItem={({ item }) => (
              <View className="items-center mr-4">
                <View
                  className={`w-16 h-16 rounded-full ${item.color} items-center justify-center mb-2`}
                >
                  <Text className="text-3xl">{item.icon}</Text>
                </View>
                <Text className="text-xs font-medium text-gray-700">
                  {item.name}
                </Text>
              </View>
            )} showsHorizontalScrollIndicator={false} />
        </View>


        {/* Products */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Deals for Today</Text>
          
          {loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator size="large" color="#059669" />
              <Text className="text-gray-500 mt-2">Loading products...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-8 bg-red-50 rounded-lg">
              <Text className="text-red-600 font-semibold">⚠️ Error</Text>
              <Text className="text-red-500 text-sm mt-1">{error}</Text>
              <TouchableOpacity 
                onPress={fetchProducts}
                className="bg-red-600 px-4 py-2 rounded-lg mt-3"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-gray-500">No products available</Text>
            </View>
          ) : (
            <FlatList 
              data={products} 
              horizontal 
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View
                  className="bg-white rounded-xl p-3 mr-3 shadow-sm border border-gray-100"
                  style={{ width: 150 }}
                >
                  <View className="w-full h-24 bg-gray-50 rounded-lg overflow-hidden mb-2">
                    <Image 
                      source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>

                  <Text
                    className="text-sm font-semibold text-gray-800"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500">{item.category}</Text>
                  <Text className="text-xs text-gray-400">Stock: {item.stock}</Text>

                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-lg font-bold text-emerald-600">
                      ₹{item.price}
                    </Text>
                    <TouchableOpacity className="bg-emerald-600 px-3 py-1 rounded-lg" onPress={() => {
                      dispatch(addToCart({
                        id: item._id,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        category: item.category,
                        price: item.price,
                        quantity: 1,
                      }))
                    }}>
                      <Text className="text-white text-xs font-semibold">
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )} 
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker 
        visible={locationPickerVisible}
        onClose={() => setLocationPickerVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView> 
  );
};

export default Home;

const styles = StyleSheet.create({})