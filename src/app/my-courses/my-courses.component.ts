import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service'; 
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  ownedCourses: any[] = [];

  constructor(
    private orderService: OrderService, 
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId) {
      this.ownedCourses = await this.orderService.getOwnedCourses(userId);
    }
  }
}
