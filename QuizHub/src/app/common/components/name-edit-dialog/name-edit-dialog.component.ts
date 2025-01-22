import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-name-edit-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './name-edit-dialog.component.html',
  styleUrl: './name-edit-dialog.component.scss',
})
export class NameEditDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  currentName: string | null = null;
  itemIndex: number | null = null;

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
    this.itemIndex = data.index;

    this.dialogType = 'edit';

    if (this.currentName != null) {
      this.setInputValue();
    }
  }

  setInputValue(): void {
    this.nameFormControl.setValue(this.currentName);
  }

  addNewItem(): void {
    this.ref.close(this.nameFormControl.value!);
  }

  saveName() {
    this.ref.close({
      name: this.nameFormControl.value!,
      itemIndex: this.itemIndex,
    });
  }

  close(): void {
    this.ref.close(null);
  }
}
