import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { clearCart } from '@/store/cartSlice';
import { API_BASE_URL } from '@/utils/api';

// Lazy load Stripe hooks to avoid errors when native modules aren't available (and skip on web)
let useStripe: any = null;
let stripeAvailable = false;

if (Platform.OS !== 'web') {
  try {
    const stripeModule = require('@stripe/stripe-react-native');
    useStripe = stripeModule.useStripe;
    stripeAvailable = true;
  } catch (error) {
    console.warn('Stripe not available - native modules required');
    stripeAvailable = false;
  }
}

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const stripe = useStripe ? useStripe() : null;
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

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

  const total = calculateTotal();

  // Initialize payment sheet
  const initializePaymentSheet = async () => {
    if (!stripeAvailable || !stripe) {
      Alert.alert(
        'Stripe Not Available',
        'Stripe requires a development build. Please use expo-dev-client instead of Expo Go.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    try {
      setLoading(true);

      // Create payment intent on backend
      const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'inr',
          metadata: {
            order_items: JSON.stringify(cartItems),
            item_count: cartItems.length.toString(),
          },
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        Alert.alert('Error', backendError);
        return;
      }

      if (!clientSecret) {
        Alert.alert('Error', 'Failed to initialize payment');
        return;
      }

      // Initialize the payment sheet
      const { error } = await stripe.initPaymentSheet({
        merchantDisplayName: 'Grocery App',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: 'Customer',
        },
        allowsDelayedPaymentMethods: true,
      });

      if (error) {
        Alert.alert('Error', error.message);
        console.error('Payment sheet initialization error:', error);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initialize payment');
      console.error('Error initializing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Present payment sheet
  const handlePayment = async () => {
    if (!stripeAvailable || !stripe) {
      Alert.alert(
        'Stripe Not Available',
        'Stripe requires a development build. Please use expo-dev-client instead of Expo Go.'
      );
      return;
    }

    try {
      setPaymentLoading(true);

      const { error } = await stripe.presentPaymentSheet();

      if (error) {
        if (error.code === 'Canceled') {
          // User canceled the payment
          return;
        }
        Alert.alert('Payment Failed', error.message);
        console.error('Payment error:', error);
      } else {
        // Payment succeeded
        Alert.alert(
          'Success',
          'Your payment was successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(clearCart());
                router.push('/(main)/orders');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
      console.error('Payment error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    initializePaymentSheet();
  }, []);

  if (cartItems.length === 0) {
    return null;
  }

  // Web guard: Stripe native SDK is not available on web builds
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">Payments not available on web</Text>
        <Text className="text-gray-600 text-center">
          Stripe payments require a native build. Please run the app on Android or iOS using
          a development build (expo-dev-client).
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-emerald-600 px-4 py-4">
          <Text className="text-white text-2xl font-bold">Checkout</Text>
          <Text className="text-white/80 text-sm">Complete your purchase</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Order Summary */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Order Summary</Text>
            {cartItems.map((item: any) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center mb-3 pb-3 border-b border-gray-200"
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </Text>
                </View>
                <Text className="text-base font-semibold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Total */}
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Total:</Text>
              <Text className="text-2xl font-bold text-emerald-600">
                ₹{total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <View className="bg-blue-50 rounded-lg p-4 mb-6">
            <Text className="text-sm text-blue-800">
              💳 Secure payment powered by Stripe
            </Text>
            <Text className="text-xs text-blue-600 mt-2">
              Your payment information is encrypted and secure
            </Text>
          </View>
        </ScrollView>

        {/* Payment Button */}
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          {loading ? (
            <View className="bg-gray-400 rounded-xl py-4 items-center">
              <ActivityIndicator color="white" />
              <Text className="text-white text-lg font-semibold mt-2">
                Initializing Payment...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePayment}
              disabled={paymentLoading}
              className={`rounded-xl py-4 items-center ${
                paymentLoading ? 'bg-gray-400' : 'bg-emerald-600'
              }`}
            >
              {paymentLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Pay ₹{total.toFixed(2)}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Checkout;

