import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {

  const categories = [
    { id: 1, name: "Fruits", icon: "🍎", color: "bg-red-100" },
    { id: 2, name: "Vegetables", icon: "🥬", color: "bg-green-100" },
    { id: 3, name: "Dairy", icon: "🥛", color: "bg-blue-100" },
    { id: 4, name: "Electronics", icon: "🥛", color: "bg-blue-100" },
    { id: 5, name: "Clothes", icon: "🥛", color: "bg-blue-100" },
    { id: 6, name: "Snacks", icon: "🥛", color: "bg-blue-100" },
  ];

  const products = [
    {
      id: 1,
      name: "Tomatoes",
      price: "₹49",
      image: "🍅",
      category: "Vegetables",
    },
    { id: 2, name: "Bananas", price: "₹39", image: "🍌", category: "Fruits" },
    { id: 3, name: "Milk", price: "₹65", image: "🥛", category: "Dairy" },
  ];

  return (
    <SafeAreaView className='flex-1 bg-white'>

      <ScrollView>

      <View className='bg-emerald-600 px-4 pt-2 pb-4'>
        {/* Header with location */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-white text-xs opacity-90">Delivery to</Text>
            <View className='flex-row items-center'>
              <Text className='text-white text-base font-bold mr-1'>Home ▼</Text>
            </View>
          </View>
          <TouchableOpacity>
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
        renderItem={({item}) => (
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
        )} showsHorizontalScrollIndicator={false}/>
      </View>
      </ScrollView>

      {/* Products */}

      <View>
        <Text>Deals of for Today</Text>
        <FlatList data={products} horizontal renderItem={({item}) => (
                     <View
                     className="bg-white rounded-xl p-3 mr-3 shadow-sm border border-gray-100"
                     style={{ width: 150 }}
                   >
                     <View className="w-full h-24 bg-gray-50 rounded-lg items-center justify-center mb-2">
                       <Text className="text-5xl">{item.image}</Text>
                     </View>
     
                     <Text
                       className="text-sm font-semibold text-gray-800"
                       numberOfLines={1}
                     >
                       {item.name}
                     </Text>
                     <Text className="text-xs text-gray-500">{item.category}</Text>
     
                     <View className="flex-row items-center justify-between mt-2">
                       <Text className="text-lg font-bold text-emerald-600">
                         {item.price}
                       </Text>
                       <TouchableOpacity className="bg-emerald-600 px-3 py-1 rounded-lg">
                         <Text className="text-white text-xs font-semibold">
                           Add
                         </Text>
                       </TouchableOpacity>
                     </View>
                   </View>
        )}/>
      </View>
      

    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({})