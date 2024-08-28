import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompenenteDoisComponent } from './compenente-dois.component';

describe('CompenenteDoisComponent', () => {
  let component: CompenenteDoisComponent;
  let fixture: ComponentFixture<CompenenteDoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompenenteDoisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompenenteDoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
