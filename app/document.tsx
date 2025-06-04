import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import config from '../config.json';

const DocumentsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('identite');
  const [uploading, setUploading] = useState(false);

  const documentOptions = [
    { label: 'Pièce d’identité', value: 'identite' },
    { label: 'Casier B3', value: 'casier_b3' },
    { label: 'Permis B', value: 'permis_b' },
    { label: 'ACACED', value: 'acaced' },
  ];

  const requiredDocuments = [
    { name: 'Pièce d’identité', status: 'ok' },
    { name: 'Casier B3', status: 'missing' },
  ];

  const recommendedDocuments = [
    { name: 'Permis B', status: 'missing' },
  ];

  const addedDocuments = [
    { name: 'ACACED', status: 'ok' },
  ];

  const renderDocument = (doc: any) => (
    <TouchableOpacity
      key={doc.name}
      style={[
        styles.docButton,
        doc.status === 'ok' ? styles.okButton : styles.missingButton,
      ]}
    >
      <Text style={styles.docText}>{doc.name}</Text>
    </TouchableOpacity>
  );

  const handleUploadDocument = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour continuer.');
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

        const object_id = 'user-document'; // remplace par l’ID réel
        const type_object = 'document';

        const uploadResponse = await fetch(`${config.backendUrl}/api/uploads/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file, object_id, type_object }),
        });

        if (uploadResponse.ok) {
          Alert.alert('Succès', 'Document téléchargé avec succès');
          setModalVisible(false);
        } else {
          Alert.alert('Erreur', 'Échec du téléchargement');
        }
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>DOCUMENTS OBLIGATOIRES</Text>
      {requiredDocuments.map(renderDocument)}

      <Text style={styles.sectionTitle}>DOCUMENTS RECOMMANDÉS</Text>
      {recommendedDocuments.map(renderDocument)}

      <Text style={styles.sectionTitle}>DOCUMENTS AJOUTÉS</Text>
      {addedDocuments.map(renderDocument)}

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>AJOUTER UN DOCUMENT</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez un type de document :</Text>
            <Picker
              selectedValue={selectedDocType}
              onValueChange={(itemValue) => setSelectedDocType(itemValue)}
            >
              {documentOptions.map((doc) => (
                <Picker.Item key={doc.value} label={doc.label} value={doc.value} />
              ))}
            </Picker>

            <TouchableOpacity
              style={[styles.addButton, { marginTop: 20 }]}
              onPress={() => console.log(1)}//{/*handleUploadDocument*/}
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
});

export default DocumentsScreen;
