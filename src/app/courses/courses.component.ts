import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  searchSortForm!: FormGroup;
  originalCourses: any[] = []; // To keep a copy of all courses before sorting/filtering

  constructor(
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.searchSortForm = this.formBuilder.group({
      search: [''],
      sortBy: [''],
      sortOrder: [''],
    });

    const userId = this.authService.getUserId();
    if (userId) {
      const allCourses = await this.courseService.getAllCourses();
      const ownedCourses = await this.orderService.getOwnedCourses(userId);
      this.courses = allCourses.filter(course => !ownedCourses.includes(course.id));
      this.originalCourses = this.courses.slice(); // Create a copy for filtering
    } else {
      this.courses = await this.courseService.getAllCourses();
      this.originalCourses = this.courses.slice(); // Create a copy for filtering
    }
  }

  searchSort(): void {
    const { search, sortBy, sortOrder } = this.searchSortForm.value;

    // Filter courses by name
    let filteredCourses = this.originalCourses;
    if (search) {
      filteredCourses = this.originalCourses.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort courses by price
    if (sortBy === 'price') {
      filteredCourses.sort((a, b) => {
        if (sortOrder === 'lowToHigh') {
          return a.price - b.price;
        } else if (sortOrder === 'highToLow') {
          return b.price - a.price;
        } else {
          return 0;
        }
      });
    }

    this.courses = filteredCourses;
  }

  clearFilters(): void {
    this.searchSortForm.reset();
    this.courses = this.originalCourses.slice(); // Reset courses to original state
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
  deleteCourse(courseId: string): void {
    this.courseService.deleteCourse(courseId)
      .then((deletedCourseId) => {
        this.courses = this.courses.filter(course => course.id !== deletedCourseId);
        this.snackBar.open('Course deleted successfully', '', { duration: 2000 });
      })
      .catch(err => {
        console.error(err);
        this.snackBar.open('Error deleting course', '', { duration: 2000 });
      });
  }
  
  
  
}
