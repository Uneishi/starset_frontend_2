import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import config from '../config.json';

const MetierListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { field } = route.params as any;

  const [metiers, setMetiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMetiersByField = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/filter-job-with-field`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: field.name }),
      });

      const data = await response.json();
      setMetiers(data.metiers || []);
    } catch (error) {
      console.error('Erreur récupération métiers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMetiersByField();
  }, []);

  const gotoJobView = (selectedJob: any) => {
    navigation.navigate({
      name: 'jobView',
      params: { selectedJob },
    } as never);
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{field.name.toUpperCase()}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#333" />
        ) : metiers.length === 0 ? (
          <Text style={styles.emptyText}>Aucun métier trouvé pour cette catégorie.</Text>
        ) : (
          metiers.map((metier: any, index: number) => (
            <TouchableOpacity key={index} style={styles.jobCard} onPress={() => gotoJobView(metier)}>
              <Image
                source={{
                  uri: metier.picture_url || 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
                }}
                style={styles.jobImage}
              />
              <Text style={styles.jobTitle}>{metier.name.toUpperCase()}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default MetierListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
    elevation: 4,
  },

  backButton: {
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  content: {
    padding: 20,
  },

  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  jobImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
    backgroundColor: '#DDD',
  },

  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});
