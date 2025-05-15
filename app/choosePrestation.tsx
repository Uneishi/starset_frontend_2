import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import config from '../config.json'; // Assure-toi que le chemin est bon

const ChoosePrestationScreen = () => {
  const route = useRoute();
  const { prestation_id } = route.params as { prestation_id: number };
  const [customPrestations, setCustomPrestations] = useState([]);

  useEffect(() => {
    getCustomPrestations();
  }, []);

  const getCustomPrestations = async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/prestation/get-all-custom-prestation-by-prestation-id`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prestation_id }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setCustomPrestations(data.custom_prestations);
    } catch (error) {
      console.error('Erreur chargement prestations personnalisées:', error);
    }
  };

  const handleSelect = (item: any) => {
    console.log('Selected prestation:', item.title);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
      <Image
        source={{
          uri:
            'https://radiodisneyclub.fr/wp-content/uploads/2016/02/1CD_4872.jpg',
        }}
        style={styles.thumbnail}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <FontAwesome name="arrow-circle-right" size={20} color="green" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MES PRESTATIONS</Text>
      <FlatList
        data={customPrestations}
        renderItem={renderItem}
        keyExtractor={(item : any) => item?.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Aucune prestation personnalisée trouvée.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
  },
});

export default ChoosePrestationScreen;
