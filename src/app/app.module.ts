import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MetaPage } from '../pages/meta/meta';
import { LoginPage } from '../pages/login/login';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

var config = {
    apiKey: "AIzaSyCToqHLrDs3lgMeHJbF8qOtxwILucDGQ7Y",
    authDomain: "fgraph-26dee.firebaseapp.com",
    databaseURL: "https://fgraph-26dee.firebaseio.com",
    projectId: "fgraph-26dee",
    storageBucket: "fgraph-26dee.appspot.com",
    messagingSenderId: "145277185321"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MetaPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MetaPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
