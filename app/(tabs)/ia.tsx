import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../../config.json';

const ChatScreen = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute() as any;

  const spinValue = new Animated.Value(0);

Animated.loop(
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 3000, // 1 seconde pour un tour complet
    easing: Easing.linear,
    useNativeDriver: true, // Optimisation pour les performances
  })
).start();

const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});
  

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      return account_id || '';
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
      return '';
    }
  };

  const goToPrestationViewWithId = (id : any) => {
    
    console.log(123)
    console.log(id)
    navigation.navigate({
      name: 'prestationView',
      params: { id },
    } as never);
  };

  const getAllMessages = async () => {
    const user_id = await getAccountId();
    console.log(user_id)
    console.log('Fetching messages');
    try {
      const response = await fetch(`${config.backendUrl}/api/ai/get-all-ai-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id : user_id }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log(data.messages)
      setMessages(data.messages);
    } catch (error) {
      console.error('An error occurred while fetching messages:', error);
    }
  };

  const handleSendAiMessage = async () => {
    if (newMessage.trim()) {
      const user_id = await getAccountId();
      
      // Ajouter un message temporaire avec un état de chargement
      const tempMessage = {
        message_text: newMessage,
        sender_id: user_id,
        sended_by_user : true
      };
      setMessages([...messages, tempMessage]);
      setNewMessage('');
      setLoading(true);

      // Après 5 secondes, retire le loading et affiche 2 réponses IA
    setTimeout(() => {
      setMessages((prev : any) => {
        setLoading(false);
        // Supprimer le dernier message (le "loading")
        const withoutLoading = prev;

        return [
          ...withoutLoading,
          { message_text: 'Bonjour', sended_by_user: false },
        ];
      });

      // Affiche le 2e message IA après 1 seconde
      setTimeout(() => {
        setMessages((prev : any) => [
          ...prev,
          { message_text: 'Que voulez-vous ?', sended_by_user: false },
        ]);
        
      }, 1000);
    }, 5000);

      
      try {
        const response = await fetch(`${config.backendUrl}/api/ai/send-ai-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id, message_text: newMessage }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const response_json = await response.json();
        const data = response_json.data
        console.log("data")
        console.log(data)

        setMessages((prevMessages: any[]) => prevMessages.concat(data.message));
      } catch (error) {
        console.error('An error occurred while fetching messages:', error);
      }
      setLoading(false);
    }
  };

  

  useEffect(() => {
    //getAllMessages();
  }, []);

   const renderProfileItem = ({ item }: any) => (
      <TouchableOpacity
        style={styles.profileContainerList}
        onPress={() => goToPrestationViewWithId(item.metiers[0]?.id)}
      >
        <Image source={{ uri: item.profile_picture_url }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <View style={styles.nameAndRating}>
            <Text style={styles.profileName}>{item.firstname}</Text>
            <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons key={index} name="star" size={16} color="gold" />
            ))}
          </View>
        </View>
          <Text style={styles.profileDescription}>
            "Babysitting, animaux, assistance quotidienne, je suis là pour vous servir !"
          </Text>
          <View style={styles.profileCategories}>
            {item.metiers.slice(0, 3).map((metier: any, index: any) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText2}>{metier.name}</Text>
              </View>
            ))}
            <View  style={styles.categoryBadge}>
                <Text style={styles.categoryText2}>+</Text>
              </View>
          </View>
          
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.fullScreenContainer}>
        <Text style={styles.centeredText}>IA en développement</Text>
      </View>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D4F1E3',
    width : '100%'
  },
  greenCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#008000',
    borderRadius: 50,
    marginTop: 50,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginVertical: 2,
  },
  
  messageText: {
    fontSize: 16,
    color: '#000000',
  },

  otherMessageText: {
    fontSize: 16,
    color: '#fff',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#008000',
  },
  input: {
    width: '87%',
    paddingRight: 30,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000000',
  },
  myMessage: {
    backgroundColor: '#FFEB3B',
    alignSelf: 'flex-start',
  },
  otherMessage: {
    backgroundColor: '#000',
    
    alignSelf: 'flex-end',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
  },
  profileInfo: {
    
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileUsername: {
    color: '#888',
    fontSize: 14,
  },
  profileDescription: {
    fontSize: 14,
    marginVertical: 5,
  },
  profileCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },

  nameAndRating: {
    justifyContent : 'space-between',
    width : '100%',
    flexDirection : 'row',
  },

  profileContainerList: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal : 20,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal : 10,
    width : '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  // Blanc avec 50% de transparence
    borderRadius: 10,
  },

  categoryText2: {
    fontSize: 7,
    color: '#333',
  },

  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4F1E3', // Garde la couleur de fond
  },
  centeredText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },

  loadingBubble: {
    alignSelf: 'flex-end', // Aligner à droite
    marginVertical: 5,
    padding: 10,
  },
  
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000', // Cercle foncé
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    
  },
  
  loadingSquare: {
    width: 10,
    height: 10,
    backgroundColor: '#fff', // Carré noir au centre
  },
  
  animatedLoading: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(0, 128, 0, 0.5)', // Vert avec transparence
    borderTopColor: 'transparent',
    //animation: 'spin 1s linear infinite', // Rotation infinie
  },
  scrollContainer : {
    
    width : '100%'
  }
});

export default ChatScreen;
