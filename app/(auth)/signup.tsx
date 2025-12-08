import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import {authApi, saveToken} from '../../utils/api.js';
import { useRouter } from 'expo-router';

export default function SignupScreenUI() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const  [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('') 
  const router = useRouter();

  const handleSignUp = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters long');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.signup(name.trim(), email.trim(), password);
      console.log('Signup successful:', response);

      // Check for both response structures (success field OR token field)
      if(response.success || response.token) {
        // Handle different response structures
        const token = response.token || response.data?.token;
        const user = response.user || response.data?.user;

        // Save token to AsyncStorage
        await saveToken(token);

        // Show success message
        setSuccessMessage(`Welcome ${user.name}! Account created successfully!`);

        // Clear form
        setName('');
        setEmail('');
        setPassword('');

        console.log('User registered:', user);

        // For mobile: Show alert
        // For web: Success message is already shown, user can click Continue button
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Success!',
            `Welcome ${user.name}! Your account has been created successfully.`,
            [{
              text: 'Continue',
              onPress: () => {
                router.replace('/(main)/home');
              }
            }]
          );
        }
      }
    } catch (error) {
      console.error("Error in Signup:", error);
      const errorMsg = error.message || 'Signup failed. Please try again.';
      setErrorMessage(errorMsg);

      // Show error alert (only on mobile, web shows error message banner)
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Signup Failed',
          errorMsg,
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-emerald-50"
    >
      {/* Decorative blobs */}
      <View className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-emerald-200/60" />
      <View className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-lime-200/50" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        <View style={styles.content} className="justify-center">
          {/* Header / Logo */}
          <View className="items-center mb-6 mt-6">
            <View className="h-16 w-16 rounded-2xl bg-emerald-600 items-center justify-center shadow">
              <Text className="text-white text-3xl">🥬</Text>
            </View>
            <Text style={styles.title} className="mt-4 text-3xl font-extrabold text-emerald-800">
              Sign Up
            </Text>
            <Text style={styles.subtitle} className="text-base text-emerald-700/70 mt-1">
              Create your account to get started
            </Text>
          </View>

          {/* Card */}
          <View className="bg-white/90 rounded-3xl p-5 shadow-md border border-emerald-100">
            <Text className="text-lg font-semibold text-emerald-900 mb-4">
              Join the fresh side 🍏
            </Text>

            {/* Success Message */}
            {successMessage ? (
              <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <Text className="text-green-800 text-sm font-medium mb-3">{successMessage}</Text>
                <TouchableOpacity
                  className="bg-emerald-600 rounded-xl py-3 items-center"
                  onPress={() => router.replace('/(main)/home')}
                >
                  <Text className="text-white font-semibold">Continue to Home</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Error Message */}
            {errorMessage ? (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <Text className="text-red-800 text-sm font-medium">{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.form} className="w-full">
              <View style={styles.inputContainer} className="mb-4">
                <Text style={styles.label} className="text-emerald-800 mb-2 font-medium">
                  Name
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-white border border-emerald-200 rounded-2xl px-4 py-4 text-emerald-900"
                  placeholder="Your full name"
                  placeholderTextColor="#6b7280"
                  value={name}
                  onChangeText={(text) => {
                    setName(text)
                  }}
                />
              </View>

              <View style={styles.inputContainer} className="mb-4">
                <Text style={styles.label} className="text-emerald-800 mb-2 font-medium">
                  Email
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-white border border-emerald-200 rounded-2xl px-4 py-4 text-emerald-900"
                  placeholder="you@example.com"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                  }}
                />
              </View>

              <View style={styles.inputContainer} className="mb-2">
                <Text style={styles.label} className="text-emerald-800 mb-2 font-medium">
                  Password
                </Text>
                <TextInput
                  style={styles.input}
                  className="bg-white border border-emerald-200 rounded-2xl px-4 py-4 text-emerald-900"
                  placeholder="Create a strong password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete='password-new'
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text)
                  }}
                />
              </View>

              <Text className="text-[11px] text-emerald-700/70 mt-1">
                By continuing, you agree to our Terms & Privacy Policy.
              </Text>

              <TouchableOpacity
                style={styles.signupButton}
                className="rounded-2xl py-4 items-center mt-4 bg-emerald-600 shadow"
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText} className="text-white text-lg font-semibold">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-emerald-100" />
                <Text className="mx-3 text-emerald-700/70">or</Text>
                <View className="flex-1 h-[1px] bg-emerald-100" />
              </View>

              <TouchableOpacity className="rounded-2xl py-3 border border-emerald-200 bg-white items-center">
                <Text className="text-emerald-800 font-semibold">Sign up with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton} className="mt-6 items-center">
                <Text style={styles.linkText} className="text-emerald-700">
                  Already have an account? <Text style={styles.linkTextBold} className="text-emerald-700 font-extrabold">Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer badges */}
          <View className="items-center mt-5 mb-8">
            <Text className="text-emerald-700/70 text-xs">
              🧺 10,000+ items • 🥒 Daily deals • 🚚 30-min delivery
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkTextBold: {
    color: '#1E88E5',
    fontWeight: '600',
  },
});
