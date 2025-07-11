// components/ExperienceModal.tsx
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React from 'react';
import { Alert, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  visible: boolean;
  onClose: () => void;
  isEditMode: boolean;
  item: any;
  showCalendar: boolean;
  onChange: (updatedItem: any) => void;
  onAddImage: () => void;
  onSubmit: () => void;
  onToggleCalendar: () => void;
};

const ExperienceModal = ({
  visible,
  onClose,
  isEditMode,
  item,
  showCalendar,
  onChange,
  onAddImage,
  onSubmit,
  onToggleCalendar,
}: Props) => {
  const [itemDraft, setItemDraft] = React.useState(item || {});

  React.useEffect(() => {
    if (visible) {
      setItemDraft(item || {});
    }
  }, [visible, item]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...itemDraft, [field]: value };
    setItemDraft(updated);
    onChange(updated);
  };

  const handleDeleteImage = (index: number) => {
    Alert.alert(
      "Supprimer l'image",
      "Êtes-vous sûr de vouloir supprimer cette image ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedImages = [...(itemDraft.images || [])];
            updatedImages.splice(index, 1);
            handleChange('images', updatedImages);
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { width: '90%' }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            {isEditMode ? 'Modifier une expérience' : 'Nouvelle expérience'}
          </Text>

          <Text style={styles.inputLabel}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={itemDraft.title || ''}
            onChangeText={(text) => handleChange('title', text)}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity onPress={onToggleCalendar}>
            <Text style={[styles.input, { color: itemDraft.date ? 'black' : '#999' }]}>
              {itemDraft.date || 'Sélectionnez une date'}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <DateTimePicker
              value={
                itemDraft.date && !isNaN(new Date(itemDraft.date).getTime())
                  ? new Date(itemDraft.date)
                  : new Date()
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const dateString = selectedDate.toISOString().split('T')[0].replace(/-/g, '/');
                  handleChange('date', moment(selectedDate).format('DD/MM/YYYY'));
                }
                onToggleCalendar(); // Fermer après sélection
              }}
            />
          )}

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description"
            multiline
            value={itemDraft.description || ''}
            onChangeText={(text) => handleChange('description', text)}
          />

          <Text style={styles.inputLabel}>Images (max 3)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {(itemDraft.images || []).map((img: string, index: number) => (
            <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteImage(index)}>
                <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
            ))}
            {(itemDraft.images?.length || 0) < 3 && (
              <TouchableOpacity style={styles.imageAddButton} onPress={onAddImage}>
                <FontAwesome name="plus" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>
              {isEditMode ? 'Modifier' : 'Valider'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ExperienceModal;

// Styles identiques
const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  closeIcon: { position: 'absolute', top: 10, right: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
  descriptionInput: { height: 100, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
  imagePreview: { width: 80, height: 80, borderRadius: 6, marginRight: 10 },
  imageAddButton: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  submitButton: { backgroundColor: '#00cc66', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#999', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },

  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  
  deleteIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
    zIndex: 1,
  },
});
