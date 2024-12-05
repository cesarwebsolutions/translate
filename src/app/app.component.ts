import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponenteDoisComponent } from './componente-dois/componente-dois.component';
import { CompenenteDoisComponent } from './componente-um/compenente-dois/compenente-dois.component';
import { CompenenteUmComponent } from './componente-um/compenente-um/compenente-um.component';
import { ComponenteTresComponent } from './componente-tres/componente-tres.component';
import { ComponenteUmComponent } from './componente-um/componente-um.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule,
    ComponenteDoisComponent,
    CompenenteDoisComponent,
    CompenenteUmComponent,
    ComponenteTresComponent,
    ComponenteUmComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'translate';

  name = 'Gurunadh';

  selectedOption: string = 'en';

  constructor(private translate: TranslateService) {
    // Set the default language
    translate.setDefaultLang('en');
  }

  onChange(event: any) {
    this.selectedOption = event.target.value || 'en';
    // Set the current language
    this.translate.use(this.selectedOption);
  }
}
