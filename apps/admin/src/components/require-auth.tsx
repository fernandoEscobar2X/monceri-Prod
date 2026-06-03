import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authProvider } from "@/providers/auth-provider";

export function RequireAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    authProvider.check().then((result) => {
      if (mounted) {
        setAuthenticated(result.authenticated);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (authenticated === null) {
    return (
      <div style={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}
