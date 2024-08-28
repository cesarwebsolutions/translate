import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompenenteUmComponent } from './compenente-um.component';

describe('CompenenteUmComponent', () => {
  let component: CompenenteUmComponent;
  let fixture: ComponentFixture<CompenenteUmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompenenteUmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompenenteUmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
