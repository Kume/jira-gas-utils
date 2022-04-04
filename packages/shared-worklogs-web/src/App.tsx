import React, {useState} from 'react';

export const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      Hello World {count}
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
};
