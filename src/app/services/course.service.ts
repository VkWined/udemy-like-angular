import { Injectable } from '@angular/core';
import { 
  collection, 
  doc, 
  query,
  getFirestore, 
  getDocs, 
  getDoc,
  addDoc,
  updateDoc, 
  deleteDoc,
  setDoc,
  where,
  Unsubscribe,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  db = getFirestore();
  
  constructor() {}
  // Method to create a new course
async createCourse(course: any): Promise<string> {
  const docRef = await addDoc(collection(this.db, 'courses'), course);
  return docRef.id;
}

// Method to get all courses
async getAllCourses(): Promise<any[]> {
  const querySnapshot = await getDocs(collection(this.db, 'courses'));
  const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return courses;
}

// Method to get a course by id
async getCourseById(id: string): Promise<any> {
  const docSnap = await getDoc(doc(this.db, 'courses', id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    
    throw new Error('No such document!');
    
  }
}

// Method to update a course
async updateCourse(id: string, courseData: any): Promise<void> {
  try {
    await updateDoc(doc(this.db, 'courses', id), courseData);
  } catch (error) {
    console.error('Error updating course: ', error);
  }
}

// Method to delete a course
async deleteCourse(id: string): Promise<string> {
  const docRef = doc(this.db, 'courses', id);
  await deleteDoc(docRef);
  return id;
}

// Method to add a review to a course
async addReview(courseId: string, review: any, userId: string, anonymous: boolean, rating: number): Promise<string> {
  const reviewData = { 
    content: review,
    userId: userId,
    anonymous: anonymous,
    rating: rating
  };
  const docRef = await addDoc(collection(this.db, `courses/${courseId}/reviews`), reviewData);
  return docRef.id;
}



async getReviews(courseId: string): Promise<any[]> {
  const querySnapshot = await getDocs(collection(this.db, `courses/${courseId}/reviews`));
  const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return reviews;
}
// Method to get recommended courses
async getRecommendedCourses(userDomain: string): Promise<any[]> {
  const q = query(collection(this.db, 'courses'), where('domain', '==', userDomain));
  const querySnapshot = await getDocs(q);
  const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return courses;
}
async getCoursesByDomain(domain: string) {
  const db = getFirestore();
  const q = query(collection(db, 'courses'), where('domain', '==', domain));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

// Method to get reviews by user id
async getUserReviews(userId: string): Promise<any[]> {
  // Get all courses
  const courses = await this.getAllCourses();
  
  const allReviews: any[] = [];
  // Get reviews for each course
  for (const course of courses) {
    const reviews = await this.getReviews(course.id);
    // Filter reviews for this user and add courseId to review data
    const userReviews = reviews.filter(review => review.userId === userId).map(review => ({...review, courseId: course.id}));
    allReviews.push(...userReviews);
  }
  
  return allReviews;
}

}

