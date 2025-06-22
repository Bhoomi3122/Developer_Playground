import React from 'react';
import CodePlayground from '../codes/CodePlayground';
import snippets from '../../assets/Navbar.json'

const NavbarComponent = () => {
  return (
    <div>
      <CodePlayground snippets={snippets} />
    </div>
  );
};

export default NavbarComponent;
