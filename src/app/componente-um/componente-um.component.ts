import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-componente-um',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './componente-um.component.html',
  styleUrl: './componente-um.component.scss',
})
export class ComponenteUmComponent {}
