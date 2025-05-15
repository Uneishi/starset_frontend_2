import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const historyData = {
  Février: [
    { day: 12, title: 'Babysitting', hours: '12h00 — 18h00', price: '20,00 €', status: 'pending' },
    { day: 16, title: 'Ménage', hours: '11h00 — 13h00', price: '5,00 €', status: 'pending' }
  ],
  Janvier: [
    { day: 16, title: 'Manucure', hours: '12h00 — 18h00', price: '35,00 €', status: 'done' },
    { day: 16, title: 'Manucure', hours: '12h00 — 18h00', price: '35,00 €', status: 'done' },
    { day: 16, title: 'Manucure', hours: '12h00 — 18h00', price: '35,00 €', status: 'done' }
  ]
};

const HistoryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>HISTORIQUE</Text>
      {Object.entries(historyData).map(([month, items], idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.month}>{month}</Text>
          {items.map((item, i) => (
            <View key={i} style={styles.row}>
              <View style={styles.dateIcon}>
                <Text style={styles.dateDay}>{item.day}</Text>
                <Text style={styles.dateMonth}>16</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.hours}>{item.hours}</Text>
              </View>
              <View style={styles.right}>
                <Text
                  style={[
                    styles.price,
                    item.status === 'done' ? styles.priceRed : styles.priceGreen
                  ]}
                >
                  {item.price}
                </Text>
                {item.status === 'done' ? (
                  <View style={styles.statusDone}>
                    <Text style={styles.statusDoneText}>Terminé</Text>
                  </View>
                ) : (
                  <View style={styles.circle} />
                )}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10
  },
  section: {
    marginTop: 20
  },
  month: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  dateIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f00',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  dateDay: {
    color: 'white',
    fontWeight: 'bold'
  },
  dateMonth: {
    color: 'white',
    fontSize: 10
  },
  details: {
    flex: 1
  },
  title: {
    fontSize: 14,
    fontWeight: '600'
  },
  hours: {
    fontSize: 12,
    color: '#666'
  },
  right: {
    alignItems: 'flex-end'
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  priceGreen: {
    color: '#0a0'
  },
  priceRed: {
    color: '#f00'
  },
  statusDone: {
    backgroundColor: '#f00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  statusDoneText: {
    color: '#fff',
    fontSize: 12
  },
  circle: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#0a0',
    borderRadius: 9
  }
});

export default HistoryScreen;
