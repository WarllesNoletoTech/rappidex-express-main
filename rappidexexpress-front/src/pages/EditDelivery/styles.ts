import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem) 1rem 2rem;
`

export const DeliveryContainer = styled.div`
  width: min(100%, 42rem);
  background: linear-gradient(145deg, ${(props) => props.theme['gray-700']}, ${(props) => props.theme['gray-800']});
  padding: clamp(0.75rem, 2vw, 1.25rem);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.theme['radius-xl']};
  box-shadow: ${(props) => props.theme['shadow-card']};
`

export const Delivery = styled.div`
  background: rgba(255, 255, 255, 0.035);
  padding: clamp(0.9rem, 2vw, 1.1rem);
  border-radius: ${(props) => props.theme['radius-lg']};
  border: 1px solid rgba(255, 255, 255, 0.07);
`

export const ContainerShopkeeper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;

  @media (max-width: 520px) {
    align-items: flex-start;
  }
`

export const ShopkeeperProfileImage = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 100%;
  object-fit: cover;
`

export const ProfileImageContainer = styled.div`
  height: 5rem;
  width: 5rem;
  border-radius: 100%;
  border: 2px solid rgba(255, 196, 0, 0.28);
  background: ${(props) => props.theme['gray-800']};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`

export const ShopkeeperInfo = styled.div`
  min-width: 0;

  p {
    color: ${(props) => props.theme.white};
    font-weight: 800;
    font-size: 1.1rem;
    overflow-wrap: anywhere;
  }
`

export const ContainerOrder = styled.div`
  margin: 1rem 0 0;
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem;
  border-radius: ${(props) => props.theme['radius-md']};
  background: rgba(18, 18, 20, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.07);

  p {
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
`

export const ContainerInfo = styled.div`
  margin: 0.85rem 0 0;

  label {
    color: ${(props) => props.theme['gray-300']};
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  select {
    width: 100%;
    min-height: 2.85rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: ${(props) => props.theme['radius-md']};
    background-color: ${(props) => props.theme['gray-800']};
    color: ${(props) => props.theme['gray-100']};
    padding: 0 0.9rem;

    &:focus {
      border-color: ${(props) => props.theme['brand-yellow']};
      box-shadow: 0 0 0 3px rgba(255, 196, 0, 0.16);
    }
  }
`

export const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
`

export const SaveButton = styled.button`
  width: min(100%, 12rem);
  min-height: 2.9rem;
  border: 0;
  padding: 0.85rem 1rem;
  border-radius: ${(props) => props.theme['radius-md']};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 800;
  cursor: pointer;
  background: ${(props) => props.theme['yellow-500']};
  color: ${(props) => props.theme['gray-900']};
  transition: filter 0.2s ease, transform 0.2s ease;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`
