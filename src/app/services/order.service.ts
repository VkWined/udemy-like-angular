import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getFirestore,
  getDoc,
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

    // Add the courses to the ownedCourses collection
    const ownedCoursesCollectionRef = collection(this.db, `userdata/${userId}/ownedCourses`);
    for (const course of cartItems) {
      await setDoc(doc(ownedCoursesCollectionRef, course.id), course);
    }

    return orderDoc.id;
  }

  async getOrders(userId: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, `userdata/${userId}/orders`));
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return orders;
  }
  async getOwnedCourses(userId: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, `userdata/${userId}/ownedCourses`));
    const ownedCourseIds = querySnapshot.docs.map(doc => doc.id);
  
    const ownedCourses = [];
    for (let courseId of ownedCourseIds) {
      const course = await this.getCourseById(courseId);
      if (course) {
        ownedCourses.push(course);
      }
    }
  
    return ownedCourses;
  }
  
  async getCourseById(courseId: string): Promise<any> {
    const docSnap = await getDoc(doc(this.db, 'courses', courseId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  }
}
