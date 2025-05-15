import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DocumentsScreen = () => {
  const navigation = useNavigation();

  // Exemple de données (à remplacer par données dynamiques si besoin)
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

  const renderDocument = (doc: any ) => (
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      

      <Text style={styles.sectionTitle}>DOCUMENTS OBLIGATOIRES</Text>
      {requiredDocuments.map(renderDocument)}

      <Text style={styles.sectionTitle}>DOCUMENTS RECOMMANDÉS</Text>
      {recommendedDocuments.map(renderDocument)}

      <Text style={styles.sectionTitle}>DOCUMENTS AJOUTÉS</Text>
      {addedDocuments.map(renderDocument)}

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>AJOUTER UN DOCUMENT</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
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
});

export default DocumentsScreen;
