import type { ConfiguratorAddon, ConfiguratorInput, ConfiguratorPriceBreakdown } from "@monceri/shared";

export type ConfiguratorCartPayload = ConfiguratorInput & {
  price: ConfiguratorPriceBreakdown;
  addonLabels: Record<ConfiguratorAddon, string>;
};
