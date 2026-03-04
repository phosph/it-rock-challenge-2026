import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@src/app/store/auth.store';
import { FeedStore } from '@src/app/store/feed.store';
import type { PostInput } from '@src/app/interfaces/post.interface';
import { AvatarComponent } from '@src/app/components/atoms/avatar/avatar';

@Component({
  selector: 'app-publish',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AvatarComponent],
  styleUrl: './publish.css',
  templateUrl: './publish.html',
})
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

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onBackdropKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
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
      type: hasImage ? 'image' : 'quote',
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
