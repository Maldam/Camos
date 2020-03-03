import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(
    private menu: MenuController,
    public toastController: ToastController,
    public afAuth: AngularFireAuth
  ) { }
  public openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
}
export class MenuExample {
  constructor(private menu: MenuController) { }
}