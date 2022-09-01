import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Lato', sans-serif !important;
    font-family: 'Poppins', sans-serif !important;
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
      background: #4283e4;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #0A65FF;
    }

    letter-spacing: 0.01px;
  }

  a {
    text-decoration: none;
  }

  body {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
  }

  div#root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

export default GlobalStyle;
