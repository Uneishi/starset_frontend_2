import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../../config.json';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CategorySkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={styles.categoryCard}>
      <View style={styles.categoryImageSkeleton}>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            { transform: [{ translateX }] }
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
  const [fields, setFields] = useState([]); // catégories
  const [selectedField, setSelectedField] = useState(null);
  let [fontsLoaded] = useFonts({
      BebasNeue: BebasNeue_400Regular,
  });

  const getMetiersByField = async (fieldName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/filter-job-with-field`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: fieldName }),
      });

      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();
      setMetierNames(data.metiers);
    } catch (error) {
      console.error('Erreur lors de la récupération des métiers filtrés :', error);
    } finally {
      setLoading(false);
    }
  };

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
      if(data) setMetierNames(data.metierNames);
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

  const goToMetierList = (field: string) => {
    navigation.navigate({
      name: 'metierList',
      params: { field },
    } as never);
  };

  const fetchFields = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if(data) setFields(data.fields);
    } catch (error) {
      console.error('Erreur récupération catégories :', error);
    }
  };

  useEffect(() => {
    getAllMetierNames();
    fetchFields();
  }, []);

  const filteredMetiers = metierNames.filter((metier: any) =>
    metier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ADD A JOB</Text>

      

      {selectedField === null ? (
        <>
          
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <CategorySkeleton key={index} />)
          ) : (
            fields.map((field: any, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => {
                  
                  goToMetierList(field); // ⚠️ Appel au nouvel endpoint
                }}
              >
                <Image source={{ uri: field.picture_url }} style={styles.categoryImage} />
                <View style={styles.overlay}>
                  <Text style={styles.categoryText}>{field.name.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </>
      ) : loading ? (
        Array.from({ length: 6 }).map((_, index) => <CategorySkeleton key={index} />)
      ) : (
        filteredMetiers.map((metier: any, index) => (
          <TouchableOpacity
            key={index}
            style={styles.jobCard}
            onPress={() => gotoJobView(metier)}
          >
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
      <View style={{height: 50}}></View>
    </ScrollView>

    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom : 40
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
    fontSize: 24,
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
  
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },

  categoryImageSkeleton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  
  categoryCard: {
    height: 130,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
});

export default AddJobScreen;
