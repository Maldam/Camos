import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AjouterClientPage } from './ajouter-client.page';

describe('AjouterClientPage', () => {
  let component: AjouterClientPage;
  let fixture: ComponentFixture<AjouterClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouterClientPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AjouterClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
