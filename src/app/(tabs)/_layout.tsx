import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#121212',

        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#fff',
        }
      }}
      tabBar={ (props) => <CustomTabBar {...props} /> }
    >
      <Tabs.Screen
        name="(panel)/home/page"
        options={{
          tabBarIcon: 'home',
        }}
      />

      <Tabs.Screen
        name="(panel)/profile/page"
        options={{
          tabBarIcon: 'person',
        }}
      />
    </Tabs>
  );
}