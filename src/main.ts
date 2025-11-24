import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const library = appRef.injector.get(FaIconLibrary);
    library.addIcons(faHeart);
  })
  .catch((err) => console.error(err));
