import { Link } from 'react-router-dom';
import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`

export const FiltersContainer = styled.div`
  padding: 1rem;
`;

export const DataContainer = styled.div`
    margin-top: 1rem;

    input {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        height: 2.5rem;
        background: ${(props) => props.theme['gray-600']};
        color: ${(props) => props.theme['gray-100']};
    }
`;

export const Filter = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    align-items: center;
    
    select {
        margin-left: 1rem;
        height: 2.5rem;
        background: ${(props) => props.theme['gray-600']};
        color: ${(props) => props.theme['gray-100']};
    }
`;

export const SearchButton = styled.div`
    background: ${(props) => props.theme['green-700']};
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 0.5rem;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;

    cursor: pointer;
`;

export const ReportsContainer = styled.div`
    background: ${(props) => props.theme['gray-700']};
    padding: 1rem;
    border-radius: 0.5rem;
`;

export const Delivery = styled.div`
    background-color: ${(props) => props.theme['gray-600']};
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 10px;
`;

export const ContainerShopkeeper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ShopkeeperProfileImage = styled.img`
  height: 6rem;
  width: 6rem;
  border-radius: 100%;
`;

export const ProfileImageContainer = styled.div`
  height: 6rem;
  width: 6rem;
  border-radius: 100%;
  border: solid;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ShopkeeperInfo = styled.div``;

export const ContainerOrder = styled.div`
  margin: 1rem;
`;

export const ContainerInfo = styled.div`
  margin: 1rem;
`;

export const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OnClickLink = styled(Link)`
  color: ${(props) => props.theme['gray-300']};
  text-decoration: none;
<<<<<<< HEAD
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

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0.9rem 0 0;
  color: ${(props) => props.theme["gray-100"]};
  font-weight: 700;

  input {
    width: 1rem;
    height: 1rem;
    accent-color: ${(props) => props.theme["brand-yellow"]};
  }
`;
=======
`;
>>>>>>> parent of 613ac8c (atualização front)
