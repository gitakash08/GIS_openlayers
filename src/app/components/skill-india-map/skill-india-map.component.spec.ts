import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillIndiaMapComponent } from './skill-india-map.component';

describe('SkillIndiaMapComponent', () => {
  let component: SkillIndiaMapComponent;
  let fixture: ComponentFixture<SkillIndiaMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillIndiaMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillIndiaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
