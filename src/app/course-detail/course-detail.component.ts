import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';



@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseId!: string;
  course: any;
  ownedCourses: any[] = [];
  newReview: string = '';
  anonymous = true;
  rating = 1;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private orderService: OrderService
  ) { }

  async ngOnInit(): Promise<void> {
    this.courseId = this.route.snapshot.paramMap.get('id') as string;
    await this.getCourse();
    const userId = this.authService.getUserId();
    if (userId) {
      this.ownedCourses = await this.orderService.getOwnedCourses(userId);
    }
  }

  async getCourse() {
    try {
      this.course = await this.courseService.getCourseById(this.courseId);
      this.course.reviews = await this.courseService.getReviews(this.courseId);
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

  async addReview(): Promise<void> {
    if (this.newReview.trim() === '') {
      return;
    }
  
    const userId = this.authService.getUserId();
    await this.courseService.addReview(this.courseId, this.newReview, userId!, this.anonymous, this.rating);
  
    // Clear the form and refresh the reviews
    this.newReview = '';
    this.anonymous = true; // reset checkbox to true after review submission
    this.course.reviews = await this.courseService.getReviews(this.courseId);
  }

  isOwned(courseId: string): boolean {
    return this.ownedCourses.some(course => course.id === courseId);
  }

}
