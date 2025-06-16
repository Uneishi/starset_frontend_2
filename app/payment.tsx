import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config.json';

const PaymentScreen = () => {
  const route = useRoute() as any;
  const navigation = useNavigation();

  // On récupère cart, instruction, totalRemuneration depuis params
  const { cart = [], instruction = '', totalRemuneration = 0 } = route.params || {};

  const [isLoading, setIsLoading] = React.useState(false);

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      return account_id;
    } catch (e) {
      console.error('Erreur lors de la récupération du compte', e);
    }
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      Alert.alert('Panier vide', 'Votre panier est vide.');
      return;
    }

    setIsLoading(true);

    try {
      const user_id = await getAccountId();

      // Envoyer une requête pour chaque prestation dans le panier
      for (const item of cart) {
        const {
          prestation,
          startDate,
          endDate,
          arrivalTime,
          departureTime,
          totalRemuneration: itemRemuneration,
        } = item;

        const response = await fetch(`${config.backendUrl}/api/planned-prestation/create-planned-prestation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            worker_id: prestation.worker_id,
            user_id,
            prestation_id: prestation.id,
            start_date: startDate,
            end_date: endDate,
            type_of_remuneration: 'hours',
            remuneration: itemRemuneration,
            start_time: arrivalTime,
            end_time: departureTime,
            instruction, // Optionnel, tu peux l'ajouter si applicable globalement
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(`Erreur lors de la création de la prestation ${prestation.metier}`);
        }
      }

      setIsLoading(false);
      Alert.alert('Succès', 'Le paiement et les prestations ont bien été enregistrés.');
      navigation.navigate('validation' as never);
    } catch (error) {
      setIsLoading(false);
      console.error('Erreur paiement :', error);
      Alert.alert('Erreur', 'Impossible de valider le paiement. Vérifiez votre connexion.');
    }
  };

  // Affichage résumé des prestations dans le panier
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Paiement</Text>

      {cart.map((item: any, index: number) => {
        const {
          prestation,
          profilePictureUrl,
          totalRemuneration: itemRemuneration,
        } = item;

        return (
          <View key={index} style={styles.prestationContainer}>
            <Image
              source={{ uri: profilePictureUrl || prestation.picture_url }}
              style={styles.profilePicture}
            />
            <Text style={styles.prestationTitle}>{prestation.metier}</Text>
            <Text style={styles.descriptionText}>{prestation.description}</Text>
            <Text style={styles.paymentAmount}>Montant : {itemRemuneration?.toFixed(2)} €</Text>
          </View>
        );
      })}

      <View style={styles.separator} />

      <Text style={styles.totalText}>Total global : {parseFloat(totalRemuneration).toFixed(2)} €</Text>

      <TouchableOpacity
        style={[styles.button, isLoading && { backgroundColor: '#666' }]}
        onPress={handlePayment}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Traitement...' : 'Valider le paiement'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  prestationContainer: {
    width: '100%',
    backgroundColor: '#f0f9f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  prestationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
    textAlign: 'center',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
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

export default PaymentScreen;
