import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  host: { class: 'block space-y-1.5' },
  template: `
    <label [attr.for]="id()" class="block text-sm font-medium text-neutral-700">{{ label() }}</label>
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <span class="material-symbols-outlined text-xl text-neutral-400 group-focus-within:text-primary-500 transition-colors"
          aria-hidden="true">{{ icon() }}</span>
      </div>
      <input
        [type]="type()"
        [id]="id()"
        [formControl]="inner"
        [placeholder]="placeholder()"
        class="form-input pl-10 pr-3.5 py-2.5 sm:text-[15px]"
        [attr.aria-invalid]="inner.touched && inner.invalid"
      />
    </div>
  `,
})
export class FormFieldComponent implements OnInit, ControlValueAccessor {
  label = input.required<string>();
  type = input<string>('text');
  icon = input.required<string>();
  placeholder = input<string>('');

  id = input<string>(crypto.randomUUID());

  private ngControl = inject(NgControl, { self: true, optional: true });
  private destroyRef = inject(DestroyRef);

  readonly inner = new FormControl('', { nonNullable: true });


  constructor() {
    if (this.ngControl !== null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular DI.
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (!this.ngControl) return;

    // Cuando el control interno cambia → notificar al form padre
    this.inner.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this._onChange(value);
      });

    // Cuando el control interno es touched → notificar al form padre
    // statusChanges captura el momento en que el control interno
    // pasa de PENDING a cualquier otro estado, incluyendo touched
    // this.inner.events
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(event => {
    //     if (event.type === 'touched') {
    //       this._onTouched();
    //     }
    //   });
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
