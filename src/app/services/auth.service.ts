import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = new Observable((subscriber) => {
      this.auth.onAuthStateChanged(subscriber);
    });
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, displayName: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(result.user!, { displayName });
      return result;
    } catch (error) {
      throw error;
    }
  }

  getUserId(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  async signOut() {
    await this.auth.signOut();
  }
}
