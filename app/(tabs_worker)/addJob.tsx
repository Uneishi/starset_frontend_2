import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../../config.json';
import {  BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useFonts } from 'expo-font';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonLoader = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, SCREEN_WIDTH],
  });

  return (
    <View style={styles.jobCard}>
      <View style={styles.jobImage} />
      <View style={styles.skeletonTextWrapper}>
        <View style={styles.skeletonText} />
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const AddJobScreen = () => {
  const navigation = useNavigation();
  const [metierNames, setMetierNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
      BebasNeue: BebasNeue_400Regular,
      
    });

  const getAllMetierNames = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-metier-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMetierNames(data.metierNames);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des métiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const gotoJobView = (selectedJob: string) => {
    navigation.navigate({
      name: 'jobView',
      params: { selectedJob },
    } as never);
  };

  useEffect(() => {
    getAllMetierNames();
  }, []);

  const filteredMetiers = metierNames.filter((metier: any) =>
    metier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ADD A JOB</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher"
        placeholderTextColor="#808080"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading
        ? Array.from({ length: 6 }).map((_, index) => <SkeletonLoader key={index} />)
        : filteredMetiers.map((metier: any, index) => (
            <TouchableOpacity
              key={index}
              style={styles.jobCard}
              onPress={() => gotoJobView(metier)}
            >
              <Image
                source={{
                  uri: metier.picture_url
                    ? metier.picture_url
                    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
                }}
                style={styles.jobImage}
              />
              <Text style={styles.jobTitle}>{metier.name.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  jobImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 25,
    backgroundColor: '#DDD',
  },
  jobTitle: {
    fontSize: 18,
    fontFamily : 'BebasNeue',
    flexShrink: 1,
  },
  skeletonTextWrapper: {
    flex: 1,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#DDD',
    overflow: 'hidden',
  },
  skeletonText: {
    width: '100%',
    height: '100%',
    backgroundColor: '#DDD',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});

export default AddJobScreen;
