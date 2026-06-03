import type {
  CollectionUpdateInput,
  CollectionUpsertInput,
  ProductCollectionLinkInput,
} from "@monceri/shared";

export type CollectionListQuery = {
  active?: boolean;
  page: number;
  pageSize: number;
  search?: string;
};

export type CollectionCreateInput = CollectionUpsertInput;
export type CollectionPatchInput = CollectionUpdateInput;
export type CollectionProductsInput = ProductCollectionLinkInput;
