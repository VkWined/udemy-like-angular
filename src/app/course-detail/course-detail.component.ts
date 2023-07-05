import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseId!: string;
  course: any;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') as string;
    this.getCourse();
  }

  async getCourse() {
    try {
      this.course = await this.courseService.getCourseById(this.courseId);
    } catch (error) {
      console.error('Error getting course: ', error);
    }
  }
  addToCart(courseId: string): void {
    let userId = this.authService.getUserId();
    this.cartService.addCourseToCart(userId!, courseId)
      .then(() => {
        this.snackBar.open('Course added to cart', '', { duration: 2000 });
      })
      .catch(err => {
        console.error(err);
        this.snackBar.open('Error adding course to cart', '', { duration: 2000 });
      });
  }
}
