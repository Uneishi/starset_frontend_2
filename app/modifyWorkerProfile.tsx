import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const saveMode = async (mode: string) => {
  try {
    await AsyncStorage.setItem('mode', mode);
  } catch (e) {
    console.error('Erreur lors de la sauvegarde du mode', e);
  }
};

const ModifyWorkerProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedMode, setSelectedMode] = useState<'particulier' | 'company'>('particulier');

  useEffect(() => {
    // Sauvegarder la sélection au changement
    saveMode(selectedMode);
  }, [selectedMode]);

  const handleConfirm = () => {
    if (selectedMode === 'particulier') {
      navigation.navigate('ParticulierTabs' as never);
    } else {
      navigation.navigate('CompanyTabs' as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle} />

      <Text style={styles.title}>
        MODIFIER VOTRE{'\n'}
        PROFIL WORKER
      </Text>

      <Text style={styles.subtitle}>
        Choisissez votre statut actuel :
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedMode === 'particulier' ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => setSelectedMode('particulier')}
        >
          <Text style={selectedMode === 'particulier' ? styles.buttonTextSelected : styles.buttonTextUnselected}>
            Particulier
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedMode === 'company' ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => setSelectedMode('company')}
        >
          <Text style={selectedMode === 'company' ? styles.buttonTextSelected : styles.buttonTextUnselected}>
            Company
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.8}>
        <Text style={styles.confirmButtonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8da7bf',
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  button: {
    flex: 1,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 2,
  },
  buttonSelected: {
    backgroundColor: '#2e8b57',
    borderColor: '#2e8b57',
  },
  buttonUnselected: {
    backgroundColor: '#fff',
    borderColor: '#2e8b57',
  },
  buttonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonTextUnselected: {
    color: '#2e8b57',
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmButton: {
    marginTop: 50,
    backgroundColor: '#2e8b57',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ModifyWorkerProfileScreen;
