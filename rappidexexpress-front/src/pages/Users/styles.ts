import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem) 1rem 2rem;
`

export const Content = styled.div`
  width: min(100%, 56rem);
`

export const HeaderFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
`

interface FilterProps {
  isSelected: boolean
}

export const Filter = styled.div<FilterProps>`
  flex: 1 1 10rem;
  min-height: 2.9rem;
  border: 1px solid ${(props) => props.isSelected ? props.theme['brand-yellow'] : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.75rem 1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 800;
  cursor: pointer;
  background: ${(props) => props.isSelected ? 'rgba(255, 196, 0, 0.18)' : props.theme['gray-700']};
  color: ${(props) => props.isSelected ? props.theme['brand-yellow-hover'] : props.theme['gray-300']};
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(props) => props.theme['brand-yellow']};
  }
`

export const ContainerLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

export const UsersContainer = styled.div`
  display: grid;
  gap: 0.85rem;
`

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.95rem;
  border-radius: ${(props) => props.theme['radius-lg']};
  cursor: pointer;
  background: linear-gradient(145deg, ${(props) => props.theme['gray-700']}, ${(props) => props.theme['gray-800']});
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: ${(props) => props.theme['shadow-soft']};
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(255, 196, 0, 0.35);
    transform: translateY(-1px);
  }
`

export const ContainerProfileImage = styled.div`
  height: 4.75rem;
  width: 4.75rem;
  border-radius: 100%;
  border: 2px solid rgba(255, 196, 0, 0.22);
  background: ${(props) => props.theme['gray-800']};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 520px) {
    height: 4rem;
    width: 4rem;
  }
`

export const ProfileImage = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 100%;
  object-fit: cover;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`

export const Username = styled.p`
  font-weight: 800;
  color: ${(props) => props.theme['gray-100']};
  overflow-wrap: anywhere;
`

export const LoadMoreButton = styled.button`
  width: 100%;
  min-height: 2.9rem;
  border: 0;
  padding: 0.85rem 1rem;
  margin-top: 1rem;
  border-radius: ${(props) => props.theme['radius-md']};
  font-weight: 800;
  cursor: pointer;
  color: ${(props) => props.theme.black};
  background: ${(props) => props.theme['brand-yellow']};
  transition: filter 0.2s ease, transform 0.2s ease;

  &:not(:disabled):hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`


export const BlockedBadge = styled.span`
  width: fit-content;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
  font-size: 0.78rem;
  font-weight: 800;
`

export const BlockedReason = styled.p`
  color: ${(props) => props.theme['gray-300']};
  font-size: 0.9rem;
`

export const UnblockButton = styled.button`
  width: fit-content;
  border: 0;
  border-radius: ${(props) => props.theme['radius-sm']};
  padding: 0.45rem 0.7rem;
  background: ${(props) => props.theme['brand-yellow']};
  color: ${(props) => props.theme.black};
  cursor: pointer;
  font-weight: 800;

  &:hover {
    filter: brightness(1.1);
  }
`
