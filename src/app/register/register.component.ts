import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async register(email: string, password: string, displayName: string, event: Event) {
    event.preventDefault();  
  
    try {
      const result = await this.authService.register(email, password, displayName);
      if (result) {
        // Here you can create a function to store other user details in Firestore or Realtime Database
      }
    } catch (error) {
      console.log(error);
    }
  }
}
