import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  host: { class: 'block space-y-1.5' },
  templateUrl: './form-field.html',
})
/**
 * Reusable form field wrapper that implements `ControlValueAccessor`.
 * Includes a label, Material Symbols icon, input element, and validation error messages.
 * Integrates with Angular reactive forms via `NgControl`.
 *
 * @example
 * ```html
 * <app-form-field label="Email" icon="mail" type="email"
 *                 placeholder="you@example.com" formControlName="email" />
 * ```
 */
export class FormFieldComponent implements OnInit, ControlValueAccessor {
  /** Label text displayed above the input. */
  label = input.required<string>();
  /** HTML input type attribute. Defaults to `'text'`. */
  type = input<string>('text');
  /** Material Symbols icon name displayed inside the input. */
  icon = input.required<string>();
  /** Placeholder text for the input. */
  placeholder = input<string>('');

  /** Unique ID linking the `<label>` to the `<input>`. Auto-generated if not provided. */
  id = input<string>(crypto.randomUUID());

  private ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);

  readonly inner = new FormControl('', { nonNullable: true });

  constructor() {
    if (this.ngControl !== null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular DI.
      this.ngControl.valueAccessor = this;
    }
  }

  get showError(): boolean {
    const ctrl = this.ngControl?.control;
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  get errorMessage(): string {
    const errors = this.ngControl?.control?.errors;
    if (!errors) return '';
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Enter a valid email address';
    return 'Invalid value';
  }

  ngOnInit() {
    if (!this.ngControl) return;

    this.inner.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this._onChange(value);
      });
  }

  onBlur(): void {
    this._onTouched();
  }

  private _onTouched: () => void = () => { };

  private _onChange: (value: string) => void = () => { };

  writeValue(value: string): void {
    this.inner.setValue(value ?? '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inner.disable({ emitEvent: false }) : this.inner.enable({ emitEvent: false });
  }
}
