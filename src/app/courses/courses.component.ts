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
      
    });
  
    const userId = this.authService.getUserId();
    if (userId) {
      const allCourses = await this.courseService.getAllCourses();
      const ownedCourses = await this.orderService.getCourseById(userId);
      this.courses = allCourses.filter(course => !ownedCourses.includes(course.id));
    } else {
      this.courses = await this.courseService.getAllCourses();
    }
    
  }
  searchSort(): void {
    const { search, sortBy } = this.searchSortForm.value;
  
    // Filter courses by name
    let filteredCourses = this.courses;
    if (search) {
      filteredCourses = this.courses.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    // Sort courses by price
    if (sortBy === 'price') {
      filteredCourses.sort((a, b) => a.price - b.price);
    }
  
    this.courses = filteredCourses;
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
