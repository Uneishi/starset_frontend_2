import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const NoteScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRating = (star : any) => {
    setRating(star);
  };

  const handleSubmit = () => {
    console.log('Rating:', rating);
    console.log('Comment:', comment);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/women/43.jpg' }}
        style={styles.avatar}
      />
      <Text style={styles.title}>BABYSITTING</Text>
      <Text style={styles.subtitle}>MARIE M</Text>

      <Text style={styles.sectionTitle}>APPRÉCIATION</Text>
      <View style={styles.tagsContainer}>
        <Text style={styles.tag}>GÉNÉREUSE</Text>
        <Text style={styles.tag}>DYNAMIQUE</Text>
        <Text style={styles.tag}>PONCTUELLE</Text>
      </View>

      <Text style={styles.sectionTitle}>NOTEZ LA PRESTATION</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={32}
              color="black"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>LAISSER UN COMMENTAIRE</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Merci pour ton service..."
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2e6',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00cc44',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NoteScreen;