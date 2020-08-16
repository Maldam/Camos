import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfficherCommandePage } from './afficher-commande.page';

describe('AfficherCommandePage', () => {
  let component: AfficherCommandePage;
  let fixture: ComponentFixture<AfficherCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfficherCommandePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfficherCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
