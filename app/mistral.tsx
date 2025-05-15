import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const MyJobs = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>MY JOBS</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>Rechercher</Text>
          <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
        </View>
      </View>

      {/* Mission Requests */}
      <View style={styles.missionsContainer}>
        <Text style={styles.missionsText}>Demande de missions : 1</Text>
      </View>

      {/* Job Categories */}
      <View style={styles.jobCategories}>
        {/* Babysitting */}
        <TouchableOpacity style={styles.jobItem}>
          <Image
            source={{ uri: 'https://example.com/babysitting-icon.png' }}
            style={styles.jobIcon}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Babysitting</Text>
            <Text style={styles.jobSubtitle}>12 Missions effectuées</Text>
            <Text style={styles.jobSubtitle}>3 Multimédia</Text>
            <Text style={styles.jobSubtitleRed}>0 Demandes missions</Text>
          </View>
          <FontAwesome name="check" size={20} color="green" style={styles.checkmark} />
        </TouchableOpacity>

        {/* Courrier */}
        <TouchableOpacity style={styles.jobItem}>
          <Image
            source={{ uri: 'https://example.com/coursier-icon.png' }}
            style={styles.jobIcon}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Coursier</Text>
            <Text style={styles.jobSubtitle}>12 Missions effectuées</Text>
            <Text style={styles.jobSubtitle}>14 Multimédia</Text>
            <Text style={styles.jobSubtitleRed}>1 Demandes missions</Text>
          </View>
          <FontAwesome name="check" size={20} color="green" style={styles.checkmark} />
        </TouchableOpacity>

        {/* Ménage */}
        <TouchableOpacity style={styles.jobItem}>
          <Image
            source={{ uri: 'https://example.com/menage-icon.png' }}
            style={styles.jobIcon}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Ménage</Text>
            <Text style={styles.jobSubtitle}>12 Missions effectuées</Text>
            <Text style={styles.jobSubtitle}>5 Multimédia</Text>
            <Text style={styles.jobSubtitleRed}>0 Demandes missions</Text>
          </View>
          <FontAwesome name="check" size={20} color="green" style={styles.checkmark} />
        </TouchableOpacity>

        {/* Coiffure */}
        <TouchableOpacity style={styles.jobItem}>
          <Image
            source={{ uri: 'https://example.com/coiffure-icon.png' }}
            style={styles.jobIcon}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Coiffure</Text>
            <Text style={styles.jobSubtitle}>12 Missions effectuées</Text>
            <Text style={styles.jobSubtitle}>5 Multimédia</Text>
          </View>
          <FontAwesome name="check" size={20} color="green" style={styles.checkmark} />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Ionicons name="document" size={24} color="black" style={styles.navIcon} />
        <Ionicons name="add" size={24} color="black" style={styles.navIcon} />
        <Ionicons name="mail" size={24} color="black" style={styles.navIcon} />
        <Ionicons name="chatbubble" size={24} color="black" style={styles.navIcon} />
        <Ionicons name="person" size={24} color="black" style={styles.navIcon} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#888',
  },
  searchIcon: {
    marginLeft: 10,
  },
  missionsContainer: {
    padding: 20,
    backgroundColor: '#e0ffe0',
  },
  missionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
  jobCategories: {
    padding: 20,
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  jobIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  jobSubtitleRed: {
    fontSize: 14,
    color: 'red',
  },
  checkmark: {
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  navIcon: {
    padding: 10,
  },
});

export default MyJobs;
