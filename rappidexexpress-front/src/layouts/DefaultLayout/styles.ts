import styled from 'styled-components'

export const LayoutContainer = styled.div`
  width: min(100% - 1rem, 90rem);
  min-height: calc(100vh - 1rem);
  margin: 0.5rem auto;
  padding: clamp(0.75rem, 2vw, 1.25rem);

  background: rgba(28, 28, 28, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${(props) => props.theme['radius-lg']};
  box-shadow: ${(props) => props.theme['shadow-card']};
  backdrop-filter: blur(14px);

  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
  }
`
