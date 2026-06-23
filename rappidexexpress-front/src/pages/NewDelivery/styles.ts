import styled from 'styled-components'
import InputMask from 'react-input-mask'

export const Container = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(1rem, 3vw, 2rem) 1rem 2rem;

  form {
    width: min(100%, 34rem);
  }
`

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: clamp(1rem, 3vw, 1.5rem);
  color: ${(props) => props.theme['gray-100']};
  background: linear-gradient(145deg, ${(props) => props.theme['gray-700']}, ${(props) => props.theme['gray-800']});
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.theme['radius-xl']};
  box-shadow: ${(props) => props.theme['shadow-card']};

  label {
    margin-top: 0.25rem;
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
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &:focus {
      border-color: ${(props) => props.theme['brand-yellow']};
      box-shadow: 0 0 0 3px rgba(255, 196, 0, 0.16);
    }
  }
`

const fieldStyles = `
  width: 100%;
  min-height: 2.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  background: rgba(18, 18, 20, 0.82);
  padding: 0 0.9rem;
  font-weight: 700;
  color: #E1E1E6;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:focus {
    border-color: #FFC400;
    box-shadow: 0 0 0 3px rgba(255, 196, 0, 0.16);
  }

  &::placeholder {
    color: #8D8D99;
  }
`

export const BaseInput = styled.input`
  ${fieldStyles}
`

export const ContainerButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
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
  box-shadow: 0 0.75rem 1.5rem rgba(255, 196, 0, 0.2);
  transition: filter 0.2s ease, transform 0.2s ease, opacity 0.2s ease;

  &:not(:disabled):hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.56;
    cursor: not-allowed;
    box-shadow: none;
  }
`

export const BaseInputMask = styled(InputMask)`
  ${fieldStyles}
`
