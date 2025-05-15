import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JobsScreen from './jobs';
import ConversationScreen from './conversation';
import AccountWorkerScreen from './account_worker';
import CroissanceScreen from './croissance';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import AddJobScreen from './addJob';
import { Image } from 'react-native';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string; }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabNavigator() {
  const [isPopupVisible, setPopupVisible] = useState(false);
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    
    const goToUserTabs = async () => {
      navigation.navigate('(tabs)' as never);
    };
  
    const goToWorkerTabs = async () => {
      navigation.navigate('(tabs_worker)' as never);
    };


  return (
    <>
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00A65A',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="croissance"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/croissance_icone.png')}
              style={{ width: 28, height: 28, tintColor: color }}
              resizeMode="contain"
            />
          )
        }}
      />
      <Tabs.Screen
        name="jobs"
        
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tableau.png')}
              style={{ width: 28, height: 28, tintColor: color }}
              resizeMode="contain"
            />
          )
        }}
      />
      <Tabs.Screen
  name="addJob"
  options={{
    title: '',
    tabBarIcon: ({ color }) => (
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FFF',
        borderColor: color,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FontAwesome name="plus" size={18} color={color} />
      </View>
    ),
  }}
/>
      <Tabs.Screen
        name="conversation"
        
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="envelope-o" color={color} />,
        }}
      />
      <Tabs.Screen
  name="account_worker"
  options={{
    title: '',
    tabBarButton: (props: any) => {
      const CustomTabBarButton = React.forwardRef<any, any>((innerProps, ref) => (
        <Pressable
          ref={ref}
          {...innerProps}
          onLongPress={() => {
            setPopupVisible(true);
            console.log(123);
            console.log(isPopupVisible);
          }}
          onPress={innerProps.onPress}
          style={innerProps.style}
        >
          <Ionicons
            name="person"
            size={28}
            color={
              innerProps.accessibilityState?.selected
                ? Colors[colorScheme ?? 'light'].tint
                : 'gray'
            }
          />
        </Pressable>
      ));
    
      return <CustomTabBarButton {...props} />;
    },
    
    
  }}
/>   
    </Tabs>
    <Modal
      animationType="slide"
      transparent
      visible={isPopupVisible}
      onRequestClose={() => setPopupVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        <Pressable onPress={goToUserTabs} style={styles.widthMax}>
            <View style={[styles.changeContainer, styles.userContainer]}>
              <FontAwesome5 name="user-circle" size={26} color="black" style={styles.leftIcon} />
              <Text style={styles.modalText}>USER</Text> 
            </View>
          </Pressable>

          <Pressable onPress={goToWorkerTabs} style={styles.widthMax}>
            <View style={[styles.changeContainer, styles.workerContainer]}>
              <FontAwesome5 name="hard-hat" size={24} color="white" style={styles.leftIcon} />
              <Text style={styles.modalText}>WORKER</Text> 
            </View>
          </Pressable>
          <Pressable onPress={() => setPopupVisible(false)}>
            <Text style={styles.closeButton}>Fermer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    width : '100%'
  },

  modalText: {
    fontSize: 24,
    
    margin: 12,
    fontFamily: 'BebasNeue',
    color : 'white'
  },

  closeButton: {
    marginTop : 10,
    fontSize: 16,
    color: 'blue',
    fontWeight : 'bold'
  },

  changeContainer : {
    
    margin: 5,
    marginHorizontal : 20,
    alignItems : "center",
    justifyContent : "center",
    borderRadius : 20,
    width : '100%',
    
  },

  userContainer : {
    backgroundColor : 'gold'//'#F2C700'
  },

  workerContainer : {
    backgroundColor : '#00A65A'
  },

  widthMax : {
    width : '100%',
    
    justifyContent : 'center',
    alignItems : 'center'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  icon: {
    marginRight: 10,
  },

  leftIcon: {
    position: 'absolute',
    left: 20, // ou un autre padding si besoin
  },

});