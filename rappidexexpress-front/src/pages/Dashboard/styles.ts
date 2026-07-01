import styled, { keyframes } from "styled-components";
import { StatusDelivery } from "../../shared/constants/enums.constants";

export const Container = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: clamp(1rem, 3vw, 2rem) 1rem 2rem;

  @media (max-width: 768px) {
    padding: 0 0.75rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem 1rem;
  }
`;

const deliveryGainAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 0.75rem) scale(0.94);
  }

  18%, 72% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -1rem) scale(0.98);
  }
`;

export const DeliveryGainToast = styled.div`
  position: fixed;
  z-index: 1400;
  top: max(1rem, env(safe-area-inset-top));
  left: 50%;
  min-width: min(14rem, calc(100vw - 2rem));
  padding: 0.85rem 1.25rem;
  border: 1px solid #22c55e;
  border-radius: 999px;
  background: rgba(18, 18, 20, 0.94);
  box-shadow: 0 0.75rem 2rem rgba(34, 197, 94, 0.2);
  color: #22c55e;
  font-size: clamp(1.25rem, 5vw, 1.65rem);
  font-weight: 900;
  line-height: 1;
  text-align: center;
  pointer-events: none;
  animation: ${deliveryGainAnimation} 2.8s ease-out forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const ContainerButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  width: min(100%, 1200px);
  margin-bottom: 0.85rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    align-items: stretch;
    justify-content: stretch;
    gap: 0.55rem;
  }

  @media (max-width: 480px) {
    gap: 0.45rem;
  }
`;

export const ShopkeeperCreditsContainer = styled.div`
  width: min(100%, 1200px);
  background: linear-gradient(
    145deg,
    ${(props) => props.theme["gray-700"]},
    ${(props) => props.theme["gray-800"]}
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.theme["radius-lg"]};
  box-shadow: ${(props) => props.theme["shadow-soft"]};
  padding: 1rem;
  margin: 0.5rem 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ShopkeeperCreditsHistory = styled.div`
  max-height: 12rem;
  overflow-y: auto;
  border-top: 1px solid ${(props) => props.theme["gray-500"]};
  padding-top: 0.5rem;
  font-size: 0.875rem;
`;

export const ShopkeeperCreditsHistoryItem = styled.div`
  padding: 0.4rem 0;
  border-bottom: 1px solid ${(props) => props.theme["gray-600"]};
`;

export const ShopkeeperCreditsToggleButton = styled.button`
  background: ${(props) => props.theme["gray-500"]};
  color: ${(props) => props.theme["gray-100"]};
  border: 0;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.55rem 0.8rem;
  width: fit-content;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    filter: brightness(1.1);
  }
`;

interface ButtonProps {
  typeReport: boolean;
}

export const BaseButton = styled.div<ButtonProps>`
  flex: 1 1 12rem;
  box-sizing: border-box;
  min-height: 3rem;
  background: ${(props) =>
    props.typeReport ? props.theme["brand-yellow"] : props.theme["gray-700"]};

  border: 1px solid
    ${(props) =>
      props.typeReport
        ? props.theme["brand-yellow"]
        : "rgba(255, 255, 255, 0.08)"};
  padding: 0.75rem 1rem;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  color: ${(props) =>
    props.typeReport ? props.theme.black : props.theme["gray-300"]};

  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme["brand-yellow"]};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 0.55rem);
    min-width: min(100%, 11rem);
    white-space: normal;
    text-align: center;
  }

  @media (max-width: 480px) {
    flex-basis: 100%;
    min-width: 0;
    width: 100%;
    padding: 0.85rem;
    font-size: 0.95rem;
  }
`;

export const ContainerDeliveries = styled.div`
  background: rgba(28, 28, 28, 0.82);
  width: min(100%, 1200px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${(props) => props.theme["radius-xl"]};
  box-shadow: ${(props) => props.theme["shadow-card"]};
  padding: 0.4rem;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    width: min(100%, 950px);
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0.875rem;
  }

  @media (max-width: 480px) {
    border-radius: 0.75rem;
  }
`;

interface DeliveryProps {
  isfree: boolean;
  isIfood?: boolean;
}

export const Delivery = styled.div<DeliveryProps>`
  background: ${(props) =>
    `linear-gradient(145deg, ${props.theme["gray-700"]}, ${props.theme["gray-800"]})`};
  border: 1px solid
    ${(props) =>
      props.isfree ? props.theme["brand-yellow"] : "rgba(255, 255, 255, 0.08)"};
  box-shadow: 0 0.9rem 1.8rem rgba(0, 0, 0, 0.22);
  padding: 1.125rem;
  margin: 0.45rem auto;
  border-radius: ${(props) => props.theme["radius-lg"]};
  box-sizing: border-box;
  width: calc(100% - 1rem);
  max-width: 620px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.4rem auto;
    width: calc(100% - 0.9rem);
    max-width: calc(100% - 0.9rem);
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    margin: 0.3rem auto;
    border-radius: 8px;
    width: calc(100% - 0.6rem);
    max-width: calc(100% - 0.6rem);
  }
`;

export const Link = styled.a`
  display: flex;
  gap: 0.2rem;
  text-decoration: none;
  color: ${(props) => props.theme["gray-300"]};
  font-weight: bold;
  width: fit-content;
  max-width: 100%;
  flex-wrap: wrap;
`;

export const ContainerShopkeeper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;

  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

export const ShopkeeperProfileImage = styled.img`
  height: 4.75rem;
  width: 4.75rem;
  border-radius: 100%;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 480px) {
    height: 4rem;
    width: 4rem;
  }
`;

export const ContainerImagem = styled.div`
  height: 4.75rem;
  width: 4.75rem;
  border-radius: 100%;
  border: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    height: 4rem;
    width: 4rem;
  }
`;

export const IfoodStoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 0.35rem;
  padding: 0.2rem 0.48rem;
  border-radius: 999px;
  background: ${(props) => props.theme["brand-yellow-dark"]};
  color: ${(props) => props.theme.black};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const ShopkeeperInfo = styled.div`
  min-width: 0;
  flex: 1;
  max-width: 100%;
  padding: 0.6rem 0.7rem;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  > p:first-of-type {
    margin: 0 0 0.35rem;
    color: ${(props) => props.theme["gray-100"]};
    font-size: 1.08rem;
    font-weight: 800;
    line-height: 1.2;
  }

  p,
  span,
  a {
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  a {
    align-items: center;
    margin-top: 0.18rem;
    padding: 0.28rem 0.48rem;
    font-size: 0.9rem;
    border-radius: 999px;
    background: ${(props) => props.theme["gray-600"]};
    transition:
      filter 0.2s ease,
      transform 0.2s ease;
  }

  a:hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }
`;

export const ContainerOrder = styled.div`
  margin: 0.65rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  max-width: 100%;
  min-width: 0;
  padding: 0.7rem;
  border-radius: 0.8rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.055),
    rgba(255, 255, 255, 0.028)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);

  @media (max-width: 480px) {
    margin: 0.55rem 0 0;
    padding: 0.65rem;
  }
`;

export const ContainerInfo = styled.div`
  margin: 0.65rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  max-width: 100%;
  min-width: 0;
  padding: 0.7rem;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  p {
    margin: 0;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  a {
    width: fit-content;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    margin: 0.55rem 0 0;
    padding: 0.65rem;
  }
`;

interface InfoSectionProps {
  $variant?: "main" | "operational";
}

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${(props) => props.theme["gray-100"]};
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const InfoSection = styled.div<InfoSectionProps>`
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  max-width: 100%;
  min-width: 0;
  padding-top: ${(props) =>
    props.$variant === "operational" ? "0.55rem" : "0"};
  border-top: ${(props) =>
    props.$variant === "operational"
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "0"};
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: minmax(82px, 102px) minmax(0, 1fr);
  align-items: start;
  column-gap: 0.6rem;
  row-gap: 0.25rem;
  max-width: 100%;
  min-width: 0;

  @media (max-width: 480px) {
    grid-template-columns: minmax(82px, 96px) minmax(0, 1fr);
    column-gap: 0.55rem;
  }
`;

export const InfoLabel = styled.span`
  color: ${(props) => props.theme["gray-300"]};
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.035em;
  text-transform: uppercase;
  opacity: 0.82;
  padding-top: 0.08rem;
`;

export const InfoValue = styled.span`
  color: ${(props) => props.theme["gray-100"]};
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;

  a {
    margin-top: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.88rem;
  }
`;

export const IfoodSodaWarning = styled.span`
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;

  @media (max-width: 480px) {
    font-size: 0.84rem;
  }
`;

export const OperationalPanel = styled.div`
  margin: 0.65rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: 100%;
  min-width: 0;
  padding: 0.7rem;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  @media (max-width: 480px) {
    margin: 0.55rem 0 0;
    padding: 0.65rem;
    gap: 0.55rem;
  }
`;

export const OrderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  width: min(100%, 1200px);
  margin-bottom: 0.85rem;
  padding-top: 0.15rem;
`;

interface OrderProps {
  typebutton: boolean;
}

export const OrderButton = styled.div<OrderProps>`
  min-height: 2.35rem;
  min-width: 6.4rem;
  background: ${(props) =>
    props.typebutton ? props.theme["brand-yellow"] : props.theme["red-700"]};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.55rem 0.8rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-weight: 800;
  color: ${(props) => props.theme["gray-100"]};
  font-size: 0.92rem;
  line-height: 1.2;

  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 0.45rem 1rem rgba(0, 0, 0, 0.16);

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: 0;
    padding: 0.7rem;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.45rem;
  max-width: 100%;
  min-width: 0;

  label {
    color: ${(props) => props.theme["gray-300"]};
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: 0.045em;
    text-transform: uppercase;
    opacity: 0.86;
  }

  select,
  input {
    height: 2.4rem;
    background: rgba(39, 39, 42, 0.82);
    color: ${(props) => props.theme["gray-100"]};
    width: min(100%, 34rem);
    max-width: 100%;
    min-width: 0;
    white-space: normal;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 0.7rem;
    padding: 0 0.7rem;
    outline: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
  }

  select:focus,
  input:focus {
    border-color: ${(props) => props.theme["brand-yellow"]};
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14);
  }

  select:disabled,
  input:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }

  @media (max-width: 480px) {
    select,
    input {
      width: 100%;
      height: 2.55rem;
      font-size: 0.95rem;
    }
  }
`;

export const ContainerLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerStatus = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  width: min(100%, 1200px);
  margin-bottom: 0.85rem;
  max-width: 100%;
`;

interface StatusProps {
  type: string;
}

export const Status = styled.p<StatusProps>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  margin: 0;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  background-color: ${(props) =>
    props.type === StatusDelivery.ONCOURSE
      ? "rgba(37, 99, 235, 0.92)"
      : props.theme["brand-yellow-dark"]};
  color: ${(props) =>
    props.type === StatusDelivery.ONCOURSE
      ? props.theme.white
      : props.theme.black};
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

export const Flag = styled.p`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.45rem;
  height: 1.45rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: ${(props) => props.theme["brand-yellow-dark"]};
  color: ${(props) => props.theme.black};
  font-size: 0.78rem;
  font-weight: 900;
  text-align: center;
`;

export const PerformanceCard = styled.button`
  width: min(100%, 1200px);
  margin: 0.5rem 0 1rem;
  padding: 1rem 1.15rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${(props) => props.theme["brand-yellow"]};
  border-radius: ${(props) => props.theme["radius-lg"]};
  background: linear-gradient(
    145deg,
    ${(props) => props.theme["gray-700"]},
    ${(props) => props.theme["gray-800"]}
  );
  box-shadow: ${(props) => props.theme["shadow-soft"]};
  color: ${(props) => props.theme["gray-100"]};
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  > svg {
    flex-shrink: 0;
    color: ${(props) => props.theme["brand-yellow"]};
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-1px);
    box-shadow: ${(props) => props.theme["shadow-card"]};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme["brand-yellow"]};
    outline-offset: 3px;
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.9rem;
  }
`;

export const ClosedWeekSettlementCard = styled.div`
  width: min(100%, 1200px);
  margin: 0.5rem 0 0.75rem;
  padding: 1rem 1.15rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${(props) => props.theme["brand-yellow"]};
  border-radius: ${(props) => props.theme["radius-lg"]};
  background: linear-gradient(
    145deg,
    ${(props) => props.theme["gray-700"]},
    ${(props) => props.theme["gray-800"]}
  );
  box-shadow: ${(props) => props.theme["shadow-soft"]};
  color: ${(props) => props.theme["gray-100"]};
  overflow-x: hidden;

  > svg {
    flex-shrink: 0;
    color: ${(props) => props.theme["brand-yellow"]};
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.9rem;
  }
`;

export const SettlementDetails = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
  color: ${(props) => props.theme["gray-300"]};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const SettlementMessage = styled.span`
  color: ${(props) => props.theme["gray-400"]};
  font-size: 0.78rem;
  font-weight: 700;
`;

export const PerformanceMetrics = styled.span`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1.5rem;
  min-width: 0;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`;

export const PerformanceMetric = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  color: ${(props) => props.theme["gray-300"]};
  font-size: 0.82rem;
  font-weight: 700;

  strong {
    color: ${(props) => props.theme["gray-100"]};
    font-size: 1.35rem;
    overflow-wrap: anywhere;
  }
`;

export const PerformanceValue = styled.strong`
  color: ${(props) => props.theme["brand-yellow"]} !important;
`;

export const PerformanceHint = styled.span`
  flex-shrink: 0;
  color: ${(props) => props.theme["gray-400"]};
  font-size: 0.72rem;
  font-weight: 600;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const AdminFinancialCard = styled.div`
  width: min(100%, 1200px);
  max-width: 100%;
  box-sizing: border-box;
  margin: 0.5rem 0 1rem;
  padding: 1rem 1.15rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${(props) => props.theme["brand-yellow"]};
  border-radius: ${(props) => props.theme["radius-lg"]};
  background: linear-gradient(
    145deg,
    ${(props) => props.theme["gray-700"]},
    ${(props) => props.theme["gray-800"]}
  );
  box-shadow: ${(props) => props.theme["shadow-soft"]};
  color: ${(props) => props.theme["gray-100"]};
  overflow-x: hidden;

  > svg {
    flex-shrink: 0;
    color: ${(props) => props.theme["brand-yellow"]};
  }

  ${PerformanceMetrics} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    overflow: hidden;

    > svg {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 1.25rem;
      height: 1.25rem;
      opacity: 0.85;
    }

    ${PerformanceMetrics} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding-right: 2rem;
      box-sizing: border-box;
    }
  }

  @media (max-width: 480px) {
    gap: 0.85rem;
    padding: 0.85rem;
    border-radius: 0.875rem;

    ${PerformanceMetrics} {
      grid-template-columns: 1fr;
      gap: 0.65rem;
      padding-right: 1.75rem;
    }

    ${PerformanceMetric} {
      font-size: 0.78rem;

      strong {
        font-size: 1.18rem;
      }
    }
  }
`;

export const AdminFilters = styled.div`
  width: 100%;
  flex-shrink: 1;
  display: flex;
  align-items: end;
  gap: 0.75rem;
  flex-wrap: wrap;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    color: ${(props) => props.theme["gray-300"]};
    font-size: 0.75rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;

    label {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
  }

  @media (max-width: 480px) {
    gap: 0.55rem;

    label {
      font-size: 0.72rem;
    }
  }
`;

const AdminFilterControl = styled.input`
  min-width: 10rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${(props) => props.theme["radius-sm"]};
  background: ${(props) => props.theme["gray-900"]};
  color: ${(props) => props.theme["gray-100"]};
  padding: 0.7rem 0.8rem;
  font-weight: 700;
  font-size: 0.95rem;
  color-scheme: dark;

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    min-height: 2.85rem;
  }

  @media (max-width: 480px) {
    min-width: 0;
    width: 100%;
    max-width: 100%;
    padding: 0.75rem 0.8rem;
    font-size: 0.9rem;
  }
`;

export const AdminDateInput = styled(AdminFilterControl)``;

export const AdminCitySelect = styled.select`
  flex-shrink: 0;
  min-width: 13rem;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${(props) => props.theme["radius-sm"]};
  background: ${(props) => props.theme["gray-900"]};
  color: ${(props) => props.theme["gray-100"]};
  padding: 0.7rem 0.8rem;
  font-weight: 700;
  font-size: 0.95rem;
  z-index: 2;

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    min-height: 2.85rem;
  }

  @media (max-width: 480px) {
    min-width: 0;
    width: 100%;
    max-width: 100%;
    padding: 0.75rem 0.8rem;
    font-size: 0.9rem;
  }
`;
