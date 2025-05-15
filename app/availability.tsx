import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import moment from 'moment';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/userContext';

const ModifyAvailabilityScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (user?.availability) {
      setEvents(user.availability);
    }
  }, [user]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setTimeRange({ start: '', end: '' });
    setShowModal(true);
  };

  const handleAddAvailability = () => {
    if (!selectedDate || !timeRange.start || !timeRange.end) return;

    const startTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')}T${timeRange.start}`).toDate();
    const endTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')}T${timeRange.end}`).toDate();

    const newEvent = {
      title: 'Disponible',
      start: startTime,
      end: endTime,
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const handleConfirmUpdate = async () => {
    const updatedUser = { ...user, availability: events };
    setUser(updatedUser);

    try {
      const response = await fetch(`${config.backendUrl}/api/auth/update-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: updatedUser }),
      });
      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();
      console.log('Mise à jour réussie:', data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier vos disponibilités</Text>

      <Calendar
        events={events}
        height={600}
        mode="week"
        weekStartsOn={1} // Lundi
        onPressCell={handleDateClick}
        swipeEnabled={true}
        scrollOffsetMinutes={480} // Start view at 8am
        
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une disponibilité</Text>
            {selectedDate && (
              <Text style={styles.selectedDate}>
                {moment(selectedDate).locale('fr').format('dddd')}
              </Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Heure de début (ex: 09:00)"
              value={timeRange.start}
              onChangeText={(text) => setTimeRange({ ...timeRange, start: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Heure de fin (ex: 17:00)"
              value={timeRange.end}
              onChangeText={(text) => setTimeRange({ ...timeRange, end: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddAvailability}>
              <Text style={styles.buttonText}>Ajouter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmUpdate}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 },

  button: { backgroundColor: '#70FF70', padding: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { fontSize: 16, textAlign: 'center' },
  confirmButton: { backgroundColor: '#70FF70', padding: 12, borderRadius: 10, marginTop: 20 },
  selectedDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default ModifyAvailabilityScreen;
