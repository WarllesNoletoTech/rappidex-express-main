import styled from 'styled-components'

export const Container = styled.main`
  flex: 1;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;

  form {
    width: min(100%, 25rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(1.25rem, 4vw, 2rem);
    border-radius: ${(props) => props.theme['radius-xl']};
    background: linear-gradient(145deg, ${(props) => props.theme['gray-800']}, ${(props) => props.theme['gray-900']});
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: ${(props) => props.theme['shadow-card']};
  }
`

export const BaseButton = styled.button`
  width: 100%;
  min-height: 2.9rem;
  border: 0;
  padding: 0.85rem 1rem;
  margin-top: 1rem;
  border-radius: ${(props) => props.theme['radius-md']};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.black};
  background: ${(props) => props.theme['brand-yellow']};
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease, opacity 0.2s ease;

  &:not(:disabled):hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
  }
`

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme['gray-100']};
  gap: 0.85rem;
`

export const BaseInput = styled.input`
  width: 100%;
  min-height: 2.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${(props) => props.theme['radius-md']};
  background: rgba(18, 18, 20, 0.82);
  padding: 0 0.9rem;
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

export const Logo = styled.img`
  height: 7rem;
  width: 7rem;
  border-radius: 100%;
  margin-bottom: 1.5rem;
  object-fit: cover;
  box-shadow: 0 0 0 0.5rem rgba(255, 196, 0, 0.08);
`
