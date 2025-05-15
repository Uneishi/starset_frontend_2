import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, GestureResponderEvent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { StyleSheet, TextStyle, Image } from 'react-native';
import config from '../config.json';
import { useUser } from '@/context/userContext';



const SummaryScreen = () => {
  const [isSelected, setSelection] = React.useState(false);
  const {user , setUser} = useUser()
  const [addressParts, setAddressParts] = useState({ street: 'N/A', city: 'N/A', country: 'N/A' });


  const route = useRoute() as any;
  route.params
  console.log('ICI')
  console.log(route.params)

  const navigation = useNavigation();
  
  const { startDate, endDate, arrivalTime, departureTime, prestation, profilePictureUrl,totalRemuneration } = route.params;
  console.log("route.params")
  console.log(route.params)
  console.log(arrivalTime)
  console.log(departureTime)
  

  let formattedStartDate = 'N/A';
  let formattedEndDate = 'N/A';
  let formattedStartTime = 'N/A';
  let formattedEndTime = 'N/A';

  if (startDate && endDate) {
    formattedStartDate = new Date(startDate).toLocaleDateString();
    formattedEndDate = new Date(endDate).toLocaleDateString();
    formattedStartTime = new Date(arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    formattedEndTime = new Date(departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    console.log(formattedStartDate);
    console.log(formattedEndDate);
    console.log(formattedStartTime);
    console.log(formattedEndTime);
  } else {
    console.log('startDate or endDate is null or undefined');
  }

  useEffect(() => {
      const { street, city, country } = extractAddressParts(user?.address);
      setAddressParts({ street, city, country });
  }, []);

  
const extractAddressParts = (address : any) => {
  console.log("123456789")

  const parts = address.split(',');
  
  if (parts.length < 3) return { street: 'N/A', city: 'N/A', postalCode: 'N/A' };
  
  const street = parts[0]?.trim() || 'N/A';
  const city = parts[1]?.trim() || 'N/A';
  const country = parts[2]?.trim() || 'N/A';
  console.log(street)
  return { street, city, country };
};
  

  

  const nextStep = () => {
    
    navigation.navigate({
      name: 'payment',
      params: { startDate :startDate,endDate : endDate,  arrivalTime : arrivalTime, departureTime : departureTime, prestation :prestation, profilePictureUrl : profilePictureUrl,totalRemuneration : totalRemuneration },
    } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>RÉCAPITULATIF</Text>
      
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profilePictureUrl }} // Replace with the actual profile picture URL
          style={styles.profilePicture}
        />
      </View>
      <View style={{
            width : '100%',
            height : 50,
            
      }}></View>

      <View style={styles.infoContainer}>
        <View style={styles.daterow}>
          <View style={styles.date}>
            <Text style={styles.infoText}>{formattedStartDate}</Text>
          </View>
          
          <Text style={styles.infoText}>➔</Text>
          <View style={styles.date}>
            <Text style={styles.infoText}>{formattedEndDate}</Text>
          </View>
        </View>

        <View style={styles.daterow}>
          <View style={styles.date}>
            <Text style={styles.infoText}>{formattedStartTime}</Text>
          </View>
          
          <Text style={styles.infoText}>➔</Text>
          <View style={styles.date}>
            <Text style={styles.infoText}>{formattedEndTime}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.case}>
            <Text style={styles.infoText}>{addressParts?.street}</Text>
          </View>
          <View style={styles.case}>
            <Text style={styles.infoText}>{addressParts?.city}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.date}>
            <Text style={styles.infoText}>{addressParts?.country}</Text>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Ajouter une instruction ou information primordiale"
      />

      <View style={styles.totalpurchase}>
        <Text style={styles.totalText}>Total achat:</Text>
        <Text style={styles.totalText}>{totalRemuneration}</Text>
      </View>
      

      <TouchableOpacity style={styles.button}  onPress={nextStep}>
        <Text style={styles.buttonText}>Étape suivante</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  profileContainer: {
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  step: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 24,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginVertical: 5,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    fontSize: 16,
    color: '#000',
  },
  totalText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  daterow : {
    width : '100%',
    
    flexDirection : 'row',
    justifyContent: 'space-between'
  },

  row : {
    width : '100%',
    
    flexDirection : 'row',
    justifyContent: 'flex-start'
  },

  date : {
    width : 150,
    margin : 3,
    padding : 5,
    backgroundColor:  '#D3D3D3',
    borderRadius : 10
  },

  case : {
    
    margin : 3,
    padding : 5,
    paddingHorizontal: 15,
    backgroundColor:  '#D3D3D3',
    borderRadius : 10
  },

  totalpurchase : {
    width : "100%",
    flexDirection : "row",
    margin : 10,
    padding : 10,
    justifyContent : 'space-between',
    fontSize : 200
  },

  purchasetext : {

  }
});

export default SummaryScreen;