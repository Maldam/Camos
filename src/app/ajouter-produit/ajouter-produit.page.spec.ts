import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AjouterProduitPage } from './ajouter-produit.page';

describe('ProduitsPage', () => {
  let component: AjouterProduitPage;
  let fixture: ComponentFixture<AjouterProduitPage>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterProduitPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(AjouterProduitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});