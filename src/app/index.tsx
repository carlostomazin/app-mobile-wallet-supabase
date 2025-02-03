import colors from '@/constants/colors';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function Index() {

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});