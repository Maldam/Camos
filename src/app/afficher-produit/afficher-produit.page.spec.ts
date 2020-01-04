import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AfficherProduitPage } from './afficher-produit.page';

describe('AfficherProduitPage', () => {
  let component: AfficherProduitPage;
  let fixture: ComponentFixture<AfficherProduitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfficherProduitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AfficherProduitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
