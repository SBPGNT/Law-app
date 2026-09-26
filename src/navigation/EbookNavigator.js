import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EbookDetailScreen from '../screens/ebook/EbookDetailScreen';
import EbookListScreen from '../screens/ebook/EbookListScreen';
import PdfViewerScreen from '../screens/ebook/PdfViewerScreen';

const Stack = createNativeStackNavigator();

export default function EbookNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EbookList" component={EbookListScreen} />
      <Stack.Screen name="EbookDetail" component={EbookDetailScreen} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
    </Stack.Navigator>
  );
}