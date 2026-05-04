import type { ThemeConfig } from "antd";

export const monceriLightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#E63946",
    colorLink: "#E63946",
    colorSuccess: "#16a34a",
    colorWarning: "#eab308",
    colorError: "#dc2626",
    colorInfo: "#2563eb",
    borderRadius: 10,
    borderRadiusSM: 8,
    borderRadiusLG: 14,
    fontFamily: '"Outfit", system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 26,
    fontSizeHeading3: 22,
    fontSizeHeading4: 18,
    colorBgLayout: "#FAFAFA",
    colorBgContainer: "#FFFFFF",
    colorTextHeading: "#111827",
    colorText: "#1F2937",
    colorTextSecondary: "#4B5563",
    colorTextTertiary: "#6B7280",
    colorBorder: "#E5E7EB",
    colorBorderSecondary: "#F3F4F6",
    boxShadowSecondary: "0 4px 12px rgba(17, 24, 39, 0.06)",
  },
  components: {
    Button: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 24,
    },
    Form: {
      itemMarginBottom: 20,
      labelColor: "#374151",
      labelFontSize: 14,
    },
    Input: {
      controlHeight: 40,
      paddingInline: 14,
    },
    Select: {
      controlHeight: 40,
    },
    Table: {
      borderColor: "#F3F4F6",
      headerBg: "#F9FAFB",
      headerColor: "#374151",
      rowHoverBg: "#FAFAFA",
    },
    Tag: {
      borderRadiusSM: 6,
      fontSizeSM: 12,
    },
  },
};

export const monceriDarkTheme: ThemeConfig = {
  token: {
    ...monceriLightTheme.token,
    colorBgLayout: "#0F172A",
    colorBgContainer: "#1E293B",
    colorTextHeading: "#F8FAFC",
    colorText: "#E2E8F0",
    colorTextSecondary: "#94A3B8",
    colorTextTertiary: "#64748B",
    colorBorder: "#334155",
    colorBorderSecondary: "#1E293B",
    boxShadowSecondary: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  components: {
    ...monceriLightTheme.components,
    Card: {
      borderRadiusLG: 14,
      colorBorderSecondary: "#334155",
      paddingLG: 24,
    },
    Form: {
      itemMarginBottom: 20,
      labelColor: "#CBD5E1",
      labelFontSize: 14,
    },
    Table: {
      borderColor: "#334155",
      headerBg: "#1E293B",
      headerColor: "#CBD5E1",
      rowHoverBg: "#0F172A",
    },
  },
};
