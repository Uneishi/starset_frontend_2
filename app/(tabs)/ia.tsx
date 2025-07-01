import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import config from '../../config.json';

const AiScreen = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute() as any;

  const spinValue = new Animated.Value(0);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du contexte IA:', error);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, message_text: newMessage }),
      });

      const response_json = await response.json();
      const data = response_json.data;

      setMessages((prevMessages) => prevMessages.concat(data.message));
    } catch (error) {
      console.error('Erreur lors de l’envoi du message IA:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    initAiContext();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={{ flex: 1, width: '100%' }}>
        {/* En-tête "IA" */}
        <View style={styles.header}>
          <View style={styles.aiAvatar} />
          <Text style={styles.headerName}>Assistant IA</Text>
        </View>

        {/* Messages */}
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={[styles.messageContainer, { paddingBottom: 20 }]}
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
            </View>
          ))}
          {loading && (
            <View style={[styles.messageBubble, styles.otherMessage]}>
              <Animated.View
                style={[styles.animatedLoading, { transform: [{ rotate: spin }] }]}
              />
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
          <TouchableOpacity style={styles.sendButton} onPress={handleSendAiMessage}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#008000',
    marginBottom: 8,
    marginTop : 50
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  messageBubble: {
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
    backgroundColor: '#000',
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
  animatedLoading: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(0, 128, 0, 0.5)',
    borderTopColor: 'transparent',
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
  
});

export default AiScreen;
