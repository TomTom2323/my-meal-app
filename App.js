import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "./lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";


export default function App() {
  const [meal, setMeal] = useState("");
  const [meals, setMeals] = useState([]);

const addMeal = async () => {
  if (meal.trim() === "") {
    Alert.alert("入力エラー", "食事内容を入力してください");
    return;
  }

  try {
    await addDoc(collection(db, "meals"), {
      name: meal,
      timestamp: serverTimestamp(),
    });
    setMeal("");
  } catch (error) {
    console.error("追加エラー:", error);
    Alert.alert("追加エラー", "データの追加に失敗しました");
  }
};

const deleteMeal = async (id) => {
  try {
    await deleteDoc(doc(db, "meals", id));
  } catch (error) {
    console.error("削除エラー:", error);
    Alert.alert("削除エラー", "データの削除に失敗しました");
  }
};

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "meals"),
    (snapshot) => {
      const fetchedMeals = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        timestamp: doc.data().timestamp
          ? new Date(doc.data().timestamp.seconds * 1000).toLocaleString()
          : "未登録",
      }));
      setMeals(fetchedMeals);
    },
    (error) => {
      console.error("読み込みエラー:", error);
      Alert.alert("読み込みエラー", "データの取得に失敗しました");
    }
  );

  return () => unsubscribe();
}, []);

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
