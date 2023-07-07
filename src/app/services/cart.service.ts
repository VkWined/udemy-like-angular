import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  getFirestore,
  addDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  db = getFirestore();

  constructor() { }

  // Method to add a course to a user's cart
  async addCourseToCart(userId: string, courseId: string): Promise<string> {
    // Fetch the user's owned courses
    const ownedCourses = await this.getOwnedCourses(userId);
  
    // Check if the course is already owned
    if (ownedCourses.some(course => course.id === courseId)) {
      throw new Error('This course is already owned by the user');
    }
  
    const cartRef = doc(this.db, 'users', userId, 'cart', courseId);
    const courseRef = doc(this.db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    const courseData = courseDoc.data();
  
    await setDoc(cartRef, courseData);
  
    return cartRef.id;
  }
  
  async getOwnedCourses(userId: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, `users/${userId}/ownedCourses`));
    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return courses;
  }
  

  // Method to get all courses in a user's cart
  async getCartCourses(userId: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, `users/${userId}/cart`));
    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return courses;
  }

  // Method to delete a course from a user's cart
  async deleteCourseFromCart(userId: string, courseId: string): Promise<void> {
    const cartRef = doc(this.db, 'users', userId, 'cart', courseId);
    await deleteDoc(cartRef);
  }

  // Method to calculate the total price of the cart
  async calculateTotalPrice(userId: string): Promise<number> {
    const courses = await this.getCartCourses(userId);
    let totalPrice = 0;

    courses.forEach(course => {
      totalPrice += course.price;
    });

    return totalPrice;
  }
  async getCartItems(userId: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, `users/${userId}/cart`));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return items;
  }

  // Method to clear a user's cart
  async clearCart(userId: string): Promise<void> {
    const querySnapshot = await getDocs(collection(this.db, `users/${userId}/cart`));
    const batch = writeBatch(this.db);
    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}
