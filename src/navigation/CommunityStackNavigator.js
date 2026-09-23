import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityScreen from '../screens/community/CommunityScreen';
import PostDetailScreen from '../screens/community/PostDetailScreen';
import CreatePostScreen from '../screens/community/CreatePostScreen';

const Stack = createNativeStackNavigator();

export default function CommunityStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1E3A8A' }, headerTintColor: '#FFF' }}>
      <Stack.Screen name="CommunityMain" component={CommunityScreen} options={{ title: 'ชุมชนถาม-ตอบกฎหมาย' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'รายละเอียดโพสต์' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'ตั้งกระทู้ใหม่' }} />
    </Stack.Navigator>
  );
}