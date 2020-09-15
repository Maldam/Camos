import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalListeContactsPage } from './modal-liste-contacts.page';

describe('ModalListeContactsPage', () => {
  let component: ModalListeContactsPage;
  let fixture: ComponentFixture<ModalListeContactsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListeContactsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalListeContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
