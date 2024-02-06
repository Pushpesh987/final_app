import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing token

export default function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginDisabled, setLoginDisabled] = useState(true);

  useEffect(() => {
    // Check if token exists in storage upon component mount
    checkToken();
  }, []);

  useEffect(() => {
    // Enable or disable login button based on email and password fields
    if (email.trim() !== '' && password.trim() !== '') {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }
  }, [email, password]);

  const checkToken = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      // If token exists, navigate to Homepage
      if (token) {
        navigation.navigate('Homepage');
      }
    } catch (error) {
      console.error('Error retrieving token from storage:', error);
    }
  };

  const handleLogin = async () => {
    try {
      // Make HTTP POST request to your backend API to authenticate user
      // Assuming your backend returns a token upon successful authentication
      const response = await fetch('https://api-w3qcv3aiha-el.a.run.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const { token } = await response.json();

        // Save token to AsyncStorage
        await AsyncStorage.setItem('token', token);

        // Navigate to Homepage upon successful authentication
        navigation.navigate('Homepage');
      } else {
        // Handle authentication errors (e.g., invalid credentials)
        Alert.alert('Error', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Button title="Login" onPress={handleLogin} disabled={loginDisabled} />
        </Card.Content>
      </Card>
      <Text style={styles.signupText} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Signup
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    elevation: 5,
  },
  input: {
    marginBottom: 10,
  },
  signupText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
