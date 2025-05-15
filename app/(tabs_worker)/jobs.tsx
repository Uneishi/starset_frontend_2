import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config.json';
import { useAllWorkerPrestation } from '@/context/userContext';


const JobsScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false); // Modal for "Nouveau"
  const [isRequestModalVisible, setRequestModalVisible] = useState(false); // New modal for "Demande de missions"
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [prestations, setPrestations] = useState([]); 
  const [metierNames, setMetierNames] = useState([]); 
  const [isInProgressModalVisible, setInProgressModalVisible] = useState(false); // Popup "En Cours"
  const [workerPlannedPrestations, setWorkerPlannedPrestations] = useState<any[]>([]);
  const [isWorkerRequestModalVisible, setWorkerRequestModalVisible] = useState(false); // Modal qui affiche les missions planifiées du worker
  const { allWorkerPrestation, setAllWorkerPrestation } = useAllWorkerPrestation();

  const handleJobSelection = (jobTitle : any) => {
    setSelectedJob(jobTitle);
  };

  const getWorkerId = async () => {
    console.log("debut de get worker id")
    try {
      const worker_id = await AsyncStorage.getItem('worker_id');
      if (worker_id !== null) {
        console.log("worker_id")
        console.log(worker_id)
        return worker_id;
      }
    } catch (e) {
      
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  

  const getAllPrestation = async () => {
    try {
      const account_id = await getAccountId();
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrestations(data.prestations);
      setAllWorkerPrestation(data.prestations);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const goToPrestation = (prestation : any) => {
    const id = prestation.id;
    console.log(123);
    navigation.navigate({
      name: 'prestation',
      params: { id },
    } as never);
  };

  const getAllMetierNames = async () => {
    try {
      const account_id = await getAccountId();
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-metier-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMetierNames(data.metierNames);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const getAccountId = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId !== null) {
        return accountId;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const getWorkerPlannedPrestation = async () => {
    try {
      const worker_id = await getWorkerId();
      console.log(worker_id)
      console.log("worker_id2")
      const response = await fetch(`${config.backendUrl}/api/mission/get-worker-planned-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worker_id: worker_id }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Worker Planned Prestation:', data.plannedPrestations);
      setWorkerPlannedPrestations(data.plannedPrestations);
  
    } catch (error) {
      console.error('Error fetching worker planned prestations:', error);
    }
  };

  const handleChangePlannedPrestationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/change-planned-prestation-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(`Prestation mise à jour: ${data.message}`);
  
      // Rafraîchir les prestations après mise à jour
      await getWorkerPlannedPrestation();
      setRequestModalVisible(false); // Fermer le modal après action
  
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };
  
  
  const openWorkerRequestModal = async () => {
    setWorkerRequestModalVisible(true);
  };

  useEffect(() => {
    getAllPrestation();
    getAllMetierNames();
    getWorkerPlannedPrestation()
  }, []);

  const isSelected = (jobTitle : any) => selectedJob === jobTitle;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => setInProgressModalVisible(true)}>
          <View style={styles.iconCircle}>
            <FontAwesome name="coffee" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>MY JOBS</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher"
        placeholderTextColor="#808080"
      />
      
      <TouchableOpacity style={styles.missionBanner} onPress={openWorkerRequestModal}>
        <Text style={styles.missionText}>Demande de missions : 1</Text>
      </TouchableOpacity>

      {Array.isArray(allWorkerPrestation) && allWorkerPrestation.map((prestation: any, index: number) => (
        <TouchableOpacity 
          key={index} 
          style={styles.jobCard}
          onPress={() => goToPrestation(prestation)}
        >
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{prestation.metier}</Text>
          </View>
          <Text style={styles.jobStats}>({prestation.completedprestation}) Missions effectuées</Text>
          <Text style={styles.jobStats}>(0) Multimédia</Text>
          <Text style={styles.jobRequests}>(0) Demandes missions</Text>
          <View style={[styles.statusBadge, { backgroundColor: prestation.published ? '#00cc66' : '#cc0000' }]}>
            <Text style={styles.statusText}>{prestation.published ? 'Publié' : 'Not Published'}</Text>
          </View>
        </TouchableOpacity>
      ))}

      

      {/* New Modal for "Demande de missions" */}
      <Modal
        transparent={true}
        visible={isRequestModalVisible}
        animationType="slide"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.offerModalContent}>
            
            {/* Bouton de fermeture en haut à droite */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setRequestModalVisible(false)}>
              <FontAwesome name="times" size={20} color="black" />
            </TouchableOpacity>

            {/* Titre */}
            <Text style={styles.modalTitle}>Détails de la mission</Text>

            {/* Affichage des infos de la mission */}
            {selectedJob && (
              <View style={styles.missionInProgressItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>{new Date(selectedJob.start_date).getUTCDate()}</Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.missionInProgressText}>{selectedJob.metier}</Text>
                    <Text style={styles.missionTime}>
                      {selectedJob.start_time} → {selectedJob.end_time}
                    </Text>
                  </View>
                </View>
                <Text style={styles.missionPrice}>{selectedJob.remuneration}€</Text>
              </View>
            )}

            {/* Boutons Accepter & Refuser */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleChangePlannedPrestationStatus(selectedJob.id, 'rejected')}
              >
                <Text style={styles.modalButtonText}>Refuser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleChangePlannedPrestationStatus(selectedJob.id, 'inProgress')}
              >
                <Text style={styles.modalButtonText}>Accepter</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={isInProgressModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>MISSIONS EN COURS</Text>
            {workerPlannedPrestations.filter(p => p.status === 'inProgress').length > 0 ? (
              workerPlannedPrestations.filter(p => p.status === 'inProgress').map((prestation, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.missionItem}
                    onPress={() => {
                     
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.dayContainer}>
                        <Text style={styles.dayText}>{new Date(prestation.start_date).getUTCDate()}</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.missionInProgressText}>{prestation.metier}</Text> {/* Nom par défaut */}
                        <Text style={styles.missionTime}>
                          {prestation.start_time} → {prestation.end_time}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.missionPrice}>{prestation.remuneration}€</Text>
                  </TouchableOpacity>
                ))
              ) : (
              <Text style={styles.noMissionsText}>Aucune mission en cours.</Text>
            )}
            <TouchableOpacity onPress={() => setInProgressModalVisible(false)}
              style={styles.inProgressCloseButton}>
              <Text style={styles.inProgressCloseButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={isWorkerRequestModalVisible}
        animationType="slide"
        onRequestClose={() => setWorkerRequestModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>DEMANDES DE MISSIONS</Text>
            <Text style={styles.modalSubtitle}>Missions en attente</Text>

            {/* Liste des prestations récupérées */}
            <View style={styles.missionInProgressItemContainer}>
              {workerPlannedPrestations.length > 0 ? (
                workerPlannedPrestations.filter(p => p.status === 'waiting').map((prestation, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.missionItem}
                    onPress={() => {
                      setSelectedJob(prestation); // Stocker la prestation sélectionnée
                      setRequestModalVisible(true); // Ouvrir le modal de demande
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.dayContainer}>
                        <Text style={styles.dayText}>{new Date(prestation.start_date).getUTCDate()}</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.missionInProgressText}>{prestation.metier}</Text> {/* Nom par défaut */}
                        <Text style={styles.missionTime}>
                          {prestation.start_time} → {prestation.end_time}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.missionPrice}>{prestation.remuneration}€</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>
                  Aucune mission en attente.
                </Text>
              )}
            </View>

            {/* Bouton pour fermer le modal */}
            <TouchableOpacity
              style={styles.inProgressCloseButton}
              onPress={() => setWorkerRequestModalVisible(false)}
            >
              <Text style={styles.inProgressCloseButtonText}>FERMER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  missionBanner: {
    backgroundColor: '#00cc66',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  missionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  jobCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobStats: {
    fontSize: 16,
    color: '#666',
  },
  jobRequests: {
    fontSize: 16,
    color: 'red',
  },
  newJobButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  newJobButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalOptionText: {
    fontSize: 18,
  },
  selectedOption: {
    backgroundColor: '#00cc66',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  validateButton: {
    backgroundColor: '#00cc66',
    padding: 10,
    borderRadius: 5,
  },
  validateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    
    padding: 10,
    borderRadius: 5,
    position: 'absolute', // Permet de positionner l'élément librement
    top: 10, // Marge en haut
    right: 10, // Colle le bouton à droite
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  requestModalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  requestModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestModalDetail: {
    fontSize: 16,
    color: '#00cc66',
    marginBottom: 15,
  },
  requestModalSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requestModalInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  requestModalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00cc66',
    marginVertical: 10,
  },
  requestModalLink: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  iconContainer: {
    width : '100%',
    alignItems : 'flex-end',
    justifyContent  : 'flex-end',
    marginTop : 10,
    zIndex: 10, // Assure que l'icône est au-dessus du reste du contenu
  },
  iconCircle: {
    backgroundColor: '#00cc66', // Vert
    width: 40, // Taille du cercle
    height: 40,
    borderRadius: 20, // Cercle parfait
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#00cc66',
    textAlign: 'center',
  },
  
  missionItem: {
    width : '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Équilibre entre les éléments
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0', // Couleur claire pour la bordure
    position: 'relative',
  },

  missionInProgressItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 10,
    width : '100%'
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

  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  offerModalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  
  rejectButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 5,
    
    alignItems: 'center',
    marginHorizontal: 5,
  },

  noMissionsText: { 
    textAlign: 'center', 
    color: '#999', 
    marginVertical: 10 
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
  
});

export default JobsScreen;
