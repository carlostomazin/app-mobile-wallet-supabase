import colors from '@/constants/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';


export default function Home() {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} >
          <AntDesign name="leftcircleo" size={30} color={colors.white} />
        </Pressable>
        <Text style={styles.headerText}>Nova receita</Text>
      </View>

      <View style={styles.headerValue}>
        <Text style={styles.titleText}>Valor da receita</Text>
        <View style={{ flexDirection: 'row'}}>
          <Text style={styles.valueText}>R$ </Text>
          <TextInput
            style={styles.valueText}
            placeholder="0,00"
            placeholderTextColor={colors.white}
            keyboardType='numeric'
          />
        </View>

      </View>

      <View style={styles.body}>
        <View style={{ margin: 25, gap: 30}}>

          <View style={styles.itemGrid}>
            <Entypo name="text" size={25} color={colors.gray} />
            <TextInput
              placeholder="Descrição"
              placeholderTextColor={colors.gray}
              style={styles.input}
            />
          </View>

          <View style={styles.itemGrid}>
            <Fontisto name="date" size={25} color={colors.gray} />
            <TextInput
              placeholder="Data"
              placeholderTextColor={colors.gray}
              style={styles.input}
            />
          </View>

        </View>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.zinc,
  },
  header: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 20,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  headerValue: {
    marginTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  titleText: {
    color: colors.white,
    fontSize: 15,
  },
  valueText: {
    color: colors.white,
    fontSize: 40,
  },
  itemGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 15,
    paddingBottom: 10
  },
  input: {
    flex: 1,
    fontSize: 23,
  }
});