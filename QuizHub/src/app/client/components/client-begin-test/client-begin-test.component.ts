import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-client-begin-test',
  standalone: true,
  imports: [InputTextModule, ButtonModule, FloatLabelModule],
  templateUrl: './client-begin-test.component.html',
  styleUrl: './client-begin-test.component.scss',
})
export class ClientBeginTestComponent {}
