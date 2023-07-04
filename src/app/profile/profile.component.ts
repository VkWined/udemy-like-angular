import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserdataService } from '../services/userdata.service';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfileData: any;

  constructor(
    private formBuilder: FormBuilder,
    private userdataService: UserdataService,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      areas_of_interest: [''],
      bio: [''],
      display_name: [''],
      domain_expertise: [''],
      experience: [''],
      first_name: [''],
      last_name: [''],
      profile_picture: [''],
      role: [''],
      user_type: [''],
      user_id: ['']
    });
  }

  async ngOnInit() {
    try {
      this.userProfileData = await this.userdataService.getUserProfileData();
      this.profileForm.patchValue(this.userProfileData);
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  }

  async saveUserProfileData(): Promise<void> {
    const profileData = this.profileForm.value;
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error('User id is undefined');
    }
    const db = getFirestore();
    if (userId) {

      const docRef = doc(db, 'userdata', userId);
      try {
        console.log("Profile data to save:", profileData);
        await setDoc(docRef, profileData, { merge: true });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      throw new Error('No user id found');
    }
  }
  
  private convertToArray(interests: string): string[] {
    if (interests && typeof interests === 'string') {
      return interests.split(',').map(item => item.trim());
    }
    return [];
  }
}
