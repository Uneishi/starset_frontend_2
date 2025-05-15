import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, TextInput, Pressable, Animated, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Calendar } from 'react-native-calendars'; // Import the Calendar component
import config from '../config.json';
import { useFonts } from 'expo-font';
import {  BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Lexend_400Regular, Lexend_700Bold } from '@expo-google-fonts/lexend';
import { JosefinSans_700Bold, JosefinSans_100Thin} from '@expo-google-fonts/josefin-sans';
import * as Font from 'expo-font';


const PrestationViewScreen = () => {
  const [selectedTab, setSelectedTab] = useState('photos'); // Onglet par défaut: 'photos'
  const navigation = useNavigation()
  const route = useRoute() as any;
  const prestation_id = route.params?.id;
  const prestationRef = useRef(null);
  const [account, setAccount] = useState<any>(null);
  const [metiers, setMetiers] = useState<any>([]);
  const [prestation, setPrestation] = useState<any>({});
  const [prestationImages, setPrestationImages] = useState<any>([]);
  const [experiences, setExperiences] = useState([])
  const [certifications, setCertifications] = useState([])
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State for the date picker modal
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false); // State for the calendar modal
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isArrivalTimePickerVisible, setArrivalTimePickerVisible] = useState(false);
  const [isDepartureTimePickerVisible, setDepartureTimePickerVisible] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false); // Contrôle de la visibilité du modal
  const [selectedImage, setSelectedImage] = useState(null); // Image sélectionnée
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false); // Pour le pop-up
  
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')); // Array from "00" to "23"
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // Array from "00" to "59"

  const [arrivalHour, setArrivalHour] = useState('');
  const [arrivalMinute, setArrivalMinute] = useState('');
  const [departureHour, setDepartureHour] = useState('');
  const [departureMinute, setDepartureMinute] = useState('');
  const [selectedMetier, setSelectedMetier] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [modalType, setModalType] = useState<string | null>('date'); // 'date', 'arrival', 'departure'
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  
    const profileImageSize = scrollY.interpolate({
      inputRange: [0, 70],
      outputRange: [120, 80],
      extrapolate: 'clamp',
    });

    const [fontsLoaded] = useFonts({
      BebasNeue_400Regular,
      Lexend_400Regular,
      Lexend_700Bold,
      JosefinSans_700Bold,
      JosefinSans_100Thin,
    });

    const reviews = [
      {
        id: '1',
        name: 'Chloé.C',
        text: "Cela fait maintenant 2 mois que Alicia garde mes enfants, et je suis entièrement satisfaite de son professionnalisme et de sa gentillesse. Merci ma chère Alicia ❤️",
      },
      {
        id: '2',
        name: 'Stéphane.C',
        text: "Alicia garde mes animaux pour les vacances, vraiment top et fiable !",
      },
      {
        id: '3',
        name: 'Jérôme.B',
        text: "Meilleure nounou ! Toujours à l'heure, joue beaucoup avec mes enfants, je recommande.",
      },
    ];

  const photos = [
    { uri: 'https://www.asiakingtravel.fr/cuploads/files/voyage-malaisie-itineraire-budget-circuit-7-jours-1.jpg' },
    { uri: 'https://images.partir.com/AkZB3l-cw9XLIP7t9SBGA20aW2Q=/750x/filters:sharpen(0.3,0.3,true)/lieux-interet/malaisie/malaisie-perhentian.jpg' },
    { uri: 'https://www.monde-authentique.com/wp-content/gallery/Malaisie/Paysage-de-Tasik-Dayang-Bunting-sur-l-ile-de-Langkawi.jpg' },
    { uri: 'https://www.parcours-voyages.fr/photoblogfancy/1000/600/65b22dca427c2-temple-4580960-1280.jpg' },
    { uri: 'https://media.oovatu.com/43-540/malaisie_82366.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
  ];

  const handleHourChange = (text : any, setHour : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      setHour(value);
    }
  };

  // Function to validate minute input
  const handleMinuteChange = (text : any, setMinute : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      setMinute(value);
    }
  };

  const handleDepartureHourChange = (text : any, setHour : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      setHour(value);
    }
  };

  // Function to validate minute input
  const handleDepartureMinuteChange = (text : any, setMinute : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      setMinute(value);
    }
  };

  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible); // Toggle the visibility of the date picker
  };

  const goToChoosePrestation = async () => {
    
    navigation.navigate({
      name: 'choosePrestation',
      params: { prestation_id },
    } as never);
  };

  const toggleArrivalTimePicker = () => {
    //setCalendarVisible(false)
    //setArrivalTimePickerVisible(!isArrivalTimePickerVisible);
    
    openModal('arrival'); // Ouvre le modal pour l'heure d'arrivée
  }
  const toggleDepartureTimePicker = () => {
    //setArrivalTimePickerVisible(false)
    //setDepartureTimePickerVisible(!isDepartureTimePickerVisible);
    openModal('departure'); // Ouvre le modal pour l'heure d'arrivée
  }


  const toggleTimePicker = () => {
    setTimePickerVisible(!isTimePickerVisible);
  };

  const toggleCalendar = () => {
   
    setCalendarVisible(!isCalendarVisible); // Toggle the visibility of the calendar
    
  };

  const handleDateSelect = (day : any) => {
    const selectedDate = day.dateString;

    if (!startDate) {
      setStartDate(selectedDate); // Si aucune date de début n'est définie, définissez-la
      //console.log("Date de début sélectionnée:", selectedDate);
    } else if (!endDate) {
      setEndDate(selectedDate); // Si aucune date de fin n'est définie, définissez-la
      //console.log("Date de fin sélectionnée:", selectedDate);
      //console.log("Plage de dates sélectionnée:", startDate, "à", selectedDate); // Affiche la plage de dates
      
    } else {
      // Réinitialisez les dates si les deux ont déjà été sélectionnées
      
      setStartDate(selectedDate); // Redémarrez avec la nouvelle date de début
      setEndDate(''); // Réinitialisez la date de fin
    }
  };

  const getPrestation = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-prestation`, {
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
      // Stocker les prestations dans l'état
      setPrestation(data.prestation);
      setProfilePictureUrl(data.account.profile_picture_url)
      setMetiers(data.metiers)
      setAccount(data.account)
      setPrestationImages(data.images)
      
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const checkConversation = async () => {
    
    try {
      const person1_id = await getAccountId();
      const person2_id = await prestation.worker_id;
      const person1_type = 'user';
      const person2_type = 'worker';
      const response = await fetch(`${config.backendUrl}/api/conversation/check-conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1_id, person2_id, person1_type, person2_type }),
      });
      const data = await response.json();

      if (data.exists) {
        // Si la conversation existe, on va directement au chat

        goToChat(data.conversation_id);
      } else {
        // Sinon, on affiche le pop-up de confirmation
        setConfirmModalVisible(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la conversation:', error);
    }
  };

  const openModal = (type: string) => {
    setModalType(type);
    setCalendarVisible(true); // Ouvre le modal
  };

  const createConversation = async () => {
    try {
      const person1_id = await getAccountId();
      const person2_id = prestation.worker_id;
      const person1_type = 'user';
      const person2_type = 'worker';

      const response = await fetch(`${config.backendUrl}/api/conversation/create-conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1_id, person2_id, person1_type, person2_type }),
      });

      const data = await response.json();
      setConfirmModalVisible(false); // Fermer le modal
      goToChat(data.conversation.id); // Aller au chat avec la nouvelle conversation
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
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

  const goToChat = async (conversation_id : any) => {
    const account_id = await getAccountId()
    navigation.navigate({
      name: 'chat',
      params: {conversation_id : conversation_id , sender_id : account_id , sender_type : 'user', contact_profile_picture_url : profilePictureUrl},
    } as never);
  
  }

  const goToOtherPrestation = async (prestation_id : any, metier : any) => {
    setSelectedTag(metier)
    navigation.navigate({
      name: 'prestationView',
      params: {id : prestation_id},
    } as never);
  
  }

  const getAllCertification = async () => {
    try {
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

      // Stocker les prestations dans l'état
      setCertifications(data.certifications);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des certifications:', error);
    }
  };

  const getAllExperience = async () => {
    try {
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

      // Stocker les prestations dans l'état
      setExperiences(data.experiences);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  const getUnavailableDates = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/planned-prestation/get-worker-unavailable-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: prestation.worker_id }),
      });
  
      const data = await response.json();
      console.log(data)
      if (data.success) {
        console.log('data.unavailableDates')
        console.log(data.unavailableDates)
        setUnavailableDates(data.unavailableDates);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des dates indisponibles:', error);
    }
  };

  const getMarkedDates = () => {
    const markedDates: any = {};
  
    if (startDate) {
      markedDates[startDate] = { startingDay: true, color: 'green', textColor: 'white' };
    }
    if (endDate) {
      markedDates[endDate] = { endingDay: true, color: 'green', textColor: 'white' };
      const start = new Date(startDate);
      const end = new Date(endDate);
      let currentDate = start;
  
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        markedDates[dateString] = { color: 'lightgreen', textColor: 'white' };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  
    // Ajouter les dates indisponibles en rouge
    unavailableDates.forEach(date => {
      console.log(2)
      markedDates[date] = {
        disabled: true,
        disableTouchEvent: true,
        color: 'red',
        textColor: 'white'
      };
    });
    console.log(markedDates)
  
    return markedDates;
  };
  

  const openImageModal = (imageUri : any) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  useEffect(() => {
    
    getPrestation();
    getAllExperience();
    getAllCertification()
    getUnavailableDates()
    async function loadFonts() {
      await Font.loadAsync({
        'Glacial-Regular': require('../assets/fonts/GlacialIndifference-Regular.otf'),
        'Glacial-Bold': require('../assets/fonts/GlacialIndifference-Bold.otf'),
      });
    }
    loadFonts();
    
  }, []);

  useEffect(() => {
    // Ajoutez ici la logique pour recharger les données avec l'ID
    getPrestation()
    getAllExperience()
    getAllCertification()
    
  }, [route.params.id]);

  useEffect(() => {
    prestationRef.current = prestation;  // Met à jour la référence à chaque changement de prestation
  }, [prestation]);

  useEffect(() => {
    if (
      modalType === 'arrival' &&
      arrivalHour.length === 2 &&
      arrivalMinute.length === 2
    ) {
      const hour = parseInt(arrivalHour, 10);
      const minute = parseInt(arrivalMinute, 10);
      if (!isNaN(hour) && !isNaN(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        setTimeout(() => {
          setModalType('departure');
        }, 300); // Petite pause pour laisser le champ se remplir visuellement
      }
    }
  }, [arrivalHour, arrivalMinute]);

  const goToSummary = () => {
    const arrivalTime = new Date();
    arrivalTime.setHours(parseInt(arrivalHour, 10), parseInt(arrivalMinute, 10),  0);
    const departureTime = new Date();

    departureTime.setHours(parseInt(departureHour, 10), parseInt(departureMinute, 10),  0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysWorked = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // inclure le dernier jour

    toggleCalendar()
    toggleArrivalTimePicker()
    toggleDepartureTimePicker()

    const hoursWorked = (departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60 * 60); // conversion ms → heures

    const totalRemuneration = prestation.remuneration * hoursWorked * daysWorked;
    console.log('Total Rémunération:', totalRemuneration);

    navigation.navigate({
      name: 'summary',
      params: {startDate : startDate, endDate: endDate, arrivalTime : arrivalTime, departureTime : departureTime, prestation : prestation, profilePictureUrl : profilePictureUrl, totalRemuneration: totalRemuneration, },
    } as never);
  }

  return (
    <View>
      <Animated.View style={[styles.profileContainer]}>
        <Animated.Image
          source={{ uri: profilePictureUrl }}
          style={[styles.profilePicture, { width: profileImageSize, height: profileImageSize }]}
        />
      </Animated.View>
      
    <Animated.ScrollView
            style={styles.container}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
      <View style={styles.header}>
        
        <Text style={styles.profileName}>{account?.firstname}</Text>
        
      </View>

      <View style={styles.tagsContainer}>
        <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tagsScrollContainer}
    >
      {metiers.map((item : any, index: any) => (
        <TouchableOpacity
          key={index}
          style={[styles.tag, selectedTag === item.metier && styles.selectedTag]}
          onPress={() => goToOtherPrestation(item.id, item.metier)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.picture_url && (
              <Image
                source={{ uri: item.picture_url }}
                style={{ width: 16, height: 16, marginRight: 6, borderRadius: 8 }}
              />
            )}
            <Text style={[styles.tagText, selectedTag === item.metier && styles.selectedTagText]}>
              {item.metier.includes(' ') ? `${item.metier.split(' ')[0]}...` : item.metier}
            </Text>
          </View>
      </TouchableOpacity>
      ))}
    </ScrollView>
    <Text style={styles.profileDescription}>
      {account?.description || "Aucune description disponible"}
    </Text>
    
      </View>

      {/* Section des statistiques */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.metierName}>{prestation.metier}</Text>
        <Text style={styles.descriptionContainerText}>
        {prestation.description || "Aucune description disponible"}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{prestation.completedPrestation || 0}</Text>
            <Text style={styles.statLabel}>Prestations effectuées</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>❤️</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>“Passionée”</Text>
            <Text style={styles.statLabel}>Caractère</Text>
          </View>
        </View>
      </View>

      {/* Onglets pour Photos, Expériences, Certifications */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'photos' && styles.activeTabButton]}
          onPress={() => setSelectedTab('photos')}
        >
          <Text style={styles.tabButtonText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'experiences' && styles.activeTabButton]}
          onPress={() => setSelectedTab('experiences')}
        >
          <Text style={styles.tabButtonText}>Expériences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'certifications' && styles.activeTabButton]}
          onPress={() => setSelectedTab('certifications')}
        >
          <Text style={styles.tabButtonText}>Certifications</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des onglets */}
      {selectedTab === 'photos' && (
        <View style={styles.photosContainer}>
          {prestationImages.map((photo : any, index : any) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(photo.adress)} style={styles.photoButton}>
              <Image source={{ uri: photo.adress }} style={styles.photo} />
            </TouchableOpacity>
          ))}
          
        </View>
        
      )}

      {selectedTab === 'experiences' && (
        <View style={styles.experienceContainer}>
          {experiences.length === 0 ? (
            <Text>Aucune expérience disponible.</Text>
          ) : (
            experiences.map((experience : any, index) => (
              <View key={index} style={styles.experienceCard}>
                <Text style={styles.experienceTitle}>{experience.title}</Text>
                <Text style={styles.experienceDate}>{experience.date}</Text>
                <Text style={styles.experienceDescription}>{experience.description}</Text>
                
              </View>
            ))
          )}
        </View>
      )}

      {selectedTab === 'certifications' && (
        <View style={styles.experienceContainer}>
        {certifications.length === 0 ? (
          <Text>Aucune certification disponible.</Text>
        ) : (
          certifications.map((certification : any, index) => (
            <View key={index} style={styles.experienceCard}>
              <Text style={styles.experienceTitle}>{certification.title}</Text>
              <Text style={styles.experienceDate}>{certification.date}</Text>
              <Text style={styles.experienceDate}>{certification.establishment}</Text>
              <Text style={styles.experienceDescription}>{certification.description}</Text>
              
            </View>
          ))
        )}
      </View>
      )}

      {/* Avis */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.avisHeader}>Avis ({reviews.length})</Text>

        <FlatList
          data={reviews}
          keyExtractor={(item : any) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsList}
          renderItem={({ item } : any) => (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewName}>{item.name}</Text>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      {/* Tarification */}
      <View style={styles.pricingContainer}>
        <Text style={styles.pricingText}>{prestation.remuneration ? `${prestation.remuneration}€/heure` : "Tarif non défini"}</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Text style={styles.calendarButtonText}>Voir le calendrier</Text>
        </TouchableOpacity>
        <View style={styles.diagonal} />
        <View style={styles.diagonal2} />
      </View>

      <View style={styles.seeMoreContainer}>
        <TouchableOpacity style={styles.seeMoreButton} onPress={goToChoosePrestation}>
          <Text style={styles.seeMoreText}>Voir les autres prestations</Text>
          <Icon name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        {/* Flèches jaunes façon triangle à droite */}
        <View style={styles.seeMoreDiagonal} />
        <View style={styles.seeMoreDiagonal2} />
      </View>

      

      {/* Date Picker Modal */}
      

      
            {/* Custom Time Input Modal */}
        {/* Arrival Time Input Modal */}
      

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
        visible={isConfirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.conversationModalContainer}>
          <View style={styles.conversationModalContent}>
            <Text style={styles.conversationModalText}>
              Voulez-vous envoyer un message à {account?.firstname} ?
            </Text>

            <View style={styles.conversationModalButtonContainer}>
              <TouchableOpacity style={styles.conversationModalButton} onPress={createConversation}>
                <Text style={styles.conversationModalCancelButtonText}>Oui</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.conversationModalCancelButton} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.conversationModalCancelButtonText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={toggleCalendar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Petite croix pour fermer le modal */}
            <TouchableOpacity onPress={toggleCalendar} style={styles.closeIcon}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            {/* Afficher le contenu en fonction du type */}
            {modalType === 'date' && (
              <>
                <Text style={styles.modalTitle}>Choisissez une date</Text>
                <Calendar
                  onDayPress={handleDateSelect}
                  markingType="period"
                  markedDates={getMarkedDates()}
                  style={styles.calendar}
                />
                <TouchableOpacity onPress={toggleArrivalTimePicker} style={styles.horairesButton}>
                  <Text style={styles.horairesButtonText}>Horaires</Text>
                </TouchableOpacity>
              </>
            )}

            {modalType === 'arrival' && (
              <>
                <Text style={styles.modalTitle}>Heure d'arrivée</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="HH"
                    value={arrivalHour}
                    onChangeText={(text) => handleHourChange(text, setArrivalHour)}
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="MM"
                    value={arrivalMinute}
                    onChangeText={(text) => handleMinuteChange(text, setArrivalMinute)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => {
                    setModalType('departure'); // Changer pour l'heure de départ
                  }}
                >
                  <Text style={styles.nextButtonText}>Suivant</Text>
                </TouchableOpacity>
              </>
            )}

            {modalType === 'departure' && (
              <>
                <Text style={styles.modalTitle}>Heure de départ</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="HH"
                    value={departureHour}
                    onChangeText={(text) => handleHourChange(text, setDepartureHour)}
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="MM"
                    value={departureMinute}
                    onChangeText={(text) => handleMinuteChange(text, setDepartureMinute)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => goToSummary()}
                >
                  <Text style={styles.nextButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
    </Animated.ScrollView>

    <View style={styles.headerBar}>
      {/* Flèche retour */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
    
            
    
            {/* Icônes à droite */}
      <View style={styles.headerIcons}>
        <TouchableOpacity
          onPress={checkConversation}
          style={styles.iconButton}
        >
          <Icon name="mail" size={30} color="black" />
        </TouchableOpacity>
    
        <TouchableOpacity
          onPress={() => console.log("✅ Icône paramètres cliquée !")}
          style={styles.iconButton}
        >
          <Icon name="more-vert" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    {/* Ajouter au panier */}
    
    <View style={styles.addButtonFixedContainer}>
        
        <TouchableOpacity style={styles.addButton} onPress={toggleCalendar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.addButtonText}>Ajouter</Text>
            <Icon name="shopping-cart" size={24} color="white" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    marginTop : 170
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    fontSize: 24,
    color: '#000',
    marginTop: 10,
    textAlign : 'center',
    fontFamily : 'JosefinSans_700Bold'
  },

  metierName: {
    fontSize: 24,
    color: '#000',
    marginTop: 10,
    textAlign : 'center',
    fontFamily : 'JosefinSans_700Bold'
  },

  profileDescription: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Glacial-Regular',
  },
  tagsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tagsScrollContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal : 15,
    paddingVertical: 12,
    //backgroundColor: '#f0f0f0', // Couleur par défaut pour les badges
  },

  selectedTag: {
    backgroundColor: 'gold', // Fond grisé
    borderColor: '#999', // Bordure visible
  },

  tagText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'JosefinSans_700Bold',
  },

  selectedTagText: {
    color: '#fff', // Texte plus foncé pour le badge sélectionné
    fontFamily: 'JosefinSans_700Bold',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 15,
    color: '#000',
    fontFamily : 'Glacial-Regular'
  },
  statLabel: {
    fontSize: 11,
    width : '80%',
    color: '#000',
    textAlign : 'center',
    fontFamily : 'Glacial-Bold',
  },

  descriptionContainer: {
    //backgroundColor: '#f4f4f4',
    //margin : 20,
    textAlign : 'center',
    //marginHorizontal: 10,
    borderRadius: 5,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0', // Couleur claire pour la bordure
  },

  descriptionContainerText: {
    fontSize: 12,
    textAlign : 'center',
    fontFamily : 'Glacial-Regular'
  },

  tabContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    marginVertical: 20,
    marginLeft : 10
  },
  tabButton: {
    padding: 10,
    borderRadius: 20,
    margin : 5,
    backgroundColor: '#00cc66',
  },
  activeTabButton: {
    backgroundColor: '#7ed957',
  },
  tabButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily : 'JosefinSans_700Bold',
    textAlign: 'center'
  },

  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems : 'center',
  },
  
  photo: {
    width: '98%',
    aspectRatio: 1,
    alignSelf : 'center'
  },

  photoButton: {
    width: '33.33%',
    aspectRatio: 1,
  },

  experienceContainer: {
    padding: 10,
  },
  experienceCard: {
    marginBottom: 20,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  experienceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  experienceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  experienceImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  experienceImage: {
    width: '48%',
    height: 100,
    borderRadius: 5,
  },
  certificationsContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  review: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  
  reviewAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //marginBottom: 120,
    backgroundColor: '#00743C',
    height: 100,
    marginHorizontal: 10,
    paddingHorizontal: 30,
    position: 'relative',
    overflow: 'hidden',
    
  },
  diagonal: {
    position: 'absolute',
    right: -35,
    top: -35,
    width: 70,
    height: 70,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
  },
  diagonal2: {
    position: 'absolute',
    right: -35,
    bottom: -35,
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  pricingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  calendarButton: {
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  calendarButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  addButtoncontainer: {
    width: '100%',
    alignItems: 'center',
    
  },
  
  addButtonFixedContainer: {
    position: 'absolute', // Position fixe
    bottom: 0, // Positionné à 10px du bas de l'écran
    left: 0,
    right: 0,
    alignItems: 'center', // Centré horizontalement
    paddingVertical: 10, // Espacement autour du bouton
    zIndex: 1000, // Toujours au-dessus du contenu
  },

  addButton: {
    backgroundColor: '#00BF63',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
  },

  addButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily : 'Glacial-Bold'
  },

  sectionHeader: {
    fontSize : 15,
    fontWeight: 'bold',
    color: '#000',
    marginVertical : 10,
    marginLeft : 5,
    padding : 8,
    backgroundColor : '#d9d9d9',
    borderRadius : 20,
    alignSelf: 'flex-start'
  },

  avisHeader: {
    fontSize : 15,
    
    color: '#000',
    marginVertical : 10,
    marginLeft : 5,
    padding : 8,
    backgroundColor : '#d9d9d9',
    borderRadius : 20,
    alignSelf: 'flex-start',
    fontFamily : 'JosefinSans_100Thin'
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  
  dateButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#00cc66', // Button color
  },
  
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF6666', // Close button color
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
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
  
  timePickerContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  timePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timePickerItem: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  timePickerSeparator: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  pickerContainer: {
    width: 50,
    height: 150, // Set a fixed height for scrolling
  },
  pickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 24,
  },
  selectedText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },

  datePicker: {
    width: 300,
    marginBottom: 20,
  },
  
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  
  picker: {
    width: 100,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  input: {
    width: 60,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
  },
  timeSeparator: {
    fontSize: 40,
    marginHorizontal: 10,
  },

  backIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fond semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
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

  conversationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  conversationModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  
  conversationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  conversationModalText: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'BebasNeue_400Regular' ,
  },

  conversationModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical : 20
  },
  conversationModalButton: {
    backgroundColor: 'green',
    padding: 5,
    paddingHorizontal : 15,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  conversationModalButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'BebasNeue_400Regular' 
  },
  conversationModalCancelButton: {
    backgroundColor: 'red',
    padding: 5,
    paddingHorizontal : 15,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  conversationModalCancelButtonText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'BebasNeue_400Regular' 
  },

  // HEADER
  headerBar: {
    position : 'absolute',
    top: 25, // Positionné à 10px du bas de l'écran
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center', // Centrage du titre
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  profileContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  seeMoreContainer: {
    backgroundColor: '#FFD700',
    marginHorizontal: 10,
    
    paddingVertical: 15,
    paddingHorizontal: 20,
    
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 120,
    marginTop: 10,
    paddingRight : 60
  },
  
  seeMoreButton: {
    flexDirection: 'row',
    //alignItems: 'space-between',
  
    justifyContent: 'space-between',
  },
  
  seeMoreText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  
  seeMoreDiagonal: {
    position: 'absolute',
    right: -35,
    top: -35,
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  
  seeMoreDiagonal2: {
    position: 'absolute',
    right: -35,
    bottom: -35,
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },

  reviewsList: {
    paddingHorizontal: 10,
  },
  
  reviewCard: {
    backgroundColor: '#EEEEEE',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    width: 250,
    
    
    
    
  },
  
  reviewName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Glacial-Bold', 
  },
  
  reviewText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Glacial-Regular',
  },
  
});

export default PrestationViewScreen;
