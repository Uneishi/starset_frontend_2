import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../config.json';
import { useUser } from '@/context/userContext';

const CroissanceScreen = () => {
  const [jobsOfTheDay, setJobsOfTheDay] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Utilisation du contexte pour récupérer les infos utilisateur

  const news = {
    title: 'Big Announcement',
    date: 'September 22, 2024',
    description:
      'We are excited to introduce new features to our platform that will make your job search easier and more efficient!',
  };

  const fetchJobsOfTheDay = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-job-of-the-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();
      setJobsOfTheDay([...data.metiers, ...data.metiers]); // doublage temporaire
    } catch (error) {
      console.error('Erreur lors de la récupération des jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsOfTheDay();
  }, []);

  const workersMock = [
    'https://img.20mn.fr/wb0GX0XqSd2N4Y3ItfLEGik/1444x920_squeezie-youtubeur-chanteur-et-desormais-auteur-de-bd',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwwXfPD8d-KenzH6diGi3tKJu9liPKonRhgw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZEnI6ULp75xTWZpfj0mTHaebwUDaiE0OBA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicKbK7hKK2PMZLyJBtbec1a1vMTGwV0GTOg&s',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.croissanceContainer}>
        <Image
          source={{ uri: 'http://109.176.199.54/images/icon/croissance_header.png' }}
          style={styles.croissance}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/864/864685.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.statText}>TOP JOB</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.completed_prestation}</Text>
          <Text style={styles.statText}>Missions accomplies</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2%</Text>
          <Text style={styles.statText}>Activité</Text>
        </View>
      </View>

      <Text style={[styles.sectionHeader, { marginTop: 40 }]}>WORKERS OF THE DAY</Text>
<FlatList
  horizontal
  data={[...workersMock, ...workersMock]}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.workerWrapper}>
      <Image source={{ uri: item }} style={styles.workerImage} />
      <View style={styles.badge}>
        <FontAwesome name="check" size={12} color="#fff" />
      </View>
    </View>
  )}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingRight: 20 }}
/>

<Text style={[styles.sectionHeader, { marginTop: 30 }]}>JOBS OF THE DAY</Text>
<FlatList
  horizontal
  data={jobsOfTheDay}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.jobItem}>
      <Image
        source={{
          uri: item.picture_url || 'https://cdn-icons-png.flaticon.com/512/91/91501.png',
        }}
        style={styles.jobIcon}
      />
      <Text style={styles.jobText}>{item.name}</Text>
    </View>
  )}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingRight: 20 }}
/>

<Text style={[styles.sectionHeader, { marginTop: 30 }]}>CES JOBS QUI ONT BESOIN DE VOUS</Text>
<FlatList
  horizontal
  data={[
    { name: 'DEV WEB', icon: 'https://cdn-icons-png.flaticon.com/512/4703/4703487.png' },
    { name: 'LECTURE', icon: 'https://cdn-icons-png.flaticon.com/512/864/864685.png' },
    { name: 'CHAUFFEUR', icon: 'https://cdn-icons-png.flaticon.com/512/846/846338.png' },
    { name: 'TRADUCTEUR', icon: 'https://cdn-icons-png.flaticon.com/512/2793/2793765.png' },
  ]}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.jobItem}>
      <Image source={{ uri: item.icon }} style={styles.jobIcon} />
      <Text style={styles.jobText}>{item.name}</Text>
    </View>
  )}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingRight: 20 }}
/>

      <Text style={[styles.sectionHeader, {textAlign : 'left'}]}>STARSET NEWS</Text>
      <View style={styles.newsCard}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle}>
            {news.title} <FontAwesome name="smile-o" size={20} />
          </Text>
          <Text style={styles.newsDate}>{news.date}</Text>
        </View>
        <Text style={styles.newsDescription}>{news.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  croissance: {
    resizeMode: 'contain',
    height: 80,
    marginBottom: 30,
    width: '80%',
  },
  croissanceContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  statText: {
    fontSize: 14,
    color: '#000',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    width: 35,
    height: 35,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    marginTop : 20,
    textAlign : 'center'
  },
  
  workerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  
  jobsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  jobItem: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#E3E3E3',
    borderRadius: 6,
    padding: 10,
    paddingHorizontal: 10,
    width: 90,
  },
  jobIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  jobText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
  },

  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 4,
    zIndex: 2,
  },
  workerWrapper: {
    marginRight: 15,
    position: 'relative',
    paddingBottom: 5, // évite que le badge dépasse du FlatList
  },
});

export default CroissanceScreen;
