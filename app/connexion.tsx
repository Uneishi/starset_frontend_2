import { useUser } from '@/context/userContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import config from '../config.json';

const ConnexionScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { setUser } = useUser();

  const handleEmailChange = (text: string) => setEmail(text);
  const handlePasswordChange = (text: string) => setPassword(text);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev); // 👈

  const goToCreate = () => navigation.navigate('creation' as never);
  const goToForgotPassword = () => navigation.navigate('forgotPassword' as never);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        const account = data.account;
        await saveData(account);
        await getProfile(account.id);
        navigation.navigate({ name: '(tabs)', params: { screen: 'home' } } as never);
      } else {
        setErrorMessage('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setEmail('');
      setPassword('');
    }
  };

  const getProfile = async (accountId: string) => {
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/get-account-by-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      const data = await response.json();
      setUser(data.account);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const saveData = async (account: any) => {
    try {
      await AsyncStorage.setItem('account_id', account['id']);
      await AsyncStorage.setItem('worker_id', account['worker']);
      await AsyncStorage.setItem('firstname', account['firstname']);
      await AsyncStorage.setItem('lastname', account['lastname']);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du type de compte', e);
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
      setErrorMessage('');
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}></View>
      <Text style={styles.enter}>Connectez-vous !</Text>
      <Text style={styles.description}>
        Laissez-nous identifier votre profil, Star Set n'attend plus que vous !
      </Text>
      <View style={styles.separator}></View>

      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        placeholder="chapter@exemple.com"
        placeholderTextColor="#808080"
        value={email}
      />

      {/* Password avec œil 👁️ */}
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          onChangeText={handlePasswordChange}
          placeholder="Mot de passe"
          placeholderTextColor="#808080"
          secureTextEntry={!showPassword}
          value={password}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={goToForgotPassword} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.connexionbutton]}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToCreate}>
        <Text>
          Vous n'avez pas encore de compte ?{' '}
          <Text style={styles.createAccount}>inscrivez-vous !</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#A0A0FF',
    borderRadius: 50,
    marginBottom: 100,
    top: 80,
  },
  separator: {
    width: '50%',
    height: 3,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 20,
  },
  enter: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 40,
    marginTop: 0,
    marginHorizontal: 20,
    color: 'black',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    color: 'black',
    marginHorizontal: 10,
  },
  input: {
    fontFamily: 'Outfit',
    width: '80%',
    height: 46,
    backgroundColor: 'white',
    borderRadius: 23,
    borderWidth: 2,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    padding: 10,
    marginTop: 20,
    marginHorizontal: 10,
    paddingHorizontal: 30,
  },
  passwordWrapper: {
    width: '80%',
    height: 46,
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 23,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Outfit',
    color: 'black',
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  forgotPassword: {
    marginTop: 5,
    width: '80%',
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: 'blue',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  connexionbutton: {
    width: '70%',
    maxWidth: 400,
    height: 50,
    backgroundColor: '#00BF63',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Lexend',
  },
  createAccount: {
    color: '#7ED957',
  },
});

export default ConnexionScreen;
