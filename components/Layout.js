import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Head from 'next/head';

const Layout = ({ children }) => {
  const [activeItem, setActiveItem] = useState();

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  return (
    <Container>
      <Head>
        <link
          rel='stylesheet'
          href='//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css'
        />
      </Head>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
