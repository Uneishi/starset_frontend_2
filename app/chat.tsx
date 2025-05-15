import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // You can use icons for the send button

import config from '../config.json';

const ChatScreen = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { conversation_id, sender_id, sender_type , contact_profile_picture_url, contact_firstname} = route.params || {};

  const getAllMessages = async () => {
    try {
      console.log('Fetching messages');
      const response = await fetch(`${config.backendUrl}/api/conversation/get-all-messages-by-conversation-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Messages:', data.messages);
      setMessages(data.messages);
    } catch (error) {
      console.error('An error occurred while fetching messages:', error);
    }
  };

  const getLocalTime = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message_time = getLocalTime();
      const newMessageObject = {
        id: '',
        conversation_id: conversation_id,
        sender_id: sender_id,
        sender_type: sender_type,
        message_text: newMessage,
        timestamp: message_time,
      };
      setMessages((prevMessages: any) => [...prevMessages, newMessageObject]);
      setNewMessage('');

      try {
        const response = await fetch(`${config.backendUrl}/api/conversation/send-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newMessageObject }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('data : ', data);
      } catch (error) {
        console.error('An error occurred while fetching messages:', error);
      }
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Placeholder image at the top center */}
      <View style={styles.header}>
        <Image
          source={{ uri: contact_profile_picture_url }} // Placeholder for user avatar
          style={styles.headerImage}
        />
        <Text style={styles.headerName}>{contact_firstname}</Text>
      </View>

      {/* Scrollable message list */}
      {/*<ScrollView style={styles.messageContainer} contentContainerStyle={{ flexGrow: 1 }}> */}
      <ScrollView style={styles.messageContainer}>
        {messages.map((message: any, index: React.Key | null | undefined) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender_id === sender_id ? styles.myMessage : styles.otherMessage,
            ]}
          >
            
            <View style={message.sender_id === sender_id ? styles.myTextWrapper : styles.otherTextWrapper}>
              <Text style={styles.messageText}>{message.message_text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed input bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={24} color="#008000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Ajouter un message..."
          placeholderTextColor="#808080"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,  // Fine border
    borderColor: 'rgba(0, 0, 0, 0.1)', // Subtle color for the border (almost invisible)
  },

  messageContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 5,
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
  myTextWrapper: {
    backgroundColor: '#FFEB3B',
    padding: 10,
    borderRadius: 20,
    maxWidth: '70%',
  },
  otherTextWrapper: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 20,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerName: {
    marginTop: 8, // Adds space between the image and the name
    fontSize: 18, // Size of the name text
    fontWeight: 'bold', // Make the name bold
    color: '#333', // Dark color for the name
  },
});

export default ChatScreen;
