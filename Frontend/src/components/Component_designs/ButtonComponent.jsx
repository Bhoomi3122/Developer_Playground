import React from 'react';
import CodePlayground from '../codes/CodePlayground';
import snippets from '../../assets/Buttons.json'

const ButtonComponent = () => {
  return (
    <div>
      <CodePlayground snippets={snippets} />
    </div>
  );
};

export default ButtonComponent;
