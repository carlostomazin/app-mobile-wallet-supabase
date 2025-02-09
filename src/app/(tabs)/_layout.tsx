import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';
import { Button, TouchableOpacity, View } from 'react-native';

function ButtonTab() {
  return (
    <View>
      <Button title="Clique aqui" onPress={() => alert("Botão pressionado!")} />
    </View>
  );
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home/page"
        options={{
          tabBarIcon: 'home',
        }}
      />

      <Tabs.Screen
        name="transacao/page"
        options={{
          tabBarIcon: 'add',
        }}
      />

      <Tabs.Screen
        name="profile/page"
        options={{
          tabBarIcon: 'person',
        }}
      />
    </Tabs>
  );
}