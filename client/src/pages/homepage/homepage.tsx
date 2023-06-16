import './homepage.css';
import React, { Fragment } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface homePageProp {}

const HomePage: React.FC<homePageProp> = () => {
  //   const [threads, setThread] = useThread();

  return (
    <Fragment>
      <div>Hi!, The name is Elly</div>
    </Fragment>
  );
};

export default HomePage;
