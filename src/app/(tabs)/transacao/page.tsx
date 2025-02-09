import colors from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/src/utils/supabase';
import Routes from '@/constants/routes';


export default function Transacao() {

  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('despesa')
  const [isEnabled, setIsEnabled] = useState(false);
  const pathname = usePathname();

  function defaultValues() {
    setValue('');
    setDescription('');
    setDate('');
    setIsEnabled(false);
  }

  const toggleSwitch = (previousState: boolean) => {
    setIsEnabled(previousState => !previousState);
    setText(previousState ? "receita" : "despesa")
  }

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const formattedDate = selectedDate.toLocaleDateString('pt-BR');
      setDate(formattedDate);
    }
  };

  useEffect(() => {
    defaultValues()
  }, [pathname]);

  async function handleAddTransacao() {
    setLoading(true);

    const { data, error } = await supabase
      .from('transacoes')
      .insert([
        {
          descricao: description,
          data: date,
          valor: value,
          tipo: text,
        }
      ]);

    if (error) {
      Alert.alert('Erro', error.message);
      setLoading(false);
      return;
    }

    defaultValues()
    router.push(Routes.home)
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={isEnabled ? "trending-up" : "trending-down"} size={30} color={colors.white} />
        <Text style={styles.headerText}>Nova {text}</Text>

        <Switch
          trackColor={{ false: colors.white, true: colors.white }}
          thumbColor={isEnabled ? colors.green : colors.red}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{ flex: 1, marginRight: 20 }}
        />
      </View>

      <View style={styles.headerValue}>
        <Text style={styles.titleText}>Valor da {text}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.valueText}>R$ </Text>
          <TextInput
            style={styles.valueText}
            placeholder="0,00"
            placeholderTextColor={colors.white}
            keyboardType='numeric'
            value={value}
            onChangeText={setValue}
          />
        </View>
      </View>

      <View style={styles.body}>
        <View style={{ margin: 25, gap: 30 }}>

          <View style={styles.itemGrid}>
            <Entypo name="text" size={25} color={colors.gray} />
            <TextInput
              placeholder="Descrição"
              placeholderTextColor={colors.gray}
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.itemGrid}>
            <Fontisto name="date" size={25} color={colors.gray} />
            <Pressable
              style={[styles.input, { justifyContent: 'center' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontSize: 23, color: date ? '#000' : colors.gray }}>
                {date || 'Data'}
              </Text>
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              onChange={handleDateSelect}
            />
          )}

          <Pressable onPress={handleAddTransacao} style={{ alignItems: 'center' }}>
            <Ionicons
              name="checkmark-circle"
              size={70}
              color={loading ? colors.green : colors.zinc} />
          </Pressable>

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