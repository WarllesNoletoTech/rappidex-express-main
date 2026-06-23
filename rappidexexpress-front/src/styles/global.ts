import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    min-width: 0;
    background: ${(props) => props.theme['gray-950']};
  }

  body {
    min-width: 0;
    min-height: 100vh;
    overflow-x: hidden;
    background:
      radial-gradient(circle at top left, rgba(255, 196, 0, 0.12), transparent 28rem),
      linear-gradient(180deg, ${(props) => props.theme['gray-900']} 0%, ${(props) => props.theme['gray-950']} 100%);
    color: ${(props) => props.theme['gray-300']};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body, input, textarea, button, select {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  button, select, input, textarea {
    max-width: 100%;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  a {
    color: inherit;
  }

  img, svg {
    max-width: 100%;
  }

  input, textarea, select {
    color-scheme: dark;
  }

  select {
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, ${(props) => props.theme['gray-300']} 50%),
      linear-gradient(135deg, ${(props) => props.theme['gray-300']} 50%, transparent 50%);
    background-position:
      calc(100% - 1.05rem) 50%,
      calc(100% - 0.75rem) 50%;
    background-size: 0.35rem 0.35rem, 0.35rem 0.35rem;
    background-repeat: no-repeat;
    padding-right: 2.25rem !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  :focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(255, 196, 0, 0.22);
  }

  ::selection {
    background: rgba(255, 196, 0, 0.32);
    color: ${(props) => props.theme.white};
  }

  ::-webkit-scrollbar {
    width: 0.65rem;
    height: 0.65rem;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme['gray-900']};
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme['gray-600']};
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme['gray-500']};
  }
`
