import React from 'react';
import CodePlayground from '../codes/CodePlayground';
import snippets from '../../assets/Cards.json'

const FormComponent = () => {
  return (
    <div>
      <CodePlayground snippets={snippets} />
    </div>
  );
};

export default FormComponent;
