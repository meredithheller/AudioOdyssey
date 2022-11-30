import { createStackNavigator } from '@react-navigation/stack';
import PlanTripPage from './PlanTripPage';
import SelectPodcastsPage from './SelectPodcastsPage';

const Stack = createStackNavigator();

export default function TripStackNavigator({ navigation, route }) {
  return (
    <Stack.Navigator 
        initialRouteName="Plan Trip" 
        screenOptions={{
            headerShown: false
      }}>
      <Stack.Screen 
        name="Plan Trip" 
        component={PlanTripPage} />
      <Stack.Screen 
        name="Select Podcasts" 
        component={SelectPodcastsPage} />
    </Stack.Navigator>
  );
}