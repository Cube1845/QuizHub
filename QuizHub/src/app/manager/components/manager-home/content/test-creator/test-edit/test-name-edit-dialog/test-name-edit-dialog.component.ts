import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-test-name-edit-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './test-name-edit-dialog.component.html',
  styleUrl: './test-name-edit-dialog.component.scss',
})
export class TestNameEditDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  currentName: string | null = null;
  testIndex: number | null = null;

  dialogType!: 'add' | 'edit';

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
  ]);

  ngOnInit(): void {
    const data = this.config.data;

    if (data == null || data == undefined) {
      this.dialogType = 'add';
      return;
    }

    this.currentName = data.currentName;
    this.testIndex = data.index;

    this.dialogType = 'edit';

    if (this.currentName != null) {
      this.setInputValue();
    }
  }

  setInputValue(): void {
    this.nameFormControl.setValue(this.currentName);
  }

  addNewTest(): void {
    this.ref.close(this.nameFormControl.value!);
  }

  saveTestName() {
    this.ref.close({
      name: this.nameFormControl.value!,
      testIndex: this.testIndex,
    });
  }

  close(): void {
    this.ref.close(null);
  }
}
