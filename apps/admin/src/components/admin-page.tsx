import { Button, Empty, Space, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AdminPageHeaderProps = {
  actions?: ReactNode;
  subtitle?: ReactNode;
  title: string;
};

export function AdminPageHeader({ actions, subtitle, title }: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <Space align="start" style={{ justifyContent: "space-between", width: "100%" }} wrap>
        <div>
          <Typography.Title className="admin-page-title font-display" level={1}>
            {title}
          </Typography.Title>
          {subtitle ? <Typography.Text type="secondary">{subtitle}</Typography.Text> : null}
        </div>
        {actions ? <div className="admin-responsive-actions">{actions}</div> : null}
      </Space>
    </div>
  );
}

type AdminEmptyStateProps = {
  actionHref?: string;
  actionLabel?: string;
  description: string;
};

export function AdminEmptyState({ actionHref, actionLabel, description }: AdminEmptyStateProps) {
  return (
    <Empty
      description={description}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      style={{ marginBlock: 40 }}
    >
      {actionHref && actionLabel ? (
        <Link to={actionHref}>
          <Button type="primary">{actionLabel}</Button>
        </Link>
      ) : null}
    </Empty>
  );
}
