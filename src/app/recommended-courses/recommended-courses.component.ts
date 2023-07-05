import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseService } from '../services/course.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-recommended-courses',
  templateUrl: './recommended-courses.component.html',
  styleUrls: ['./recommended-courses.component.css']
})
export class RecommendedCoursesComponent implements OnInit {
  recommendedCourses!: Observable<any>;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.getRecommendedCourses();
  }

  getRecommendedCourses() {
    const userDomainInterest = "Domain"; // replace "Domain" with user's actual domain of interest.
    this.recommendedCourses = from(this.courseService.getCoursesByDomain(userDomainInterest));
  }
}
