import { useAllWorkerPrestation, useCurrentWorkerPrestation } from '@/context/userContext';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment'; // Si tu veux formater joliment
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque
import config from '../config.json';

import {
  getAllExperience,
  getPrestation
} from '../api/prestationApi';

const PrestationScreen = () => {
  const [description, setDescription] = useState('');
  const [selectedTab, setSelectedTab] = useState('photos'); // 'photos', 'experiences', or 'certifications'
  const [isEditing, setIsEditing] = useState(false);
  const [prestationPhotos, setPrestationPhotos] = useState<any>([])
  const [uploading, setUploading] = useState<boolean>(false);

  //const [prestation, setPrestation] = useState<any>({});
  const { currentWorkerPrestation: prestation, setCurrentWorkerPrestation } = useCurrentWorkerPrestation();

  const [experiences, setExperiences] = useState<any[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // État pour gérer la visibilité du popup

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [remuneration, setRemuneration] = useState(prestation?.remuneration || ''); // Assurez-vous que prestation.remuneration est disponible

  const [certifications, setCertifications] = useState<any>([]);
  const [isCertificationFormVisible, setCertificationFormVisible] = useState(false);
  const [certificationTitle, setCertificationTitle] = useState('');
  const [certificationInstitution, setCertificationInstitution] = useState('');
  const [certificationDate, setCertificationDate] = useState('');
  const [certificationDescription, setCertificationDescription] = useState('');
  const [certificationImage, setCertificationImage] = useState<any>(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false); // Contrôle de la visibilité du modal
  const [selectedImage, setSelectedImage] = useState(null); // Image sélectionnée
  const { allWorkerPrestation, setAllWorkerPrestation } = useAllWorkerPrestation();
  const [showCalendar, setShowCalendar] = useState(false);

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showExperienceCalendar, setShowExperienceCalendar] = useState(false);
  const [experienceDate, setExperienceDate] = useState('');
  const [selectedMode, setSelectedMode] = useState<'sur place' | 'distanciel'>('sur place');
  const [showModeOptions, setShowModeOptions] = useState(false);
  


  const route = useRoute() as any;
  const prestation_id = route.params?.id;

  const maxDescriptionLength = 300;
  const photos = [
    
  ];
  const navigation = useNavigation();

  const experienceData = {
    title: 'Baby Sitting de Emma et Louis',
    date: 'Le 21/09/2022',
    description: 'C’est joie que j’ai pu garder les Emma et Louis ! Louis ayant des carences en gluten, j’ai eu l’obligation de cuisiner des repas dans "Gluten Free". Ce fut une expérience enrichissante car désormais, je sais m’adapter aux besoins de différents enfants, et à n’importe quelle situation.',
    images: [
      { uri: 'https://images.pexels.com/photos/1104012/pexels-photo-1104012.jpeg' },
      { uri: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg' }
    ],
  };

  const goToAvailability = async () => {
    navigation.navigate('availability' as never);
  };

  const getWorkerId = async () => {
    try {
      const worker_id = await AsyncStorage.getItem('worker_id');
      if (worker_id !== null) {
        return worker_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (day: any) => {
    const formatted = moment(day.dateString).format('DD/MM/YYYY');
    setCertificationDate(formatted);
    setShowCalendar(false);
  };

  const handleExperienceDateSelect = (day: any) => {
    const formatted = moment(day.dateString).format('DD/MM/YYYY');
    setExperienceDate(formatted);
    setShowExperienceCalendar(false);
  };
  
  const getExperienceMarkedDates = () => {
    if (!experienceDate) return {};
    const dateISO = moment(experienceDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    return {
      [dateISO]: {
        selected: true,
        selectedColor: '#00cc66',
      },
    };
  };

  const getMarkedDates = () => {
    if (!certificationDate) return {};
  
    const dateISO = moment(certificationDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    return {
      [dateISO]: {
        selected: true,
        selectedColor: '#00cc66',
      },
    };
  };

  const handleDeletePhoto = async (index : any) => {
    const photoToDelete = prestationPhotos[index]; // Récupérer la photo à supprimer
    const photoAdress = photoToDelete.adress; // Assurez-vous que l'ID de la photo est disponible
  
    Alert.alert(
      "Supprimer la photo",
      "Êtes-vous sûr de vouloir supprimer cette photo ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              const response = await fetch(`${config.backendUrl}/api/uploads/delete-photo`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adress: photoAdress }),
              });
  
              if (!response.ok) {
                console.log(response)
                throw new Error('Erreur lors de la suppression de la photo');
              }
  
              const data = await response.json();
  
              if (data.success) {
                // Supprimez la photo localement
                const updatedPhotos = [...prestationPhotos];
                updatedPhotos.splice(index, 1); // Supprimez la photo à l'index donné
                setPrestationPhotos(updatedPhotos);
                Alert.alert("Succès", "La photo a été supprimée avec succès.");
              } else {
                Alert.alert("Erreur", data.message || "Une erreur est survenue.");
              }
            } catch (error) {
              console.error("Erreur lors de la suppression de la photo :", error);
              Alert.alert("Erreur", "Impossible de supprimer la photo.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const addPrestationPhoto = async () => {
    // Demander la permission d'accès à la bibliothèque d'images
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour continuer.');
      return;
    }
  
    // Ouvrir la bibliothèque d'images
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //allowsEditing: true, // Permet de recadrer l'image si besoin
      quality: 1, // Qualité maximale
    });
  
    if (result.canceled) {
      console.log('L\'utilisateur a annulé la sélection d\'image.');
      Alert.alert('Erreur', 'Aucune photo sélectionnée');
      return;
    }
  
    const photo = { uri: result.assets[0].uri };

    setUploading(true);

    try {
      // Convertir l'image en base64 pour envoyer directement via JSON
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result;

        // Créer un objet JSON avec les informations du fichier
        const file = {
          filename: 'profile-photo.jpg',
          mimetype: 'image/jpeg', // Type MIME de l'image
          data: base64Data,   // Base64 ou blob
        };
        
        const object_id=prestation?.id
        const type_object = 'prestation'

        // Envoyer l'image au serveur
        const uploadResponse = await fetch(`${config.backendUrl}/api/uploads/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({file,object_id,type_object}), // Envoyer l'objet JSON directement
        });

        if (uploadResponse.ok) {
          const responseData = await uploadResponse.json();
          console.log('Upload success:', responseData);
          Alert.alert('Succès', 'Photo téléchargée avec succès');
          if (responseData.dbRecord) {
            setPrestationPhotos((prevPhotos : any) => [...prevPhotos, responseData.dbRecord]);
          }
        } else {
          console.log('Upload failed:', uploadResponse.status);
          Alert.alert('Erreur', 'Échec du téléchargement');
        }
      };

      reader.readAsDataURL(blob); // Lire le blob comme une chaîne base64
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  }

  const handleSaveRemuneration = async () => {
    // Code pour sauvegarder la rémunération
    setModalVisible(false);
    Alert.alert("Succès", "La rémunération a été enregistrée.");
    const response = await fetch(`${config.backendUrl}/api/mission/update-remuneration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prestation_id,remuneration }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    //console.log(data);

  };

  const handleFormattedRemuneration = (text: string) => {
    // Enlève tout sauf les chiffres
    const cleaned = text.replace(/[^0-9]/g, '');
  
    let number = parseInt(cleaned || '0', 10);
  
    // Divise par 100 pour avoir deux décimales
    const formatted = (number / 100).toFixed(2);
  
    setRemuneration(formatted);
  };

  
  

  const getAllCertification = async () => {
    try {
      console.log('debut get experiences')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-certification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('certification :', data.certifications);

      // Stocker les prestations dans l'état
      setCertifications(data.certifications);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  
  const getPrestationPhotos = async () => {
    try {
      console.log('debut get experiences')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('experiences :', data.experiences);

      // Stocker les prestations dans l'état
      setExperiences(data.experiences);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const checkPrestation = async () => {
    console.log('prestation : ',prestation)
  };

  const handleSaveDescription = async () => {
    setIsEditing(false);
    // Vous pouvez ajouter ici le code pour sauvegarder la nouvelle description, si nécessaire
    try {
      console.log('debut save description')
      
      const response = await fetch(`${config.backendUrl}/api/mission/save-prestation-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id, description }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('prestation modifié:', data.prestation[0]);

      // Stocker les prestations dans l'état
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const createExperience = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/create-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date: experienceDate, experienceDescription, prestation_id }),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
  
      // 🟢 Ajoute l'expérience directement à la liste
      setExperiences(prev => [...prev, data.experience[0]]);
  
      // 🟢 Ferme le formulaire
      setShowExperienceForm(false);
  
      // 🟢 Réinitialise les champs du formulaire
      setTitle('');
      setExperienceDate('');
      setExperienceDescription('');
  
      Alert.alert('Succès', 'Expérience ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'expérience:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'expérience');
    }
  };

  const openImageModal = (imageUri : any) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };
  
  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  const goToMultiplePrestation = () => {
    navigation.navigate('multiplePrestation' as never) 
  }

  const handleAddCertification = async () => {
    try {
      const newCertification = {
        title: certificationTitle,
        institution: certificationInstitution,
        date: certificationDate,
        description: certificationDescription,
        image: certificationImage, // Optionnel
      };
  
      const response = await fetch(`${config.backendUrl}/api/mission/create-certification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newCertification, prestation_id }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la certification');
      }
  
      const data = await response.json();
      
      setCertifications((prev : any) => [...prev, data.certification]);
      setCertificationFormVisible(false);
  
      Alert.alert('Succès', 'Certification ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la certification:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la certification');
    }
  };

  const confirmTogglePrestationPublished = () => {
    const action = prestation?.published ? "dépublier" : "publier";
  
    Alert.alert(
      ``,
      `Voulez-vous vraiment ${action} cette prestation ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: prestation?.published ? "Dépublier" : "Publier",
          style: "destructive",
          onPress: togglePrestationPublished, // Appelle la fonction qui gère la publication
        },
      ]
    );
  };

  const togglePrestationPublished = async () => {
    try {
      console.log('Début toggle prestation published');
  
      const response = await fetch(`${config.backendUrl}/api/mission/toggle-prestation-published`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: prestation_id }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Mise à jour de la publication :', data);
  
      // Mettre à jour l'état de la prestation en inversant la valeur de published
      setCurrentWorkerPrestation((prevPrestation : any) => ({
        ...prevPrestation,
        published: !prevPrestation.published,
      }));

      setAllWorkerPrestation((prev: any[]) =>
        prev.map(prestation =>
          prestation.id === prestation_id
            ? { ...prestation, published: !prestation.published }
            : prestation
        )
      );
    } catch (error) {
      console.error('Une erreur est survenue lors de la mise à jour de la publication:', error);
    }
  };

  const handleEditDescription = () => {
    setIsEditing(true); // Active le mode édition local
  };
  

  useEffect(() => {
    getPrestation(prestation_id).then((data: any) => {
      setCurrentWorkerPrestation(data.prestation);
      setPrestationPhotos(data.images);
      setRemuneration(data.prestation.remuneration);
    }).catch((error: any)  => console.error(error));
    
    getAllExperience(prestation_id).then((data : any) => {
      setExperiences(data.experiences);
    }).catch((error: any) => console.error(error));

    getAllCertification();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {/* Icône enveloppe */}
          

          {/* Icône trois points verticaux pour paramètres */}
          <TouchableOpacity
            onPress={() => setIsPopupVisible(true)} // Affiche le popup
          >
            <Icon name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (prestation?.description) {
      console.log(prestation)
      setDescription(prestation.description as any);
    }
  }, [prestation]); // Cette fonction s'exécute quand 'prestation' est mis à jour

  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconContainer}>
        {prestation?.picture_url ? (
          <Image
            source={{ uri: prestation.picture_url }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
            resizeMode="cover"
          />
        ) : (
          <FontAwesome name="child" size={60} color="black" />
        )}
      </View>
      <Text style={styles.title}>{prestation?.metier}</Text>
      <View style={styles.widthMax}>
      <View style={styles.descriptionRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoLabel}>description</Text>
          {isEditing ? (
            <TextInput
              style={styles.descriptionInput}
              multiline
              value={description}
              onChangeText={setDescription}
              maxLength={maxDescriptionLength}
            />
          ) : (
            <Text style={styles.infoValue}>{description || 'Aucune description'}</Text>
          )}
        </View>
        {isEditing ? (
          <TouchableOpacity onPress={handleSaveDescription}>
            <MaterialIcons name="check" size={24} color="green" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEditDescription}>
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.characterCount}>{maxDescriptionLength - description.length} caractères</Text>
      <View style={{ marginVertical: 20 }}>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>
            Mode de prestation
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            <Picker
              selectedValue={selectedMode}
              onValueChange={(itemValue) =>
                setSelectedMode(itemValue)
              }>
              <Picker.Item label="Sur place" value="sur place" />
              <Picker.Item label="Distanciel" value="distanciel" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#00cc66',
            padding: 12,
            borderRadius: 8,
          }}
          onPress={() => setShowModeOptions(!showModeOptions)}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      
      {/* Section pour les tarifs */}
      {!prestation?.type_of_remuneration?.toLowerCase().includes('prestation') ? (
        <View style={styles.tarifSection}>
        <Text style={styles.tarifTitle}>Ajouter mes tarifs</Text>

        <TouchableOpacity
          style={prestation?.remuneration ? styles.tarifDisplay : styles.tarifButton}
          onPress={() => setModalVisible(true)}
        >
          {prestation?.remuneration ? (
            <Text style={styles.tarifText}>{prestation.remuneration} €</Text>
          ) : (
            <FontAwesome name="euro" size={30} color="black" />
          )}
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.tarifSection}>
        <Text style={styles.tarifTitle}>Ajouter des prestations</Text>
        <TouchableOpacity
          style={prestation?.remuneration ? styles.tarifDisplay : styles.tarifButton}
          onPress={goToMultiplePrestation}
        >
            <Text style={styles.tarifText}>ajouter des prestations</Text> 
        </TouchableOpacity>
      </View>
    )}

      {/* Modal pour la saisie de la rémunération */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            {/* CROIX pour fermer */}
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>TARIF PAR HEURE</Text>
            
            <TextInput
              style={styles.inputModal}
              placeholder="0,00"
              keyboardType="numeric"
              value={remuneration}
              onChangeText={handleFormattedRemuneration}
            />
            
            <Text style={styles.currency}>€</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRemuneration}>
              <Text style={styles.saveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Popup Modal */}
      <Modal visible={isPopupVisible} animationType="slide" transparent={true}>
      <View style={styles.tarifPopupOverlay}>
        <View style={styles.tarifPopupContainer}>
          {/* Section 1: Prestation 1 */}
          <View style={styles.tarifPopupSectionContainer}>
            <Text style={styles.tarifPopupSectionTitle}>PRESTATION 1</Text>
            <TextInput style={styles.tarifPopupInput} placeholder="Titre" editable={false} />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              editable={false}
            />
            <View style={styles.tarifPopupContainer}>
              <TextInput
                style={[styles.input, styles.tarifPopupInput]}
                placeholder="Ajouter le tarif"
                editable={false}
              />
              <TouchableOpacity style={styles.tarifPopupButton}>
                <Icon name="euro" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.tarifPopupSaveButton}>
              <Text style={styles.tarifPopupSaveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>

          {/* Section 2: Complément */}
          <View style={styles.tarifPopupSectionContainer}>
            <Text style={styles.tarifPopupSectionTitle}>COMPLÉMENT</Text>
            <TextInput style={styles.tarifPopupInput} placeholder="Titre" editable={false} />
            <View style={styles.tarifPopupContainer}>
              <TextInput
                style={[styles.input, styles.tarifPopupInput]}
                placeholder="Ajouter le tarif"
                editable={false}
              />
              <TouchableOpacity style={styles.tarifPopupButton}>
                <Icon name="euro" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.tarifPopupSaveButton}>
              <Text style={styles.tarifPopupSaveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>

          {/* Ajouter une prestation */}
          <TouchableOpacity style={styles.tarifPopupAddButton}>
            <Text style={styles.tarifPopupAddButtonText}>Ajouter une prestation</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.tarifPopupCloseButton} onPress={() =>setIsPopupVisible(false)}>
            <Text style={styles.tarifPopupCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      {/* Section pour les horaires */}
      
      <View style={styles.availabilitySection}>
        <Text style={styles.availabilityTitle}>Ajouter mes disponibilités</Text>
        
        <TouchableOpacity
          style={styles.availabilityButton}
          onPress={goToAvailability}
        >
          <FontAwesome name="calendar" size={30} color="black" />
        </TouchableOpacity>
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, selectedTab === 'photos' && styles.activeCategoryButton]}
          onPress={() => setSelectedTab('photos')}
        >
          <Text style={styles.categoryButtonText}>Photos (6)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedTab === 'experiences' && styles.activeCategoryButton]}
          onPress={() => setSelectedTab('experiences')}
        >
          <Text style={styles.categoryButtonText}>Expériences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedTab === 'certifications' && styles.activeCategoryButton]}
          onPress={() => setSelectedTab('certifications')}
        >
          <Text style={styles.categoryButtonText}>Certifications</Text>
        </TouchableOpacity>
      </View>
      </View>

      {selectedTab === 'photos' && (
        <View style={styles.photoGrid}>
          
          {prestationPhotos.map((photo : any, index : any) => (
            <TouchableWithoutFeedback
              key={index}
              onLongPress={() => handleDeletePhoto(index)} // Déclenche une alerte sur pression longue
              onPress={() => openImageModal(photo.adress)}
            >
              <Image source={{ uri: photo.adress }} style={styles.photo} />
            </TouchableWithoutFeedback>
            
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={addPrestationPhoto}>
            <FontAwesome name="plus" size={40} color="gray" />
          </TouchableOpacity>
        </View>
      )}

      {selectedTab === 'experiences' && (
        <View>
          
          {experiences.map((experience : any) => (
            <View style={styles.experienceCard}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>{experience.title} <FontAwesome name="smile-o" size={20} /></Text>
              <Text style={styles.experienceDate}>{experience.date}</Text>
            </View>
            <Text style={styles.experienceDescription}>{experience.description}</Text>
            <View style={styles.experienceImages}>
              {experienceData.images.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.experienceImage} />
              ))}
            </View>
          </View>
          ))}

          {!showExperienceForm ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowExperienceForm(true)}
            >
              <Text style={styles.addButtonText}>Ajouter une expérience</Text>
            </TouchableOpacity>
          ) : (
          // Le formulaire est juste en dessous
        <View style={styles.certificationForm}>
          <Text style={styles.inputLabel}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre de l'expérience"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity onPress={() => setShowExperienceCalendar(true)}>
            <Text style={[styles.input, { color: experienceDate ? 'black' : '#999' }]}>
              {experienceDate || 'Sélectionnez une date'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Description de l'expérience"
            multiline
            value={experienceDescription}
            onChangeText={setExperienceDescription}
          />

          <TouchableOpacity style={styles.submitButton} onPress={createExperience}>
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowExperienceForm(false)}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
)}
          
        </View>
      )}

<Modal
  animationType="slide"
  transparent={true}
  visible={showExperienceCalendar}
  onRequestClose={() => setShowExperienceCalendar(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={() => setShowExperienceCalendar(false)} style={styles.closeIcon}>
        <Icon name="close" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.modalTitle}>Choisissez une date</Text>
      <Calendar
        onDayPress={handleExperienceDateSelect}
        markedDates={getExperienceMarkedDates()}
        style={styles.calendar}
      />
    </View>
  </View>
</Modal>

      {/* Placeholder for the "Certifications" tab */}
      {selectedTab === 'certifications' && (
        <View>
        {certifications.length > 0 ? (
          certifications.map((certification : any, index : any) => (
            <View key={index} style={styles.certificationCard}>
              <Text style={styles.certificationTitle}>{certification.title}</Text>
              <Text style={styles.certificationInstitution}>{certification.institution}</Text>
              <Text style={styles.certificationDate}>{certification.date}</Text>
              <Text style={styles.certificationDescription}>{certification.description}</Text>
              {certification.image && (
                <Image source={{ uri: certification.image }} style={styles.certificationImage} />
              )}
            </View>
          ))
        ) : (
          <Text>Aucune certification disponible</Text>
        )}
    
        {!isCertificationFormVisible ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setCertificationFormVisible(true)}
          >
            <Text style={styles.addButtonText}>Ajouter une certification</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.certificationForm}>
  <Text style={styles.inputLabel}>Titre</Text>
  <TextInput
    style={styles.input}
    placeholder="Titre de la certification"
    value={certificationTitle}
    onChangeText={setCertificationTitle}
  />

  <Text style={styles.inputLabel}>Établissement de formation</Text>
  <TextInput
    style={styles.input}
    placeholder="Établissement de formation"
    value={certificationInstitution}
    onChangeText={setCertificationInstitution}
  />

  <Text style={styles.inputLabel}>Date</Text>
  <TouchableOpacity onPress={() => setShowCalendar(true)}>
    <Text style={[styles.input, {color: certificationDate ? 'black' : '#999'}]}>
      {certificationDate || 'Sélectionnez une date'}
    </Text>
  </TouchableOpacity>

  <Text style={styles.inputLabel}>Description</Text>
  <TextInput
    style={[styles.input]}
    placeholder="Description"
    multiline
    value={certificationDescription}
    onChangeText={setCertificationDescription}
  />

  <Text style={styles.inputLabel}>Certification</Text>
  <TouchableOpacity style={styles.addPhotoButton} onPress={() => { /* ouverture image */ }}>
    {certificationImage ? (
      <Image source={{ uri: certificationImage }} style={styles.uploadedImage} />
    ) : (
      <FontAwesome name="plus" size={30} color="gray" />
    )}
  </TouchableOpacity>

  <TouchableOpacity style={styles.submitButton} onPress={handleAddCertification}>
    <Text style={styles.submitButtonText}>Valider</Text>
  </TouchableOpacity>
  <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCertificationFormVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
</View>
        )}
      </View>
      )}
      <View style={styles.publishContainer}>
        <TouchableOpacity
            style={[
            styles.publishButton,
            prestation?.published ? styles.unpublishButton : styles.publishButton,
            ]}
            onPress={confirmTogglePrestationPublished}
        >
            <Text style={styles.publishButtonText}>
            {prestation?.published ? "Retirer" : "Publier"}
            </Text>
        </TouchableOpacity>
        </View>
      
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeImageModal}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
      
<Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={toggleCalendar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Petite croix pour fermer le modal */}
            <TouchableOpacity onPress={toggleCalendar} style={styles.closeIcon}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Choisissez une date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              
              markedDates={getMarkedDates()}
              style={styles.calendar}
            />

            {/* Bouton Horaires */}
           
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
    
    paddingVertical: 20,
  } as ViewStyle,
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },

  descriptionInput: {
    maxHeight : 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },

  modifyButton: {
    alignSelf: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  modifyButtonText: {
    color: '#000',
    fontSize: 16,
  },
  
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#808080',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    marginVertical: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 20,
    margin : 5,
    backgroundColor: '#00cc66',
  },
  activeCategoryButton: {
    backgroundColor: '#7ed957',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  photo: {
    width: '33.33%',
    height : 1,
    aspectRatio: 1,
  },
  addPhotoButton: {
    width: '33.33%',
    height : 1,
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  experienceDate: {
    fontSize: 14,
    color: '#666',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  experienceImages: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  experienceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  experienceForm: {
    marginTop: 20,
    padding : 10,
    borderRadius : 10,
    backgroundColor: '#F0F0F0'
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#00cc66',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  descriptionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },

  widthMax : {
    paddingHorizontal : 20
  },

  remunerationContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  remunerationSet: {
    backgroundColor: '#FFD700', // Couleur pour la rémunération définie
  },
  remunerationAdd: {
    backgroundColor: '#FFCC00', // Couleur pour ajouter la rémunération
  },
  remunerationText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  availabilityContainer: {
    marginVertical: 10,
    
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButton: {
    alignSelf: 'stretch',
    backgroundColor: '#7ED957',
    paddingVertical: 15,
    marginHorizontal : 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 20,
  },
  inputModal: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  currency: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    right: 40,
    top: 80,
  },
  saveButton: {
    backgroundColor: '#006400',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  certificationCard: {
    backgroundColor: '#D5D5D5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    margin : 15
  },
  certificationTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  certificationInstitution: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  certificationDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  certificationDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  certificationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  certificationForm: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    margin : 15
  },
  cancelButton: {
    backgroundColor: '#FF6666',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer2: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOption: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
    textAlign: 'center',
  },

  tarifPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarifPopupContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  tarifPopupSectionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  tarifPopupSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tarifPopupInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    color: '#888', // Text color to simulate placeholder text
  },
  tarifPopupDescriptionInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  tarifPopupTarifContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tarifPopupTarifInput: {
    flex: 1,
  },
  tarifPopupButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  tarifPopupSaveButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  tarifPopupSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tarifPopupAddButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  tarifPopupAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tarifPopupCloseButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  tarifPopupCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fullScreenImage: {
    width: '90%', // Adapte l'image à l'écran
    height: '90%',
    resizeMode: 'contain',
  },

  publishContainer: {
    width : '100%',
    alignItems : 'center', 
    marginVertical : 20,
    marginBottom : 40
  },
  publishButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  publishButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight : 'bold'
  },

  unpublishButton: {
    backgroundColor: '#cc0000', // Rouge
  },

  calendar: {
    marginBottom: 10,
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  horairesButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#00cc66', // Couleur du bouton Horaires
    width: '100%',
    alignItems: 'center',
  },
  horairesButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  timePickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  descriptionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderTopWidth: 1, 
    borderBottomColor: '#E0E0E0',
    borderTopColor: '#E0E0E0'  
  },

  infoLabel: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  infoValue: { 
    fontSize: 16, 
    color: '#000' 
  },
  
  availabilitySection: {
    marginVertical: 10,
    
  },
  
  availabilityTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  
  availabilityButton: {
    backgroundColor: '#7ed957', // Vert clair
    borderRadius: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  tarifSection: {
    //marginVertical: 20,
    
  },
  
  tarifTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  
  tarifButton: {
    backgroundColor: '#f7b500', // Jaune
    borderWidth: 2,
    borderColor: 'purple', // Contour violet
    borderRadius: 10,
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  tarifDisplay: {
    backgroundColor: '#f7b500',
    
    borderRadius: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  tarifText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  
  certificationImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

});

export default PrestationScreen;
