
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config.json'; // Assurez-vous que votre clé API est stockée ici

const LocationPickerScreen = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<any>(null);
  const route = useRoute() as any;
  const { email, password , preferredFields} = route.params || {};
  const navigation = useNavigation();

  const getLocation = () => {
    console.log(coordinates)
    navigation.navigate({
        name: 'accountInfo',
        params: {email : email, password : password, preferredFields : preferredFields, address : address, coordinates : coordinates },
      } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>entrer votre adresse postale (optionnel)</Text>
      <Text style={styles.subTitle}>si vous n'ajoutez pas votre adresse vous ne pourrez commander que les services en distanciel</Text>
      
      <GooglePlacesAutocomplete
        placeholder="Entrez votre adresse..."
        fetchDetails={true}
        onPress={(data : any, details : any = null) => {
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
      />
      
      
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={getLocation}
      >
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
  subTitle: {
    fontSize: 14,
    
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
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  resultText: {
    fontWeight: 'bold',
    color: 'black',
  },
  result: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
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
    textAlign : 'center'
  },
});

export default LocationPickerScreen;