import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';


export default function CustomTabBar({ state, descriptors, navigation }) {

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              style={styles.buttonTab}
            >
              <View style={{ alignItems: 'center', padding: 4 }}>
                <View style={[styles.innerButton, { backgroundColor: isFocused ? colors.gray : "transparent", }]}>
                  <Ionicons
                    name={options.tabBarIcon}
                    size={34}
                    color={isFocused ? colors.zinc : colors.gray}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    gap: 20,
    elevation: 10,
    borderRadius: 99,
  },
  buttonTab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    padding: 8,
    borderRadius: 99,
  }
});