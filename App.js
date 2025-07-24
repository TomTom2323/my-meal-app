import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

export default function App() {
  const [meal, setMeal] = useState("");
  const [meals, setMeals] = useState([]);

  const addMeal = () => {
    if (meal.trim() === "") return;
    const newMeal = {
      id: Date.now().toString(),
      name: meal,
      timestamp: new Date().toLocaleString(),
    };
    setMeals([...meals, newMeal]);
    setMeal("");
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell, { flex: 3 }]}>食事内容</Text>
      <Text style={[styles.cell, styles.headerCell, { flex: 3 }]}>登録日時</Text>
      <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>操作</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 3 }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 3 }]}>{item.timestamp}</Text>
      <View style={[styles.cell, { flex: 1 }]}>
        <Button title="削除" color="red" onPress={() => deleteMeal(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>食事管理アプリ</Text>

      <TextInput
        style={styles.input}
        placeholder="食事内容を入力"
        value={meal}
        onChangeText={setMeal}
      />
      <Button title="登録" onPress={addMeal} />

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
  },
  cell: {
    paddingHorizontal: 8,
  },
  headerCell: {
    fontWeight: "bold",
  },
});
