import { useUser } from '@/context/userContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config.json';

const ModifyLocationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { user, setUser } = useUser(); // Utilisation du contexte pour récupérer et mettre à jour les infos utilisateur
  const [address, setAddress] = useState(user?.address || '');
  const [coordinates, setCoordinates] = useState<any>(null);

  const updateLocation = async () => {
    try {
      // Mettre à jour l'utilisateur localement
      const updatedUser = { ...user, address, location: coordinates };
      setUser(updatedUser);
      
      // Envoyer la mise à jour au serveur
      const response = await fetch(`${config.backendUrl}/api/auth/update-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: updatedUser }),
      });
      if (!response.ok) throw new Error('Erreur de réseau');
      
      const data = await response.json();
      console.log('Mise à jour réussie:', data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compte:', error);
    }
  };

  const getLocation = async () => {
    await updateLocation();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier votre adresse</Text>
      
      <GooglePlacesAutocomplete
        placeholder="Entrez votre adresse..."
        fetchDetails={true}
        onPress={(data: any, details: any = null) => {
          setAddress(data.description);
          setCoordinates(details?.geometry.location);
        }}
        query={{
          key: config.googleApiKey,
          language: 'fr',
          components: 'country:fr',
        }}
        styles={{
          textInput: styles.input,
        }}
        textInputProps={{
          defaultValue: address,
        }}
      />
      
      <TouchableOpacity style={styles.confirmButton} onPress={getLocation}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#70FF70',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default ModifyLocationScreen;
