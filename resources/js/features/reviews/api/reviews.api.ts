import type { PaginationState } from '@tanstack/react-table';

import {
  reviewSchema,
  type ReviewFormValues,
} from '@/features/reviews/schemas/review.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const reviewsQueryKeys = {
  all: ['reviews'] as const,
  list: (pagination: PaginationState) =>
    [...reviewsQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...reviewsQueryKeys.all, 'detail', id] as const,
};

export async function fetchReviews(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('review/list', { searchParams: tablePaginationToLaravel(pagination) })
    .json();
  return parsePaginatedResponse(raw, reviewSchema);
}

export async function fetchReview(id: number) {
  const raw = await baecardApiClient.get(`review/show/${id}`).json();
  return parseResponse(raw, reviewSchema);
}

export async function createReview(payload: ReviewFormValues) {
  const body = {
    ...payload,
    product_id: payload.product_id || undefined,
    title: payload.title || undefined,
  };
  const raw = await baecardApiClient.post('review/create', { json: body }).json();
  return parseResponse(raw, reviewSchema);
}

export async function updateReview(id: number, payload: ReviewFormValues) {
  const body = {
    ...payload,
    product_id: payload.product_id || undefined,
    title: payload.title || undefined,
  };
  const raw = await baecardApiClient.put(`review/update/${id}`, { json: body }).json();
  return parseResponse(raw, reviewSchema);
}

export async function toggleReviewVisibility(id: number) {
  const raw = await baecardApiClient.patch(`review/toggle-visibility/${id}`).json();
  return parseResponse(raw, reviewSchema);
}

export async function deleteReview(id: number) {
  const raw = await baecardApiClient.delete(`review/delete/${id}`).json();
  return parseResponse(raw, reviewSchema.nullable());
}
