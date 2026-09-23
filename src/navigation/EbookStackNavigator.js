import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EbookScreen from '../screens/ebook/EbookScreen';
import EbookDetailScreen from '../screens/ebook/EbookDetailScreen';
import FavoriteScreen from '../screens/ebook/FavoriteScreen';

const Stack = createNativeStackNavigator();

export default function EbookStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1E3A8A' }, headerTintColor: '#FFF' }}>
      <Stack.Screen name="EbookMain" component={EbookScreen} options={{ title: 'คลังหนังสือ E-Book' }} />
      <Stack.Screen name="EbookDetail" component={EbookDetailScreen} options={{ title: 'รายละเอียดหนังสือ' }} />
      <Stack.Screen name="Favorite" component={FavoriteScreen} options={{ title: 'รายการโปรดของฉัน' }} />
    </Stack.Navigator>
  );
}