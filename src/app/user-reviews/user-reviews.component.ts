import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) { }

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getUserId();
    if (userId) {
      this.reviews = await this.courseService.getUserReviews(userId);
    }
  }
}
