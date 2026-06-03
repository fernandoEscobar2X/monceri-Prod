import type {
  BaseKey,
  BaseRecord,
  CreateParams,
  CustomParams,
  DataProvider,
  DeleteOneParams,
  GetListParams,
  GetOneParams,
  UpdateParams,
} from "@refinedev/core";
import { API_URL, apiRequest, appError } from "./api-client";

type ListResponse<TData> =
  | TData[]
  | {
      items: TData[];
      total: number;
      page?: number;
      pageSize?: number;
      totalPages?: number;
    };

function resourcePath(resource: string) {
  if (resource === "inventory") {
    return "/api/admin/inventory/stock";
  }

  if (resource === "dashboard") {
    return "/api/admin/dashboard/summary";
  }

  return `/api/admin/${resource}`;
}

function idPath(resource: string, id: BaseKey) {
  if (resource === "orders") {
    return `/api/admin/orders/${id}`;
  }

  return `${resourcePath(resource)}/${id}`;
}

function listSearchParams(params: GetListParams) {
  const searchParams = new URLSearchParams();
  const current = params.pagination?.currentPage ?? 1;
  const pageSize = params.pagination?.pageSize ?? 12;

  searchParams.set("page", String(current));
  searchParams.set("pageSize", String(pageSize));

  for (const filter of params.filters ?? []) {
    if ("field" in filter && filter.value !== undefined && filter.value !== null && filter.value !== "") {
      searchParams.set(String(filter.field), String(filter.value));
    }
  }

  return searchParams.toString();
}

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  async getList<TData extends BaseRecord = BaseRecord>(params: GetListParams) {
    const query = listSearchParams(params);
    const response = await apiRequest<ListResponse<TData>>(
      `${resourcePath(params.resource)}${query ? `?${query}` : ""}`,
    );

    if (Array.isArray(response)) {
      return { data: response, total: response.length };
    }

    return { data: response.items, total: response.total };
  },

  async getOne<TData extends BaseRecord = BaseRecord>(params: GetOneParams) {
    return { data: await apiRequest<TData>(idPath(params.resource, params.id)) };
  },

  async create<TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: CreateParams<TVariables>,
  ) {
    return {
      data: await apiRequest<TData>(resourcePath(params.resource), {
        body: JSON.stringify(params.variables),
        method: "POST",
      }),
    };
  },

  async update<TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: UpdateParams<TVariables>,
  ) {
    const path =
      params.resource === "orders"
        ? `/api/admin/orders/${params.id}/status`
        : idPath(params.resource, params.id);

    return {
      data: await apiRequest<TData>(path, {
        body: JSON.stringify(params.variables),
        method: "PATCH",
      }),
    };
  },

  async deleteOne<TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: DeleteOneParams<TVariables>,
  ) {
    await apiRequest<void>(idPath(params.resource, params.id), { method: "DELETE" });
    return { data: { id: params.id } as TData };
  },

  async custom<TData extends BaseRecord = BaseRecord, TQuery = unknown, TPayload = unknown>(
    params: CustomParams<TQuery, TPayload>,
  ) {
    if (!params.url) {
      throw appError(new Error("URL custom requerida"));
    }

    return {
      data: await apiRequest<TData>(params.url.replace(API_URL, ""), {
        body: params.payload ? JSON.stringify(params.payload) : undefined,
        method: params.method?.toUpperCase(),
      }),
    };
  },
};
