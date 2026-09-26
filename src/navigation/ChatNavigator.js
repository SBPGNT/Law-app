import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AwaitingReviewScreen from '../screens/chat/AwaitingReviewScreen';
import ChatBoxScreen from '../screens/chat/ChatBoxScreen';
import ConsultScreen from '../screens/chat/ConsultScreen';
import ConsultChatScreen from '../screens/chat/ConsultChatScreen';

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Consult" component={ConsultScreen} />
      <Stack.Screen name="AwaitingReview" component={AwaitingReviewScreen} />
      <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
      <Stack.Screen name="ConsultChat" component={ConsultChatScreen} />
    </Stack.Navigator>
  );
}
