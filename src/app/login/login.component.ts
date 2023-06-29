import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async login(email: string, password: string, event: Event) {
    event.preventDefault();
    try {
      const result = await this.authService.login(email, password);
      if (result) {
        this.router.navigate(['/dashboard']); 
      }
    } catch (error) {
      console.log(error);
    }
  }
}
