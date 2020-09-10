import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalCommandesPage } from './modal-commandes.page';

describe('ModalCommandesPage', () => {
  let component: ModalCommandesPage;
  let fixture: ComponentFixture<ModalCommandesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCommandesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCommandesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
