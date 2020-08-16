import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AjouterCommandePage } from './ajouter-commande.page';

describe('AjouterCommandePage', () => {
  let component: AjouterCommandePage;
  let fixture: ComponentFixture<AjouterCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterCommandePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AjouterCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
