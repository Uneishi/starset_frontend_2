import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentMethodScreen = () => {
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const [cards, setCards] = useState([
    { id: '1', name: 'Carte Maman', lastFour: '2546', status: 'Valide' },
    { id: '2', name: 'Carte Papa', lastFour: '254G', status: 'Expiré' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);

  const handleAddCard = async () => {
    console.log("handleAddCard appelé");
    console.log("Détails de la carte:", cardDetails);
    
    if (!cardDetails) {
      console.error("Erreur: cardDetails est null");
      alert("Veuillez entrer une carte valide.");
      return;
    }

    if (!cardDetails.complete) {
      console.error("Erreur: La carte est incomplète");
      alert("Veuillez entrer une carte complète.");
      return;
    }
  
    try {
      console.log("Ajout de la carte en cours...");
      const newCard = {
        id: Date.now().toString(),
        name: 'Nouvelle carte',
        lastFour: cardDetails.last4 || "XXXX",
        status: 'Valide',
      };
      console.log("Nouvelle carte créée:", newCard);
      
      setCards([...cards, newCard]);
      console.log("Cartes mises à jour:", cards);
      
      setModalVisible(false);
      console.log("Fermeture du modal");
      setCardDetails(null);
      console.log("Réinitialisation de cardDetails");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la carte:", error);
    }
  };


  const renderCard = ({ item } : any) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardInfo}>
        <Icon name="card" size={30} color="#000" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={item.status === 'Valide' ? styles.cardStatusValid : styles.cardStatusExpired}>{item.status}</Text>
          <Text style={styles.cardNumber}>--- {item.lastFour}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes cartes</Text>
      
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Ajouter une carte</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une carte</Text>
            <CardField
              postalCodeEnabled={true}
              placeholders={{ number: '4242 4242 4242 4242' }}
              onCardChange={(cardDetails) => {
                console.log("📦 Changement dans le champ carte:", cardDetails);
                setCardDetails(cardDetails);
              }}
              style={styles.cardField}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddCard}>
              <Text style={styles.saveButtonText}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginLeft: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardStatusValid: {
    color: 'green',
    fontSize: 14,
  },
  cardStatusExpired: {
    color: 'red',
    fontSize: 14,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  addButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethodScreen;