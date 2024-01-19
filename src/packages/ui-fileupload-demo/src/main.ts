import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule, appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
