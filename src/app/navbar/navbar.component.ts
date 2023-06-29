import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(public authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {}

  logout() {
    this.authService.signOut();
  }
}
