import React from 'react';
import CodePlayground from '../codes/CodePlayground';
import snippets from '../../assets/Forms.json'

const FormComponent = () => {
  return (
    <div>
      <CodePlayground snippets={snippets} />
    </div>
  );
};

export default FormComponent;
