import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@store/auth.store';
import { FeedStore } from '@store/feed.store';
import type { PostInput } from '@interfaces/post.interface';
import { AvatarComponent } from '@components/atoms/avatar/avatar';
import { DialogLayoutComponent } from '@components/templates/dialog-layout/dialog-layout';

@Component({
  selector: 'app-publish',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AvatarComponent, DialogLayoutComponent],
  styleUrl: './publish.css',
  templateUrl: './publish.html',
})
/**
 * Post creation page rendered as a modal dialog (child route of feed).
 * Provides a form with a text content field and an optional image attachment
 * (URL + alt text). Submits the new post via `FeedStore.uploadPost()` and
 * navigates back to `/feed` on success.
 *
 * @route `/feed/publish`
 * @guard `authGuard`
 */
export default class PublishPage {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly feedStore = inject(FeedStore);

  readonly user = this.authStore.user;
  readonly showImageFields = signal(false);
  readonly submitting = signal(false);

  readonly form = new FormGroup({
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    imageUrl: new FormControl('', { nonNullable: true }),
    imageAlt: new FormControl('', { nonNullable: true }),
  });

  private readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly canSubmit = computed(() => {
    const { content } = this.formValue();
    return (content?.trim().length ?? 0) > 0 && !this.submitting();
  });

  close(): void {
    this.router.navigate(['/feed']);
  }

  toggleImageFields(): void {
    this.showImageFields.update(v => !v);
    if (!this.showImageFields()) {
      this.form.controls.imageUrl.reset();
      this.form.controls.imageAlt.reset();
    }
  }

  clearImage(): void {
    this.form.controls.imageUrl.reset();
    this.form.controls.imageAlt.reset();
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;

    const user = this.user();
    if (!user) return;

    this.submitting.set(true);

    const { content, imageUrl, imageAlt } = this.form.getRawValue();
    const hasImage = imageUrl.trim().length > 0;

    const postInput: PostInput = {
      type: hasImage ? 'image' : 'text',
      content: content.trim(),
      ...(hasImage && {
        image: {
          imageUrl: imageUrl.trim(),
          alt: imageAlt.trim() || content.trim().slice(0, 50),
        },
      }),
    };

    await this.feedStore.uploadPost(postInput);
    this.router.navigate(['/feed']);
  }
}
