import { useCart } from '@/context/userContext';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { cart } = useCart();

  const [instruction, setInstruction] = useState('');

  // Calcul total global
  const totalRemuneration = cart.reduce((sum, item) => sum + (item.totalRemuneration || 0), 0);

  const nextStep = () => {
    navigation.navigate({
      name: 'payment',
      params: { cart, instruction, totalRemuneration },
    } as never);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const {
      prestation,
      startDate,
      endDate,
      arrivalTime,
      departureTime,
      totalRemuneration,
      profilePictureUrl,
    } = item;

    const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : 'N/A';
    const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : 'N/A';
    const formattedArrivalTime = arrivalTime ? new Date(arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
    const formattedDepartureTime = departureTime ? new Date(departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

    return (
      <View style={styles.prestationCard}>
        <Text style={styles.prestationTitle}>{prestation.metier || 'Prestation'}</Text>
        <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
        <View style={styles.dateRow}>
          <Text>Début : {formattedStartDate}</Text>
          <Text>Fin : {formattedEndDate}</Text>
        </View>
        <View style={styles.dateRow}>
          <Text>Arrivée : {formattedArrivalTime}</Text>
          <Text>Départ : {formattedDepartureTime}</Text>
        </View>
        <Text>Total Prestation: {totalRemuneration?.toFixed(2)} €</Text>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Votre panier est vide.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Récapitulatif du panier</Text>

      <FlatList
        data={cart}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        style={styles.list}
      />

      <TextInput
        style={styles.input}
        placeholder="Ajouter une instruction ou information primordiale"
        value={instruction}
        onChangeText={setInstruction}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total achat :</Text>
        <Text style={styles.totalText}>{totalRemuneration.toFixed(2)} €</Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>Étape suivante</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    marginBottom: 20,
  },
  prestationCard: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
  },
  prestationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 40,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SummaryScreen;
