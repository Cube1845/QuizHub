import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-test-logs',
  standalone: true,
  imports: [ButtonModule, InputTextModule],
  templateUrl: './test-logs.component.html',
  styleUrl: './test-logs.component.scss',
})
export class TestLogsComponent {}
