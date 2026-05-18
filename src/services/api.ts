import axios from "axios";

export type Affiliate = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  active: boolean;
};

export type City = {
  id: number;
  name: string;
  uf: string;
};

export type DashboardData = {
  totalAffiliates: number;
  totalLinks: number;
  totalClicks: number;
  topAffiliates: {
    id: number;
    name: string;
    totalClicks: number;
  }[];
};

export type AffiliateStats = {
  affiliate: string;
  totalLinks: number;
  totalClicks: number;
  links: {
    id: number;
    name: string | null;
    shortCode: string;
    originalUrl: string;
    clicks: number;
    promoLink: string;
  }[];
};

export type CreateAffiliatePayload = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
};

export type UpdateAffiliatePayload = Partial<CreateAffiliatePayload>;

export type CreateLinkPayload = {
  name?: string;
  url: string;
  affiliateId?: number;
};

export type CreateLinkResponse = {
  message: string;
  link: string;
};

export type Campaign = {
  id: number;
  name: string;
  destinationUrl: string;
  createdAt: string;
  totalLinks: number;
  totalAffiliates: number;
  totalClicks: number;
  topAffiliate: {
    id: number;
    name: string;
    email: string | null;
    city: string | null;
  } | null;
  topLink: {
    id: number;
    name: string | null;
    originalUrl: string;
    shortCode: string;
    promoLink: string;
    clicks: number;
    affiliate: {
      id: number;
      name: string;
      email: string | null;
      city: string | null;
    } | null;
  } | null;
  links: {
    id: number;
    name: string | null;
    originalUrl: string;
    shortCode: string;
    promoLink: string;
    clicks: number;
    affiliate: {
      id: number;
      name: string;
      email: string | null;
      city: string | null;
    } | null;
  }[];
};

export type CreateCampaignPayload = {
  name: string;
  destinationUrl: string;
  affiliateIds: number[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    city: string | null;
  };
};

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://afiliadosbackend-production.up.railway.app",
});

function getApiBaseUrl() {
  return String(api.defaults.baseURL || "").replace(/\/+$/, "");
}

function normalizePromoLink(link: string) {
  if (!link || !link.startsWith("/")) {
    return link;
  }

  return `${getApiBaseUrl()}${link}`;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (message) {
      return String(message);
    }
  }

  return fallback;
}

export async function listarAfiliados() {
  const { data } = await api.get<Affiliate[]>("/affiliate");
  return Array.isArray(data) ? data : [];
}

export async function criarAfiliado(payload: CreateAffiliatePayload) {
  const { data } = await api.post<Affiliate>("/affiliate", payload);
  return {
    ...data,
    city: data.city ?? payload.city ?? null,
    phone: data.phone ?? payload.phone ?? null,
  };
}

export async function editarAfiliado(
  id: number,
  payload: UpdateAffiliatePayload
) {
  const { data } = await api.put<Affiliate>(
    `/affiliate/${id}`,
    payload
  );

  return {
    ...data,
    city: data.city ?? payload.city ?? null,
    phone: data.phone ?? payload.phone ?? null,
  };
}

export async function apagarAfiliado(id: number) {
  await api.delete(`/affiliate/${id}`);
}

export async function listarCidadesTocantins() {
  const { data } = await api.get<City[]>("/cities/tocantins");
  return Array.isArray(data) ? data : [];
}

export async function buscarDashboard() {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
}

export async function criarLink(payload: CreateLinkPayload) {
  const { data } = await api.post<CreateLinkResponse>("/links", payload);
  return {
    ...data,
    link: normalizePromoLink(data.link),
  };
}

function normalizeCampaignLinks(campaign: Campaign) {
  const links = campaign.links.map((link) => ({
    ...link,
    promoLink: normalizePromoLink(link.promoLink),
  }));

  const topLink = campaign.topLink
    ? {
        ...campaign.topLink,
        promoLink: normalizePromoLink(campaign.topLink.promoLink),
      }
    : null;

  return {
    ...campaign,
    links,
    topLink,
  };
}

export async function criarCampanha(payload: CreateCampaignPayload) {
  const { data } = await api.post<Campaign>("/campaigns", payload);
  return normalizeCampaignLinks(data);
}

export async function listarCampanhas() {
  const { data } = await api.get<Campaign[]>("/campaigns");
  return Array.isArray(data)
    ? data.map(normalizeCampaignLinks)
    : [];
}

export async function apagarLink(id: number) {
  await api.delete(`/links/${id}`);
}

export async function buscarEstatisticasAfiliado(id: number) {
  const { data } = await api.get<AffiliateStats>(
    `/affiliate/${id}/stats`
  );
  return {
    ...data,
    links: data.links.map((link) => ({
      ...link,
      promoLink: normalizePromoLink(link.promoLink),
    })),
  };
}

export async function fazerLogin(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return data;
}

export default api;
