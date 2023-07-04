import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  courseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.formBuilder.group({
      name: ['', Validators.required],
      domain: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  async saveCourse(): Promise<void> {
    const courseData = this.courseForm.value;
    try {
      await this.courseService.createCourse(courseData);
      this.courseForm.reset();
  
      // Navigate back to courses route
      this.router.navigateByUrl('/courses');
  
      // Provide feedback to the user
      this.snackBar.open('Course created successfully!', '', {
        duration: 2000, // Show for 2 seconds
      });
    } catch (error) {
      console.error('Error saving course: ', error);
      this.snackBar.open('Failed to create course. Please try again.', '', {
        duration: 2000, // Show for 2 seconds
      });
    }
  }
  
}
