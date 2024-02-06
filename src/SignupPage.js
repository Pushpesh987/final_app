import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for storing token

export default function SignupPage() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [signupDisabled, setSignupDisabled] = useState(true);

  // Function to check if all input fields are filled
  const checkInputsFilled = () => {
    return name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && phone.trim() !== '';
  };

  // Update signupDisabled state based on input fields
  useEffect(() => {
    setSignupDisabled(!checkInputsFilled());
  }, [name, email, password, phone]);

  const handleSignup = async () => {
    try {
      // Make HTTP POST request to your backend API to create new user
      const response = await fetch('https://api-w3qcv3aiha-el.a.run.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          phone: phone,
        }),
      });

      if (response.ok) {
        // Assuming your backend returns a token upon successful signup
        const { token } = await response.json();

        // Save token to AsyncStorage
        await AsyncStorage.setItem('token', token);

        // Navigate to Login page upon successful signup
        navigation.navigate('Login');
      } else {
        // Handle signup errors (e.g., email already exists)
        const errorMessage = await response.text();
        Alert.alert('Signup Error', errorMessage);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Signup" />
      </Appbar.Header>
      <Text style={styles.signText}>Signup Page</Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
          />
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
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={text => setPhone(text)}
          />
          <Button title="Signup" onPress={handleSignup} disabled={signupDisabled} />
          <Text style={styles.haveAccountText} onPress={() => navigation.navigate('Login')}>
            Already have an account? Login
          </Text>
        </Card.Content>
      </Card>
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
  signText: {
    fontSize: 24,
    marginBottom: 20,
  },
  haveAccountText: {
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
