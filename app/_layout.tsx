import { Stack } from "expo-router";
import "./global.css";
import {Provider} from 'react-redux';
import { store } from "../store/store";
import CartLoader from "@/components/CartLoader";
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Replace with your Stripe publishable key from Stripe Dashboard
// For Expo: Create a .env file in the root directory with EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Lazy load StripeProvider to avoid errors when native modules aren't available
let StripeProvider: any = null;
let stripeAvailable = false;

// Avoid loading Stripe on web (native-only module)
if (Platform.OS !== 'web') {
  try {
    const stripeModule = require('@stripe/stripe-react-native');
    StripeProvider = stripeModule.StripeProvider;
    stripeAvailable = true;
  } catch (error) {
    console.warn('⚠️ Stripe native module not available. You need to use a development build (expo-dev-client) instead of Expo Go.');
    stripeAvailable = false;
  }
}

// Warn if Stripe key is missing
if (!STRIPE_PUBLISHABLE_KEY && stripeAvailable) {
  console.warn('⚠️ Stripe Publishable Key is missing! Please set EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file');
}

export default function RootLayout() {
  // Don't render StripeProvider if key is missing or Stripe is not available
  if (!STRIPE_PUBLISHABLE_KEY || !stripeAvailable || !StripeProvider) {
    return (
      <Provider store={store}>
        <CartLoader />
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    );
  }

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <CartLoader />
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </StripeProvider>
  )
}
