import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CertificationFormModalProps {
  visible: boolean;
  onClose: () => void;
  isEditMode: boolean;
  item: any;
  showCalendar: boolean;
  onChange: (updatedItem: any) => void;
  onAddImage: () => void;
  onSubmit: () => void;
  onToggleCalendar: () => void;
  onDateSelect: (date: string) => void;
}

const CertificationFormModal: React.FC<CertificationFormModalProps> = ({
  visible,
  onClose,
  isEditMode,
  item,
  showCalendar,
  onChange,
  onAddImage,
  onSubmit,
  onToggleCalendar,
  onDateSelect,
}) => {
  const markedDates = item?.date
    ? {
        [moment(item.date, 'DD/MM/YYYY').format('YYYY-MM-DD')]: {
          selected: true,
          selectedColor: '#00cc66',
        },
      }
    : {};

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Close Icon */}
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <MaterialIcons name="close" size={24} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {isEditMode ? 'Modifier Certification' : 'Ajouter Certification'}
          </Text>

          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={item?.title || ''}
            onChangeText={(text) => onChange({ ...item, title: text })}
          />

          <Text style={styles.label}>Institution</Text>
          <TextInput
            style={styles.input}
            placeholder="Institution"
            value={item?.institution || ''}
            onChangeText={(text) => onChange({ ...item, institution: text })}
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={onToggleCalendar}>
            <Text style={styles.input}>
              {item?.date || 'Sélectionnez une date'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Description"
            multiline
            value={item?.description || ''}
            onChangeText={(text) => onChange({ ...item, description: text })}
          />

          <Text style={styles.label}>Photos (max 3)</Text>
          <View style={styles.imageRow}>
            {item?.images?.map((img: string, idx: number) => (
              <Image key={idx} source={{ uri: img }} style={styles.image} />
            ))}
            {item?.images?.length < 3 && (
              <TouchableOpacity style={styles.imagePicker} onPress={onAddImage}>
                <FontAwesome name="plus" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>
              {isEditMode ? 'Mettre à jour' : 'Valider'}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <Calendar
              onDayPress={(day) =>
                onDateSelect(moment(day.dateString).format('DD/MM/YYYY'))
              }
              markedDates={markedDates}
              style={styles.calendar}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
    marginTop: 5,
  },
  imageRow: {
    flexDirection: 'row',
    marginVertical: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePicker: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendar: {
    marginTop: 20,
  },
});

export default CertificationFormModal;
