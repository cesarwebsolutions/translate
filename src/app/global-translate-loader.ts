import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

export class GlobalTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // Lista de componentes que possuem arquivos de tradução
    const componentPaths = [
      './app/i18n',
      './app/componente-um/i18n',
      './app/componente-dois/i18n',
      './app/componente-tres/i18n',
      './app/componente-um/compenente-dois/i18n',
      './app/componente-um/compenente-um/i18n',
    ];

    // Carrega as traduções de cada caminho
    const translations = componentPaths.map((path) =>
      this.http.get(`${path}/${lang}.json`).pipe(
        // Em caso de erro (como arquivo não encontrado), retorna um objeto vazio
        mergeMap((data) => of(data)),
        catchError(() => of({}))
      )
    );

    // Combina todas as traduções em um único objeto
    return forkJoin(translations).pipe(
      map((results) => results.reduce((acc, curr) => ({ ...acc, ...curr }), {}))
    );
  }
}
