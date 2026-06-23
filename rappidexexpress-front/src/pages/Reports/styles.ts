import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem) 1rem 2rem;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
`;

export const PageHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 100%;

    h1 {
      color: ${(props) => props.theme["gray-100"]};
      font-size: 1.5rem;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }
  }
`;

export const FiltersContainer = styled.div`
  width: min(100%, 64rem);
  max-width: 100%;
  padding: clamp(1rem, 3vw, 1.4rem);
  background: linear-gradient(
    145deg,
    ${(props) => props.theme["gray-700"]},
    ${(props) => props.theme["gray-800"]}
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.theme["radius-xl"]};
  box-shadow: ${(props) => props.theme["shadow-card"]};

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding: 1rem;
  }
`;

export const DataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;

  form {
    max-width: 100%;
  }

  input {
    min-height: 2.75rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: ${(props) => props.theme["radius-md"]};
    background: ${(props) => props.theme["gray-800"]};
    color: ${(props) => props.theme["gray-100"]};
    padding: 0 0.75rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    form {
      width: 100%;
    }

    label {
      display: block;
      margin-bottom: 0.35rem;
    }

    input {
      width: 100%;
      max-width: 100%;
    }
  }
`;

export const Filter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  align-items: center;

  select {
    min-height: 2.75rem;
    min-width: 12rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: ${(props) => props.theme["radius-md"]};
    background-color: ${(props) => props.theme["gray-800"]};
    color: ${(props) => props.theme["gray-100"]};
    padding: 0 0.75rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    p {
      width: 100%;
    }

    select {
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }
  }
`;

export const SearchButton = styled.div`
  max-width: 100%;
  background: ${(props) => props.theme["brand-yellow"]};
  color: ${(props) => props.theme.black};
  min-height: 2.9rem;
  padding: 0.85rem 1rem;
  margin-top: 1rem;
  border-radius: ${(props) => props.theme["radius-md"]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const ReportsContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin-top: 1rem;
  background: rgba(18, 18, 20, 0.36);
  padding: 0.75rem;
  border-radius: ${(props) => props.theme["radius-lg"]};
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow-x: hidden;

  h3 {
    color: ${(props) => props.theme["gray-100"]};
    overflow-wrap: anywhere;
  }

  @media (max-width: 768px) {
    margin-top: 0;
    padding: 0;
    background: transparent;
    border: 0;
  }
`;

export const Delivery = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  background: ${(props) => props.theme["gray-700"]};
  padding: 1rem;
  margin: 0.65rem 0;
  border-radius: ${(props) => props.theme["radius-lg"]};
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: ${(props) => props.theme["shadow-soft"]};
  overflow-x: hidden;

  @media (max-width: 768px) {
    margin: 0.75rem 0;
  }
`;

export const ContainerShopkeeper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
  max-width: 100%;
`;

export const ShopkeeperProfileImage = styled.img`
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 100%;
  object-fit: cover;
`;

export const ProfileImageContainer = styled.div`
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 100%;
  border: 2px solid rgba(255, 196, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

export const ShopkeeperInfo = styled.div`
  min-width: 0;

  p {
    overflow-wrap: anywhere;
  }
`;

export const ContainerOrder = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0.85rem 0 0;
  padding: 0.85rem;
  border-radius: ${(props) => props.theme["radius-md"]};
  background: rgba(255, 255, 255, 0.035);

  p {
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
`;

export const ContainerInfo = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0.85rem 0 0;

  p {
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
`;

export const EditContainer = styled.div`
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.85rem;
`;

export const OnClickLink = styled(Link)`
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.45rem;
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  color: ${(props) => props.theme["gray-100"]};
  background: ${(props) => props.theme["gray-600"]};
  text-decoration: none;
  font-weight: 800;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

export const SettlementSummary = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: ${(props) => props.theme["radius-lg"]};
  border: 1px solid rgba(255, 196, 0, 0.28);
  background: rgba(255, 196, 0, 0.08);

  strong {
    display: block;
    color: ${(props) => props.theme["gray-100"]};
    margin-bottom: 0.35rem;
  }

  p {
    color: ${(props) => props.theme["gray-300"]};
    line-height: 1.45;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.85rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface ActionButtonProps {
  $variant?: "primary" | "secondary" | "whatsapp";
}

export const ActionButton = styled.button<ActionButtonProps>`
  min-height: 2.75rem;
  border: 0;
  border-radius: ${(props) => props.theme["radius-md"]};
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.white};
  background: ${(props) => {
    if (props.$variant === "whatsapp") return "#25d366";
    if (props.$variant === "secondary") return props.theme["gray-600"];
    return props.theme["brand-yellow"];
  }};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
`;

interface SettlementFeedbackProps {
  $type: "success" | "error";
}

export const SettlementFeedback = styled.div<SettlementFeedbackProps>`
  margin-top: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: ${(props) => props.theme["radius-md"]};
  border: 1px solid
    ${(props) =>
      props.$type === "success"
        ? "rgba(255, 196, 0, 0.35)"
        : "rgba(239, 68, 68, 0.45)"};
  background: ${(props) =>
    props.$type === "success"
      ? "rgba(255, 196, 0, 0.12)"
      : "rgba(239, 68, 68, 0.14)"};
  color: ${(props) => props.theme["gray-100"]};
  line-height: 1.45;
  overflow-wrap: anywhere;
`;
