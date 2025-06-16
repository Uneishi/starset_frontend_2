import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import config from '../config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = () => {
  const route = useRoute() as any;
  const navigation = useNavigation();
  
  const { 
    startDate, 
    endDate, 
    arrivalTime, 
    departureTime, 
    prestation, 
    profilePictureUrl,
    totalRemuneration
  } = route.params;

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      return account_id;
    } catch (e) {
      console.error('Erreur lors de la récupération du compte', e);
    }
  };

  const handlePayment = async () => {
    const user_id = await getAccountId();
    try {
      const response = await fetch(`${config.backendUrl}/api/planned-prestation/create-planned-prestation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker_id: prestation.worker_id,
          user_id: user_id,
          prestation_id: prestation.id,
          start_date: startDate,
          end_date: endDate,
          type_of_remuneration: 'hours',
          remuneration: totalRemuneration,
          start_time: arrivalTime,
          end_time: departureTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigation.navigate('validation' as never);
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors du paiement.");
      }
    } catch (error) {
      console.error('Erreur paiement :', error);
      Alert.alert("Erreur", "Impossible de valider le paiement. Vérifiez votre connexion.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Paiement</Text>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profilePictureUrl || prestation.picture_url }}
          style={styles.profilePicture}
        />
      </View>

      <Text style={styles.sectionHeader}>Détails de la prestation</Text>
      <View style={styles.infoContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{prestation.metier}</Text>
        </View>
        <Text style={styles.descriptionText}>{prestation.description}</Text>
      </View>

      <Text style={styles.sectionHeader}>Résumé du paiement</Text>
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentText}>Total heures</Text>
        <Text style={styles.paymentAmount}>{parseFloat(totalRemuneration).toFixed(2)}€</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.paymentContainer}>
        <Text style={[styles.paymentText, { fontWeight: 'bold' }]}>Total final</Text>
        <Text style={[styles.paymentAmount, { fontWeight: 'bold' }]}>
          {(parseFloat(totalRemuneration) + 3 + 1.30).toFixed(2)}€
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Valider le paiement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profileContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#d9f9d9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 16,
    color: '#000',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
    color: '#000',
  },
  paymentAmount: {
    fontSize: 16,
    color: '#000',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
