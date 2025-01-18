import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../../../../../../common/components/spinner/spinner.component';
import { ButtonModule } from 'primeng/button';
import { TestOptions } from '../../../../../models/testOptions';
import { TestEditService } from '../../../../../services/test-edit.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-test-edit',
  standalone: true,
  imports: [
    SpinnerComponent,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    IftaLabelModule,
    TableModule,
  ],
  templateUrl: './test-edit.component.html',
  styleUrl: './test-edit.component.scss',
})
export class TestEditComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly testEditService = inject(TestEditService);

  testId!: string | null;
  testName!: string | null;

  testOptions!: TestOptions | null;

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      this.testId = paramMap.get('id');

      //temporary
      this.testName = paramMap.get('id');
      this.testOptions = this.testEditService.getTestOptions(this.testId!);
    });
  }
}
