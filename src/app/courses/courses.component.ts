import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CourseService } from '../services/course.service';

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
    
  ) { }
  ngOnInit(): void {
    this.searchSortForm = this.formBuilder.group({
      search: [''],
      sortBy: ['']
    });
  
    this.courseService.getAllCourses().then(courses => {
      this.courses = courses;
    });
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
  
  
}
