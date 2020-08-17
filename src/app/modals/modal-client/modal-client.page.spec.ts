import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalClientPage } from './modal-client.page';

describe('ModalClientPage', () => {
  let component: ModalClientPage;
  let fixture: ComponentFixture<ModalClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalClientPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
