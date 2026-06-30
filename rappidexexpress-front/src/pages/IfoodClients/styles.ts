import styled from 'styled-components';

type StoreStatusBadgeProps = {
  $isActive: boolean;
};

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: grid;
  align-items: start;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem) 1rem 2rem;
`;

export const Content = styled.div`
  width: min(72rem, 100%);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme['gray-100']};
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  color: ${(props) => props.theme['gray-300']};
  font-size: 0.92rem;
  line-height: 1.45;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

export const Card = styled.div`
  background: linear-gradient(
    145deg,
    ${(props) => props.theme['gray-600']} 0%,
    ${(props) => props.theme['gray-700']} 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(props) => props.theme['radius-xl']};
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0;

  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
`;

export const ShopkeeperName = styled.strong`
  color: ${(props) => props.theme.white};
  display: block;
  font-size: 1.25rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ToggleGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const Checkbox = styled.label`
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  color: ${(props) => props.theme['gray-100']};
  cursor: pointer;
  display: flex;
  font-weight: 600;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;

  input {
    accent-color: ${(props) => props.theme['brand-yellow-hover']};
  }
`;

export const MerchantIdLabel = styled.label`
  color: ${(props) => props.theme['gray-100']};
  display: block;
  font-weight: 700;
  margin-bottom: 0.35rem;
`;

export const FieldLabel = styled.label`
  color: ${(props) => props.theme['gray-300']};
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const FieldGroup = styled.div`
  min-width: 0;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid transparent;
  border-radius: ${(props) => props.theme['radius-md']};
  background: ${(props) => props.theme['gray-800']};
  color: ${(props) => props.theme['gray-100']};
  padding: 0.85rem 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s;

  &::placeholder {
    color: ${(props) => props.theme['gray-400']};
  }

  &:focus {
    border-color: ${(props) => props.theme['brand-yellow']};
    box-shadow: 0 0 0 3px rgba(255, 196, 0, 0.16);
    outline: 0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }
`;

export const SearchInput = styled(Input)`
  background: ${(props) => props.theme['gray-600']};
  border-color: rgba(255, 255, 255, 0.06);
`;

export const SaveButton = styled.button`
  align-self: flex-start;
  border: 0;
  border-radius: ${(props) => props.theme['radius-md']};
  background: ${(props) => props.theme['brand-yellow-dark']};
  color: ${(props) => props.theme.black};
  font-weight: 700;
  min-width: 6.5rem;
  padding: 0.8rem 1.15rem;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s, opacity 0.2s;

  &:not(:disabled):hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.8;
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const StoreSection = styled.section`
  background: rgba(18, 18, 20, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(props) => props.theme['radius-lg']};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

export const StoreSectionHeader = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

export const StoreList = styled.div`
  display: grid;
  gap: 0.9rem;
`;

export const StoreCard = styled.article`
  background: ${(props) => props.theme['gray-700']};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.theme['radius-lg']};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1rem;
`;

export const StoreCardHeader = styled.header`
  align-items: flex-start;
  display: flex;
  gap: 0.85rem;
  justify-content: space-between;

  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

export const StoreTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`;

export const StoreName = styled.strong`
  color: ${(props) => props.theme.white};
  font-size: 1.12rem;
  line-height: 1.3;
  word-break: break-word;
`;

export const StoreStatusBadge = styled.span<StoreStatusBadgeProps>`
  align-items: center;
  background: ${(props) =>
    props.$isActive ? 'rgba(255, 196, 0, 0.16)' : 'rgba(124, 124, 138, 0.18)'};
  border: 1px solid
    ${(props) =>
    props.$isActive ? 'rgba(255, 196, 0, 0.34)' : 'rgba(124, 124, 138, 0.32)'};
  border-radius: 999px;
  color: ${(props) => props.$isActive ? props.theme['brand-yellow-hover'] : props.theme['gray-300']};
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 800;
  justify-content: center;
  letter-spacing: 0.04em;
  padding: 0.35rem 0.65rem;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const StoreFieldsGrid = styled.div`
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${FieldGroup}:last-child {
    grid-column: 1 / -1;
  }

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

export const LocationPreview = styled.span`
  min-width: 0;
  color: ${(props) => props.theme['gray-300']};
  display: block;
  font-size: 0.84rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

export const LocationLink = styled.a`
  align-self: flex-start;
  background: rgba(255, 196, 0, 0.12);
  border: 1px solid rgba(255, 196, 0, 0.28);
  border-radius: 999px;
  color: ${(props) => props.theme['brand-yellow-hover']};
  font-size: 0.84rem;
  font-weight: 800;
  padding: 0.4rem 0.7rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 196, 0, 0.2);
    transform: translateY(-1px);
  }
`;

export const StoreActions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: space-between;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const CreditSummary = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const CreditLine = styled.span`
  background: ${(props) => props.theme['gray-800']};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  color: ${(props) => props.theme['gray-300']};
  padding: 0.45rem 0.7rem;
  font-size: 0.85rem;
`;

export const CreditButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const CreditInput = styled(Input)`
  max-width: 9rem;
`;

export const CreditButton = styled.button`
  border: 0;
  border-radius: ${(props) => props.theme['radius-md']};
  background: ${(props) => props.theme['brand-yellow-dark']};
  color: ${(props) => props.theme.black};
  font-weight: 700;
  padding: 0.7rem 0.9rem;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s, opacity 0.2s;

  &:not(:disabled):hover {
    filter: brightness(1.12);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const HistoryButton = styled.button`
  border: 0;
  border-radius: ${(props) => props.theme['radius-md']};
  background: ${(props) => props.theme['gray-500']};
  color: ${(props) => props.theme['gray-100']};
  font-weight: 700;
  padding: 0.7rem 0.9rem;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s, opacity 0.2s;

  &:not(:disabled):hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`;

export const HistoryList = styled.ul`
  margin: 0 1.25rem 1.25rem;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const HistoryItem = styled.li`
  color: ${(props) => props.theme['gray-300']};
  font-size: 0.85rem;
`;

export const LoadMoreButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: ${(props) => props.theme['radius-md']};
  background: ${(props) => props.theme['gray-500']};
  color: ${(props) => props.theme['gray-100']};
  font-weight: 700;
  padding: 0.85rem 1rem;
  cursor: pointer;
`;

export const EmptyState = styled.p`
  background: ${(props) => props.theme['gray-600']};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: ${(props) => props.theme['gray-300']};
  text-align: center;
  padding: 1.25rem;
`;
