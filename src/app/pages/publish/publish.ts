import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@store/auth.store';
import { FeedStore } from '@store/feed.store';
import type { PostInput, PostType } from '@interfaces/post.interface';
import { AvatarComponent } from '@components/atoms/avatar/avatar';
import { DialogLayoutComponent } from '@components/templates/dialog-layout/dialog-layout';

/** Post types that have extra fields (excludes 'text' which is the default). */
type ExtraType = Exclude<PostType, 'text'>;

@Component({
  selector: 'app-publish',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AvatarComponent, DialogLayoutComponent],
  styleUrl: './publish.css',
  templateUrl: './publish.html',
})
/**
 * Post creation page rendered as a modal dialog (child route of feed).
 * Provides a form with a text content field and optional type-specific fields
 * (image, article, quote, event). Submits the new post via
 * `FeedStore.uploadPost()` and navigates back to `/feed` on success.
 *
 * @route `/feed/publish`
 * @guard `authGuard`
 */
export default class PublishPage {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly feedStore = inject(FeedStore);

  readonly user = this.authStore.user;
  readonly activeType = signal<ExtraType | null>(null);
  readonly submitting = signal(false);

  readonly form = new FormGroup({
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    // Image fields
    imageUrl: new FormControl('', { nonNullable: true }),
    imageAlt: new FormControl('', { nonNullable: true }),
    imageCaption: new FormControl('', { nonNullable: true }),
    // Article fields
    articleImageUrl: new FormControl('', { nonNullable: true }),
    articleTitle: new FormControl('', { nonNullable: true }),
    articleDesc: new FormControl('', { nonNullable: true }),
    articleLabel: new FormControl('', { nonNullable: true }),
    // Quote field
    quote: new FormControl('', { nonNullable: true }),
    // Event fields
    eventImageUrl: new FormControl('', { nonNullable: true }),
    eventTitle: new FormControl('', { nonNullable: true }),
    eventLocation: new FormControl('', { nonNullable: true }),
    eventDate: new FormControl('', { nonNullable: true }),
  });

  private readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly canSubmit = computed(() => {
    const v = this.formValue();
    if (!(v.content?.trim().length ?? 0) || this.submitting()) return false;

    const type = this.activeType();
    switch (type) {
      case 'image':
        return !!v.imageUrl?.trim();
      case 'article':
        return !!v.articleTitle?.trim() && !!v.articleDesc?.trim();
      case 'quote':
        return !!v.quote?.trim();
      case 'event':
        return !!v.eventTitle?.trim() && !!v.eventLocation?.trim() && !!v.eventDate?.trim();
      default:
        return true;
    }
  });

  close(): void {
    this.router.navigate(['/feed']);
  }

  toggleType(type: ExtraType): void {
    if (this.activeType() === type) {
      this.resetTypeFields(type);
      this.activeType.set(null);
    } else {
      const prev = this.activeType();
      if (prev) this.resetTypeFields(prev);
      this.activeType.set(type);
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

    const v = this.form.getRawValue();
    const type: PostType = this.activeType() ?? 'text';

    const postInput: PostInput = {
      type,
      content: v.content.trim(),
    };

    switch (type) {
      case 'image':
        postInput.image = {
          imageUrl: v.imageUrl.trim(),
          alt: v.imageAlt.trim() || v.content.trim().slice(0, 50),
          ...(v.imageCaption.trim() && { caption: v.imageCaption.trim() }),
        };
        break;
      case 'article':
        postInput.article = {
          imageUrl: v.articleImageUrl.trim(),
          title: v.articleTitle.trim(),
          description: v.articleDesc.trim(),
          ...(v.articleLabel.trim() && { label: v.articleLabel.trim() }),
        };
        break;
      case 'quote':
        postInput.quote = v.quote.trim();
        break;
      case 'event':
        postInput.event = {
          imageUrl: v.eventImageUrl.trim(),
          title: v.eventTitle.trim(),
          location: v.eventLocation.trim(),
          date: v.eventDate.trim(),
        };
        break;
    }

    await this.feedStore.uploadPost(postInput);
    this.router.navigate(['/feed']);
  }

  private resetTypeFields(type: ExtraType): void {
    const c = this.form.controls;
    switch (type) {
      case 'image':
        c.imageUrl.reset();
        c.imageAlt.reset();
        c.imageCaption.reset();
        break;
      case 'article':
        c.articleImageUrl.reset();
        c.articleTitle.reset();
        c.articleDesc.reset();
        c.articleLabel.reset();
        break;
      case 'quote':
        c.quote.reset();
        break;
      case 'event':
        c.eventImageUrl.reset();
        c.eventTitle.reset();
        c.eventLocation.reset();
        c.eventDate.reset();
        break;
    }
  }
}
