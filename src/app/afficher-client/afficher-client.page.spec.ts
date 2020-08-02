import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfficherClientPage } from './afficher-client.page';

describe('AfficherClientPage', () => {
  let component: AfficherClientPage;
  let fixture: ComponentFixture<AfficherClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfficherClientPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfficherClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
