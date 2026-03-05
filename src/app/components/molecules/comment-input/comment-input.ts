import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvatarComponent } from '@components/atoms/avatar/avatar';

@Component({
  selector: 'app-comment-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AvatarComponent],
  host: { class: 'block' },
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex gap-3 items-start">
      <app-avatar [src]="avatarUrl()" [alt]="authorName()" size="sm" />
      <div class="flex-1 flex flex-col gap-2">
        <textarea
          formControlName="content"
          class="w-full resize-none outline-none text-sm text-neutral-800 placeholder:text-neutral-400 border border-neutral-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          placeholder="Write a comment..."
          rows="2"
          aria-label="Comment content"
        ></textarea>
        <div class="flex justify-end">
          <button type="submit" class="btn-filled px-4 py-1.5 text-sm" [disabled]="!canSubmit()">
            Comment
          </button>
        </div>
      </div>
    </form>
  `,
})
/**
 * Comment text input with the current user's avatar. Includes a textarea with
 * validation and a submit button that is disabled until content is entered.
 * Emits the trimmed comment text on submit and resets the form.
 *
 * @example
 * ```html
 * <app-comment-input [avatarUrl]="user.avatar" [authorName]="user.name"
 *                    (commentSubmit)="onComment($event)" />
 * ```
 */
export class CommentInputComponent {
  /** URL of the commenting user's avatar. */
  avatarUrl = input.required<string>();
  /** Display name of the commenting user (used as avatar alt text). */
  authorName = input.required<string>();
  /** Emits the trimmed comment text when the form is submitted. */
  commentSubmit = output<string>();

  readonly form = new FormGroup({
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly canSubmit = computed(() => (this.formValue().content?.trim().length ?? 0) > 0);

  submit(): void {
    if (!this.canSubmit()) return;
    this.commentSubmit.emit(this.form.controls.content.value.trim());
    this.form.reset();
  }
}
