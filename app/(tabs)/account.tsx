import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque
import { saveMode } from '../chooseAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../config.json';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false); // Gérer l'affichage du rectangle pour le menu
  const [isModalVisible, setIsModalVisible] = useState(false); // Pour afficher le popup de déconnexion
  const [historyModalVisible, setHistoryModalVisible ] = useState(false); 
  const [profilePicture, setProfilePicture] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [plannedPrestations, setPlannedPrestations] = useState<any[]>([]);
  const [workerPlannedPrestations, setWorkerPlannedPrestations] = useState<any[]>([]);
  const [isWorkerRequestModalVisible, setWorkerRequestModalVisible] = useState(false); // Modal qui affiche les missions planifiées du worker


  const changeToWorker = async () => {
    saveMode('worker');
    navigation.navigate({
      name: '(tabs_worker)',
      params: { screen: 'Account_Worker' },
    } as never);
  };

  const goToTest = async () => {
    navigation.navigate('test' as never);
  };

  const goToMistral = async () => {
    navigation.navigate('mistral' as never);
  };

  const goToCard = async () => {
    navigation.navigate('paymentMethod' as never);
  };

  const goToTestImage = async () => {
    navigation.navigate('testImage' as never);
  };

  const goToProfilePicture = async () => {
    navigation.navigate('modifyAccount' as never);
  };

  const goToGetLocation = async () => {
    navigation.navigate('getLocation' as never);
  };

  const goToDocument = async () => {
    navigation.navigate('document' as never);
  };

  const goToHistory = async () => {
    navigation.navigate('history' as never);
  };

  const goToVerificationCode = async () => {
    navigation.navigate('verificationCode' as never);
  };

  const goToNote = async () => {
    navigation.navigate('note' as never);
  };

  const goToValidation = async () => {
    navigation.navigate('validation' as never);
  };

  const goToAvailability = async () => {
    navigation.navigate('availability' as never);
  };

  const goToLanguage = async () => {
    navigation.navigate('language' as never);
  };

  const goToAbout = async () => {
    navigation.navigate('about' as never);
  };

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      console.log("account_id 123")
      console.log(account_id)
      if (account_id !== null) {
        return account_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };
 
  const getProfile = async () => {
    try {
      // Récupérer l'ID du compte
      const accountId = await getAccountId(); 
  
      const response = await fetch(`${config.backendUrl}/api/auth/get-account-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Account:', data.account);
      console.log('ici')
      console.log(data)
      setAccount(data.account);
  
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return null; // Retourne null en cas d'erreur
    }
  };

  const getUserPlannedPrestation = async () => {
    try {
      // Récupérer l'ID du compte
      const accountId = await getAccountId(); 
  
      const response = await fetch(`${config.backendUrl}/api/mission/get-user-planned-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id : accountId }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Planned Prestation:', data.plannedPrestations);
      setPlannedPrestations(data.plannedPrestations);
  
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return null; // Retourne null en cas d'erreur
    }
  };

  const confirmLogout = async () => {
    // Logique pour déconnecter l'utilisateur
    // Ici, vous pouvez effacer les informations d'authentification, par exemple.
    await AsyncStorage.removeItem('account_id');
    await AsyncStorage.removeItem('worker_id');
    await AsyncStorage.removeItem('firstname');
    await AsyncStorage.removeItem('lastname');
    navigation.navigate('connexion' as never);
    setIsModalVisible(false);
  };

  const openHistoryModal = async () => {
    await getUserPlannedPrestation(); // Récupère les prestations planifiées
    setHistoryModalVisible(true); // Affiche le modal après récupération des données
  };

  const cancelPrestation = (prestationId: string) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir annuler cette prestation ?',
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => {
            try {
              const response = await fetch(`${config.backendUrl}/api/mission/cancel-prestation`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prestationId }),
              });
  
              if (!response.ok) throw new Error('Échec de l’annulation');
  
              // Recharge les prestations après annulation
              await getUserPlannedPrestation();
              Alert.alert('Succès', 'Prestation annulée avec succès.');
            } catch (err) {
              console.error(err);
              Alert.alert('Erreur', 'Impossible d’annuler la prestation.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  
  

  useEffect(() => {
    getProfile();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {/* Icône trois points verticaux pour paramètres */}
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true); // Afficher le menu pop-up
            }}
          >
            <Icon name="more-vert" size={24} color="black" />
          </TouchableOpacity>
          {isVisible && (
            <View style={styles.popup}>
              <Text style={styles.popupText}>Paramètre 1</Text>
              <Text style={styles.popupText}>Paramètre 2</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.closeButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
      // Mettre le titre en gras
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
      // Enlever la barre fine entre le header et le reste
      headerShadowVisible: false, // Pour React Navigation v6+
      // Pour une ancienne version, tu peux utiliser ceci :
      headerStyle: {
        elevation: 0, // Enlève l'ombre sur Android
        shadowOpacity: 0, // Enlève l'ombre sur iOS
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileHeader} onPress={goToProfilePicture}>
          <View >
          <Image
            source={{ 
              uri: account?.profile_picture_url 
                ? account?.profile_picture_url
                : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png' 
            }} 
            style={styles.profilePicture}
          />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{account?.firstname} {account?.lastname}</Text>
            <Text style={styles.profileHandle}>@{account?.pseudo}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.rightHeader}>
          <Text style={styles.typeOAccount}>User</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Mode paiement</Text>
        <TouchableOpacity style={styles.balanceCard} onPress={goToCard}>
          <Text style={styles.balanceAmount}>0,00 €</Text>
          <Image
            source={{ uri: 'https://example.com/wallet-icon.png' }} // Replace with actual URL
            style={styles.walletIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.menuItem}>
  <View style={styles.iconWithText}>
    <FontAwesome name="question-circle" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Aide</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={goToHistory}>
  <View style={styles.iconWithText}>
    <FontAwesome name="history" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Historique</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem}>
  <View style={styles.iconWithText}>
    <FontAwesome name="cogs" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Paramètres</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={goToLanguage}>
  <View style={styles.iconWithText}>
    <FontAwesome name="language" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Langues</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={goToAvailability}>
  <View style={styles.iconWithText}>
    <FontAwesome name="calendar-check-o" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Disponibilité</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={goToDocument}>
  <View style={styles.iconWithText}>
    <FontAwesome name="file-text" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Document</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={openHistoryModal}>
  <View style={styles.iconWithText}>
    <FontAwesome name="clock-o" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>En cours</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={goToAbout}>
  <View style={styles.iconWithText}>
    <FontAwesome name="user" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>A Propos</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={changeToWorker}>
  <View style={styles.iconWithText}>
    <FontAwesome name="user" size={20} color="#000" style={styles.menuIcon} />
    <Text style={styles.menuItemText}>Interface Worker</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={() => setIsModalVisible(true)}>
  <View style={styles.iconWithText}>
    <FontAwesome name="sign-out" size={20} color="red" style={styles.menuIcon} />
    <Text style={styles.deconnectText}>Se déconnecter</Text>
  </View>
</TouchableOpacity>

      

      {/* Modal de confirmation de déconnexion */}
      </ScrollView>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={historyModalVisible}
        animationType="slide"
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>EN COURS</Text>
              <Text style={styles.modalSubtitle}>Février</Text>

              {/* Liste des prestations récupérées */}
              <View style={styles.missionInProgressItemContainer}>
                {plannedPrestations.length > 0 ? (
                  plannedPrestations.map((prestation, index) => (
                    <TouchableOpacity key={index} style={styles.missionItem}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.dayContainer}>
                          <Text style={styles.dayText}>{new Date(prestation.start_date).getUTCDate()}</Text>
                        </View>
                        
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.missionInProgressText}>{prestation.metier}</Text> {/* Nom par défaut */}
                          <Text style={styles.missionTime}>
                            {prestation.start_time} → {prestation.end_time}
                          </Text>

                          {/* Label de statut dynamique */}
                          {prestation.status === "waiting" && (
                            <>
                              <View style={[styles.statusBadge, { backgroundColor: 'orange' }]}>
                                <Text style={styles.statusText}>Waiting</Text>
                              </View>
                              <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => cancelPrestation(prestation._id)} // <-- Utilise l'ID de la prestation
                              >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                              </TouchableOpacity>
                            </>
                          )}
                          {prestation.status === "inProgress" && (
                            <View style={[styles.statusBadge, { backgroundColor: '#00cc66' }]}>
                              <Text style={styles.statusText}>In Progress</Text>
                            </View>
                          )}
                          {prestation.status === "rejected" && (
                            <View style={[styles.statusBadge, { backgroundColor: 'red' }]}>
                              <Text style={styles.statusText}>Rejected</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.missionPrice}>{prestation.remuneration}€</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>
                    Aucune prestation en cours.
                  </Text>
                )}
              </View>

              {/* Bouton pour fermer le modal */}
              <TouchableOpacity
                style={styles.inProgressCloseButton}
                onPress={() => setHistoryModalVisible(false)}
              >
                <Text style={styles.inProgressCloseButtonText}>FERMER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop : 40
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent : 'space-between',
    marginBottom: 20,
    
  },

  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileHandle: {
    fontSize: 14,
    color: '#666',
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
    padding: 15,
    borderRadius: 10,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  walletIcon: {
    width: 40,
    height: 40,
  },
  menuItem: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },

  deconnectText: {
    fontSize: 16,
    color: 'red',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerIcon: {
    padding: 10,
  },
  footerProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  typeOAccount: {
    fontSize: 30,
    fontWeight : 'bold'
  },

  rightHeader : {
    marginRight : 30,
    marginTop : 10,
  },

 
  popup: {
    position: 'absolute',
    top: 50, // Position en haut (ajuste cette valeur si nécessaire)
    right: 10, // Position à droite
    width: 150, // Largeur du rectangle
    backgroundColor: 'white',
    borderRadius: 10, // Coins arrondis
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Ajoute une ombre sur Android
  },
  popupText: {
    fontSize: 16,
    padding: 5,
  },
  closeButton: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent : 'center',
    
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },

  missionItem: {
    width : 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Équilibre entre les éléments
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0', // Couleur claire pour la bordure
    position: 'relative',
    //backgroundColor : 'blue'
  },

  missionInProgressItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  
  missionInProgressText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },

  inProgressCloseButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  inProgressCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  missionTime: {
    fontSize: 14,
    color: '#666', // Gris clair
  },
  missionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00cc66', // Vert
    position: 'absolute',
    right: 10, // Alignement à droite
  },

  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#00cc66',
    textAlign: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    
    
    borderRadius: 10,
    alignItems: 'center',
    justifyContent : 'center',
    
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  waitingBadge: {
    backgroundColor: '#FFA500', // Orange
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start', // Ajuste la bulle à la largeur du contenu
    marginTop: 5,
  },
  
  waitingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  dayText: {
    color : 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign : 'center'
  },
  
  dayContainer: {
    width : 30,
    height : 30,
    backgroundColor : '#1E90FF',
    borderRadius : 5
  },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 5,
  },

  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 10,
  },

  cancelButton: {
    marginTop: 8,
    backgroundColor: '#FF3B30',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default AccountScreen;