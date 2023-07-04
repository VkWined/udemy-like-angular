import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  courseForm: FormGroup;
  courseId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') as string;
    this.loadCourse();
  }

  async loadCourse() {
    try {
      const course = await this.courseService.getCourseById(this.courseId);
      this.courseForm.patchValue(course);
    } catch (error) {
      console.error('Error loading course: ', error);
    }
  }

  async saveCourse(): Promise<void> {
    const courseData = this.courseForm.value;
    try {
      await this.courseService.updateCourse(this.courseId, courseData);
  
      // Show a snack bar for feedback
      this.snackBar.open('Course updated successfully!', 'Close', {
        duration: 3000
      });
  
      // Redirect to the course detail page
      this.router.navigate(['/courses', this.courseId]);
  
    } catch (error) {
      console.error('Error updating course: ', error);
    }
  }
  
}
