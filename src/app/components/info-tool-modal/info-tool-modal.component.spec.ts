import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoToolModalComponent } from './info-tool-modal.component';

describe('InfoToolModalComponent', () => {
  let component: InfoToolModalComponent;
  let fixture: ComponentFixture<InfoToolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoToolModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoToolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
