import React from 'react';
import TodoApp from './components/TodoApp';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <TodoApp />
    </>
  );
};

export default App;
