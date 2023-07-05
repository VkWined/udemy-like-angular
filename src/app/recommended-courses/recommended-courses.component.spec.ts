import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCoursesComponent } from './recommended-courses.component';

describe('RecommendedCoursesComponent', () => {
  let component: RecommendedCoursesComponent;
  let fixture: ComponentFixture<RecommendedCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedCoursesComponent]
    });
    fixture = TestBed.createComponent(RecommendedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
