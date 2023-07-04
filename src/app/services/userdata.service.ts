import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  constructor(
    private authService: AuthService,
  ) { }

  async getUserProfileData(): Promise<any> {
    const userId = this.authService.getUserId();
    const db = getFirestore();
  
    if (userId) {
      const docRef = doc(db, 'userdata', userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Document with ID exists, return data
        return docSnap.data();
      } else {
        // Document with ID does not exist, create new document
        const initialData = { /* any initial data you want in new document */ };
        await setDoc(docRef, initialData);
        return initialData;
      }
    } else {
      throw new Error('No user id found');
    }
  }

  async saveUserProfileData(profileData: any): Promise<void> {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User id is undefined');
    }
    const db = getFirestore();
    if (userId) {
      // Assuming profileData contains 'user_id' field that matches document ID
      const docRef = doc(db, 'userdata', profileData.user_id);
      await updateDoc(docRef, profileData);
    } else {
      throw new Error('No user id found');
    }
  }
}
