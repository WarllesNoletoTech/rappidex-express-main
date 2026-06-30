import { styled } from 'styled-components'

export const BaseInput = styled.input`
  width: 100%;
  min-height: 2.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${(props) => props.theme['radius-md']};
  background: rgba(18, 18, 20, 0.82);
  padding: 0 0.9rem;
  margin: 0.75rem 0 1rem;
  font-weight: 700;
  color: ${(props) => props.theme['gray-100']};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme['brand-yellow']};
    box-shadow: 0 0 0 3px rgba(255, 196, 0, 0.16);
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-400']};
  }
`

export const ContainerButtons = styled.div`
  width: 100%;
`

export const BaseButton = styled.button`
  width: 100%;
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
  background: ${(props) => props.theme['brand-yellow']};
  color: ${(props) => props.theme.black};
  transition: filter 0.2s ease, transform 0.2s ease, opacity 0.2s ease;

  &:not(:disabled):hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`
