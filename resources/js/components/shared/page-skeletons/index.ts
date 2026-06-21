/**
 * Shared page skeleton primitives.
 *
 * Phase 2 migration: replace route `pendingComponent: () => <Loading />` with
 * `TableListPageSkeleton`, `FormPageSkeleton`, or `DetailPageSkeleton` from
 * `./page-skeleton-presets` (config-only; no per-route files unless layout differs).
 */
export { PageSkeletonShell } from './page-skeleton-shell';
export { SkeletonPageHeader } from './skeleton-page-header';
export { SkeletonDataTable } from './skeleton-data-table';
export { SkeletonFormPage, SkeletonFormCard } from './skeleton-form-page';
export {
  SkeletonDetailSection,
  SkeletonDetailSections,
} from './skeleton-detail-sections';
export {
  TableListPageSkeleton,
  FormPageSkeleton,
  DetailPageSkeleton,
  TabbedContentPageSkeleton,
  SkeletonDialogTable,
  SkeletonDialogCardGrid,
} from './page-skeleton-presets';
