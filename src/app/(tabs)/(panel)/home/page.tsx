import colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
// import { FAB } from 'react-native-paper'; // Componente FAB (Floating Action Button)


export default function Home() {
  interface Transaction {
    id: string;
    name: string;
    description: string;
    amount: number;
  }

  const transactions: Transaction[] = [
    { id: '1', name: 'Netflix', description: 'Month subscription', amount: 12 },
    { id: '2', name: 'Paypal', description: 'Tax', amount: 10 },
    { id: '3', name: 'Paylater', description: 'Buy item', amount: 2 },
    { id: '4', name: 'Netflix', description: 'Month subscription', amount: 12 },
    { id: '5', name: 'Paypal', description: 'Tax', amount: 10 },
    { id: '6', name: 'Paylater', description: 'Buy item', amount: 2 },
  ];


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Janeiro</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balance}>R$5.034,12</Text>
      </View>

      <View style={styles.incomeExpenseContainer}>
        <View style={styles.incomeContainer}>
          <Text style={styles.incomeText}>Receitas</Text>
          <Text style={styles.incomeValue}>R$ 0,00</Text>
        </View>
        <View style={styles.expenseContainer}>
          <Text style={styles.expenseText}>Despesas</Text>
          <Text style={styles.expenseValue}>R$ 0,00</Text>
        </View>
      </View>

      <View style={styles.transactionsList}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionIcon} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{item.name}</Text>
                <Text style={styles.transactionDescription}>{item.description}</Text>
              </View>
              <Text style={styles.transactionAmount}>${item.amount}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* <FAB
        style={styles.fab}
        icon="plus"  // Ícone do botão
        onPress={() => console.log('Botão flutuante pressionado!')}
      /> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: colors.zinc,
  },
  header: {
    paddingLeft: 14,
    paddingRight: 14,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
    alignSelf: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  incomeContainer: {},
  incomeText: {
    fontSize: 16,
    color: colors.white,
  },
  incomeValue: {
    fontSize: 16,
    color: 'green',
  },
  expenseContainer: {},
  expenseText: {
    fontSize: 16,
    color: colors.white,
  },
  expenseValue: {
    fontSize: 16,
    color: 'red',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd', // Placeholder icon background
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
  },
  transactionsList: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 24,
    paddingLeft: 14,
    paddingRight: 14,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 15,
    marginBottom: 8,
  }
});