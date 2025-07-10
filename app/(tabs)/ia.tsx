import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '../../components/ProfileCard';
import config from '../../config.json';


const AiScreen = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute() as any;
  const tabBarHeight = useBottomTabBarHeight(); // 👈 important

  const spinValue = new Animated.Value(0);

  const typingOpacity = new Animated.Value(0);

useEffect(() => {
  if (loading) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(typingOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }
}, [loading]);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
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

  const initAiContext = async () => {
    try {
      await fetch(`${config.backendUrl}/api/ai/init-ai-context-table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation du contexte IA:", error);
    }
  };

  const handleSendAiMessage = async () => {
    if (!newMessage.trim()) return;

    const user_id = await getAccountId();

    const tempMessage = {
      message_text: newMessage,
      sender_id: user_id,
      sended_by_user: true,
    };

    setMessages([...messages, tempMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${config.backendUrl}/api/ai/send-ai-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, message_text: newMessage }),
      });

      const response_json: any = await response.json();
      const data = response_json.data;
      const messageText = data.response;
      const workers = data.workers;

      setMessages(prevMessages => [
        ...prevMessages,
        {
          message_text: messageText,
          sended_by_user: false,
          workers: workers,
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de l’envoi du message IA:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    initAiContext();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D4F1E3' }} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={{ flex: 1 }}>
          {/* En-tête "IA" */}
          <View style={styles.header}>
            <Image source={require('../../assets/images/Appel.png')} style={styles.aiAvatar} />
            <Text style={styles.headerName}>MIRA</Text>
          </View>

          {/* Messages */}
          <ScrollView
  style={styles.messageContainer}
  contentContainerStyle={{ paddingBottom: 120 }} // 👈 Réserve la place de l’input
  keyboardShouldPersistTaps="handled"
>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.sended_by_user ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <View
                  style={
                    message.sended_by_user
                      ? styles.myTextWrapper
                      : styles.otherTextWrapper
                  }
                >
                  <Text style={styles.messageText}>{message.message_text}</Text>
                </View>

                {message.workers?.length > 0 && (
                  <View style={{ marginTop: 10, gap: 10 }}>
                    {message.workers.map((worker: any, i: number) => (
                      <ProfileCard key={i} item={worker} />
                    ))}
                  </View>
                )}
              </View>
            ))}

{loading && (
  <View style={[styles.messageBubble, styles.otherMessage]}>
    <Animated.Text style={[styles.typingText, { opacity: typingOpacity }]}>
      taping...
    </Animated.Text>
  </View>
)}
          </ScrollView>

          {/* Input + bouton */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Posez votre question..."
              placeholderTextColor="#808080"
            /> 
            <TouchableOpacity style ={ styles.sendButton} onPress={handleSendAiMessage}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D4F1E3',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  aiAvatar: {
    width: 110,
    height: 110,
    
    
    marginBottom: 8,
    marginTop: 50,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 2,
    width: '100%',
  },
  messageBubble2: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 2,
  },
  myTextWrapper: {
    backgroundColor: '#FFEB3B',
    padding: 10,
    borderRadius: 20,
    maxWidth: '70%',
  },
  otherTextWrapper: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#008000',
    zIndex: 10,              // 👈 Ajouté
    elevation: 10,           // 👈 Pour Android
    position: 'absolute',    // 👈 Important pour le fixer
    bottom: 0,               // 👈 Ancré en bas de l'écran
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
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    marginRight: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  customLoader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: 'rgba(0, 128, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 5,
  },
  innerSquare: {
    width: 20,
    height: 20,
    backgroundColor: '#008000',
    borderRadius: 4,
  },

  typingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    backgroundColor: '#eee',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});

export default AiScreen;
