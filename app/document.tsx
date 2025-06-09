import { useUser } from '@/context/userContext';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import config from '../config.json';

const DocumentsScreen = () => {
  const { user } = useUser();
  const worker_id = user?.worker;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [allDocs, setAllDocs] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    if (!worker_id) return;

    const fetchData = async () => {
      try {
        // Get all document names
        const allDocRes = await fetch(`${config.backendUrl}/api/mission/get-all-unique-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const allDocData = await allDocRes.json();
        setAllDocs(allDocData.documents || []);

        // Get already uploaded docs
        const uploadedRes = await fetch(`${config.backendUrl}/api/mission/get-worker-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ worker_id }),
        });
        const uploadedData = await uploadedRes.json();
        const uploadedNames = uploadedData.documents?.map((doc: any) => doc.name) || [];
        setUploadedDocs(uploadedNames);
      } catch (err) {
        console.error('Erreur lors du chargement des documents :', err);
      }
    };

    fetchData();
  }, [worker_id]);

  const renderDocument = (doc: string, isUploaded: boolean) => (
    <TouchableOpacity
      key={doc}
      style={[styles.docButton, isUploaded ? styles.okButton : styles.missingButton]}
    >
      <Text style={styles.docText}>{doc}</Text>
    </TouchableOpacity>
  );

  const handleUploadDocument = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (result.canceled) {
      Alert.alert('Erreur', 'Aucun fichier sélectionné');
      return;
    }

    const fileUri = result.assets[0].uri;
    setUploading(true);

    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result;

        const file = {
          filename: `${selectedDocType}.jpg`,
          mimetype: 'image/jpeg',
          data: base64Data,
        };

        const uploadResponse = await fetch(`${config.backendUrl}/api/uploads/upload-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file,
            object_id: worker_id,
            type_object: 'document',
          }),
        });

        if (!uploadResponse.ok) {
          throw new Error('Échec du téléchargement');
        }

        // Save document reference
        await fetch(`${config.backendUrl}/api/mission/add-worker-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ worker_id, name: selectedDocType }),
        });

        Alert.alert('Succès', 'Document téléchargé');
        setUploadedDocs((prev) => [...prev, selectedDocType]);
        setModalVisible(false);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = allDocs.filter(doc =>
  doc.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>DOCUMENTS DISPONIBLES</Text>
      {allDocs.map(doc => renderDocument(doc, uploadedDocs.includes(doc)))}

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>AJOUTER UN DOCUMENT</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez un type de document :</Text>
            <TextInput
  style={styles.searchInput}
  placeholder="Rechercher un document..."
  placeholderTextColor="#888"
  value={searchQuery}
  onChangeText={setSearchQuery}
/>

            <Picker
              selectedValue={selectedDocType}
              onValueChange={(itemValue) => setSelectedDocType(itemValue)}
            >
             {filteredDocs.map(doc => renderDocument(doc, uploadedDocs.includes(doc)))}

            </Picker>

            <TouchableOpacity
              style={[styles.addButton, { marginTop: 20 }]}
              onPress={handleUploadDocument}
              disabled={uploading}
            >
              <Text style={styles.addButtonText}>
                {uploading ? 'Téléchargement...' : 'Sélectionner un fichier'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: '#ccc', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
              disabled={uploading}
            >
              <Text style={[styles.addButtonText, { color: '#333' }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  docButton: {
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  okButton: {
    backgroundColor: '#45D188',
  },
  missingButton: {
    backgroundColor: '#EF3E3E',
  },
  docText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#A6A6A6',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '85%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  searchInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 15,
  fontSize: 16,
  color: '#000',
},


  
});

export default DocumentsScreen;
