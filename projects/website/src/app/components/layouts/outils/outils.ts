import { Component, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // Pour transformer l'observable
import { map } from 'rxjs/operators';
import { Quicklinks } from '../../shared/quicklinks/quicklinks';
import { InterfaceQuickLinks } from '../../../interfaces/interface-quicklinks';
import { Card } from '../../shared/card/card';

@Component({
  selector: 'app-outils',
  imports: [RouterOutlet, Quicklinks, Card],
  templateUrl: './Outils.html',
  styleUrl: './Outils.scss',
})
export class Outils {
  ///Partie pour connecter les routes
  private route = inject(ActivatedRoute);
  links = toSignal(
    this.route.data.pipe(map((data) => data['quicklinks'] as InterfaceQuickLinks[])),
    {
      initialValue: [],
    },
  );
}
