import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getFirestore,
  addDoc
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  db = getFirestore();

  constructor() { }

  async createOrder(userId: string, cartItems: {id: string, name: string, description: string, price: number}[]): Promise<string> {
    const coursesObj: { [key: string]: any } = {};
    cartItems.forEach(course => {
      coursesObj[course.id] = course;
    });

    const orderData = { courses: coursesObj, date: new Date() };
    const orderCollectionRef = collection(this.db, `userdata/${userId}/orders`);
    const orderDoc = await addDoc(orderCollectionRef, orderData);

    return orderDoc.id;
  }

  async getOrders(userId: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, `userdata/${userId}/orders`));
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return orders;
  }
}
