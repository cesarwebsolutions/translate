import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'translate';

  name = 'Gurunadh';

  constructor(private translate: TranslateService) {
    // Set the default language
    translate.setDefaultLang('en');
  }

  switchLanguage(language: string) {
    // Set the current language
    this.translate.use(language);
  }

  switchToEnglish() {
    this.translate.use('en');
  }

  switchToFrench() {
    this.translate.use('pt');
  }
}
