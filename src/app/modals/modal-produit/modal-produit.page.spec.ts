import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalProduitPage } from './modal-produit.page';

describe('ModalProduitPage', () => {
  let component: ModalProduitPage;
  let fixture: ComponentFixture<ModalProduitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProduitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalProduitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
