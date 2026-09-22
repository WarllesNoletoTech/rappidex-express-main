import { lazy, Suspense, useContext } from "react";
import type { ComponentType } from "react";
import { Routes, Route } from "react-router-dom";

import { DeliveryContext } from "./context/DeliveryContext";

import { DefaultLayout } from "./layouts/DefaultLayout";

const lazyPage = <T extends Record<string, unknown>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K,
) =>
  lazy<ComponentType<Record<string, never>>>(() =>
    loader().then((module) => ({
      default: module[exportName] as ComponentType<Record<string, never>>,
    })),
  );

const Login = lazyPage(() => import("./pages/Login"), "Login");
const Dashboard = lazyPage(() => import("./pages/Dashboard"), "Dashboard");
const Reports = lazyPage(() => import("./pages/Reports"), "Reports");
const Profile = lazyPage(() => import("./pages/Profile"), "Profile");
const NewUser = lazyPage(() => import("./pages/NewUser"), "NewUser");
const ChangePassword = lazyPage(
  () => import("./pages/ChangePassword"),
  "ChangePassword",
);
const NewDelivery = lazyPage(
  () => import("./pages/NewDelivery"),
  "NewDelivery",
);
const EditDelivery = lazyPage(
  () => import("./pages/EditDelivery"),
  "EditDelivery",
);
const Config = lazyPage(() => import("./pages/Config"), "Config");
const Users = lazyPage(() => import("./pages/Users"), "Users");
const Cities = lazyPage(() => import("./pages/Cities"), "Cities");
const IfoodClients = lazyPage(
  () => import("./pages/IfoodClients"),
  "IfoodClients",
);
const TermsOfUse = lazyPage(() => import("./pages/TermsOfUse"), "TermsOfUse");
const PrivacyPolicy = lazyPage(
  () => import("./pages/PrivacyPolicy"),
  "PrivacyPolicy",
);

export function Router() {
  const { token, permission } = useContext(DeliveryContext);
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/termos-de-uso" element={<TermsOfUse />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        {!token ? (
          <Route path="/" element={<Login />} />
        ) : (
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/novo-usuario" element={<NewUser />} />
            <Route path="/novo-usuario/:user" element={<NewUser />} />
            <Route path="/alterar-senha" element={<ChangePassword />} />
            <Route path="/nova-entrega" element={<NewDelivery />} />
            <Route path="/editar-entrega" element={<EditDelivery />} />
            <Route path="/configuracao" element={<Config />} />
            <Route path="/usuarios" element={<Users />} />
            {(permission === "admin" || permission === "superadmin") && (
              <Route path="/clientes-ifood" element={<IfoodClients />} />
            )}
            {(permission === "admin" || permission === "superadmin") && (
              <Route path="/cidades" element={<Cities />} />
            )}
          </Route>
        )}
      </Routes>
    </Suspense>
  );
}
