import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import config from '../config.json';

const ReceivePayoutScreen = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [payoutsEnabled, setPayoutsEnabled] = useState(false);

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      return account_id;
    } catch (e) {
      console.error('Erreur récupération account_id', e);
    }
  };

  const checkStripeStatus = async () => {
    setCheckingStatus(true);
    try {
      const accountId = await getAccountId();
      if (!accountId) throw new Error('Utilisateur non identifié');
  
      const response = await fetch(`${config.backendUrl}/api/stripe/account-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId }),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error('Impossible de récupérer le statut Stripe');
      }
  
      setPayoutsEnabled(data.payouts_enabled);
    } catch (err) {
      console.error('Erreur statut Stripe :', err);
      Alert.alert('Erreur', 'Impossible de vérifier le statut de réception des paiements.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleStripeOnboarding = async () => {
    setLoading(true);
    try {
      const accountId = await getAccountId();
      if (!accountId) throw new Error('Utilisateur non identifié');

      const response = await fetch(`${config.backendUrl}/api/stripe/create-account-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error('Lien onboarding invalide');
      }

      Linking.openURL(data.url);
    } catch (error) {
      console.error('Erreur onboarding :', error);
      Alert.alert('Erreur', 'Impossible de lancer le processus Stripe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStripeStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Réception de paiements</Text>

      {checkingStatus ? (
        <ActivityIndicator size="large" color="green" />
      ) : payoutsEnabled ? (
        <Text style={styles.successText}>✅ Vos paiements sont activés !</Text>
      ) : (
        <Text style={styles.warningText}>
          ⚠️ Veuillez compléter vos informations bancaires pour pouvoir recevoir des paiements.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#666' }]}
        onPress={handleStripeOnboarding}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Chargement...' : payoutsEnabled ? 'Mettre à jour mes infos' : 'Activer les paiements'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningText: {
    color: 'orange',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReceivePayoutScreen;
