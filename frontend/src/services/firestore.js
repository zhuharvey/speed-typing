import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

// function to add a speed test result to the db
export const addSpeedTestResult = async (userId, speed) => {
  try {
    const userTestsCollection = collection(db, "users", userId, "speedTests");
    const docRef = await addDoc(userTestsCollection, {
      speed: speed,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// function to fetch all speed test results from the db (sorted by recency)
export const fetchSpeedTestResults = async (userId) => {
  try {
    const userTestsCollection = collection(db, "users", userId, "speedTests");
    const q = query(userTestsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return results;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return [];
  }
};
