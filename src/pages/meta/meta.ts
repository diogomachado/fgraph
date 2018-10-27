import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList, AngularFireObject } from '@angular/fire/database/interfaces';

@IonicPage()
@Component({
  selector: 'page-meta',
  templateUrl: 'meta.html',
})
export class MetaPage {

  metaEstipulada: Number;

  // Refs do Firebase
  ref: AngularFireList<any>;
  refMeta: AngularFireObject<any>;

    constructor(public viewCtrl: ViewController, private db: AngularFireDatabase, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {

    // referencia para transacoes de venda
    this.ref = this.db.list('config');
    this.refMeta = this.db.object('config');

    // A cada mudança (observando)
    this.refMeta.valueChanges().subscribe(result => {
        this.metaEstipulada = (result == undefined) ? 300 : result.meta;
    });
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText("Voltar");
  }

  confirmarMeta(){

    // Alert
    let confirm = this.alertCtrl.create({
        title: 'Tem certeza?',
        message: 'Após confirmar, essa será a meta de ganhos',
        buttons: [
            {
                text: 'Não',
                handler: () => {
                    console.log('Cancelou ação');
                }
            },
            {
                text: 'Sim',
                handler: () => {

                    // Trabalhar a logica do firebase
                    this.ref.set('meta', this.metaEstipulada);

                    // Exibir feedback
                    let toast = this.toastCtrl.create({
                        message: 'Meta configurada!',
                        duration: 3000
                    });
                    toast.present();
                }
            }
        ]
    });
    confirm.present();

  }
}
