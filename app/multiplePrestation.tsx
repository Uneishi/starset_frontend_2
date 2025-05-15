import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import config from '../config.json';
import { useAllWorkerPrestation, useCurrentWorkerPrestation }  from '@/context/userContext';
import { Ionicons } from '@expo/vector-icons';

const PrestationsScreen = ({ route }: any) => {
  

  const [customPrestations, setCustomPrestations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [editingPrestation, setEditingPrestation] = useState<any>(null);
  const [newPrestation, setNewPrestation] = useState({ title: '', price: '', description: '' });
  const { currentWorkerPrestation: prestation, setCurrentWorkerPrestation } = useCurrentWorkerPrestation();

  const getCustomPrestations = async () => {
    try {
      
      const response = await fetch(`${config.backendUrl}/api/prestation/get-all-custom-prestation-by-prestation-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prestation_id : prestation?.id }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setCustomPrestations(data.custom_prestations);
    } catch (error) {
      console.error('Erreur chargement prestations personnalisées:', error);
    }
  };

  const createCustomPrestation = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/prestation/create-prestation-custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prestation_id : prestation?.id,
          title: newPrestation.title,
          description: newPrestation.description,
          price: newPrestation.price,
        }),
      });

      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();
      setCustomPrestations((prev ) : any => [...prev, data.custom_prestation]);
      setNewPrestation({ title: '', price: '', description: '' });
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur création prestation custom:', error);
      Alert.alert('Erreur', 'Impossible de créer la prestation personnalisée.');
    }
  };

  const updateCustomPrestation = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/prestation/modify-prestation-custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_prestation: { ...newPrestation, id: editingPrestation?.id } }),
      });

      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();
      setCustomPrestations((prev: any) => prev.map((item: any) => item.id === data.custom_prestation.id ? data.custom_prestation : item));
      setNewPrestation({ title: '', price: '', description: '' });
      setEditingPrestation(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur modification prestation custom:', error);
      Alert.alert('Erreur', 'Impossible de modifier la prestation personnalisée.');
    }
  };

  useEffect(() => {
    if (prestation?.id) getCustomPrestations();
  }, [prestation?.id]);

  const renderPrestation = ({ item }: any) => (
    <View style={styles.prestationCard}>
      <TouchableOpacity style={styles.optionsIcon} onPress={() => askEditPrestation(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="#000" />
      </TouchableOpacity>
      <Text style={styles.prestationTitle}>{item.title}</Text>
      <View style={styles.prestationPriceContainer}>
        <Text style={styles.prestationPrice}>{item.price}€</Text>
      </View>
    </View>
  );

  const askEditPrestation = (item: any) => {
    Alert.alert(
      'Modifier la prestation',
      'Voulez-vous modifier cette prestation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Modifier', onPress: () => {
          setEditingPrestation(item);
          setNewPrestation({ title: item.title, price: String(item.price), description: item.description });
          setModalVisible(true);
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TARIF PAR PRESTATION</Text>
      <FlatList
        data={customPrestations}
        renderItem={renderPrestation}
        keyExtractor={(item : any) => item?.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Ajouter une prestation</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>AJOUTER UNE PRESTATION</Text>

            <Text style={styles.label}>Titre</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de la prestation"
              value={newPrestation.title}
              onChangeText={(text) => setNewPrestation({ ...newPrestation, title: text })}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description (facultatif)"
              value={newPrestation.description}
              onChangeText={(text) => setNewPrestation({ ...newPrestation, description: text })}
            />

            <Text style={styles.label}>Ajouter le tarif</Text>
            <TextInput
              style={styles.input}
              placeholder="Tarif en €"
              keyboardType="numeric"
              value={newPrestation.price}
              onChangeText={(text) => setNewPrestation({ ...newPrestation, price: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={createCustomPrestation}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#008000', textAlign: 'center', marginBottom: 20 },
  listContainer: { flexGrow: 1 },
  prestationCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  prestationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  prestationPriceContainer: {
    backgroundColor: '#FFD700',
    marginTop: 5,
    width: '100%',
    borderRadius: 3,
  },
  prestationPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    margin: 5,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  cancelButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },

  optionsIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default PrestationsScreen;
