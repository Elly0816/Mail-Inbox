import { Fragment, useContext, useMemo } from 'react';
import { authContext } from '../../App';
import Thread from '../../components/thread/Thread';
import Compose from '../../components/compose/Compose';

const InboxPage: React.FC = () => {
  const { user } = useContext(authContext);

  // const child = useMemo(() => {
  //   return user && user.threads.length > 0 ? (
  //     user['threads'].map((thread, index) => {
  //       console.log(thread);
  //       console.log('This is a single thread');
  //       return <Thread key={index} id={thread} />;
  //     })
  //   ) : (
  //     <div>
  //       <h3>There are no threads</h3>
  //       <Compose method="post" />
  //     </div>
  //   );
  // }, [user]);

  return (
    <Fragment>
      {user ? (
        user.threads.length > 0 &&
        user['threads'].map((thread, index) => {
          console.log(thread);
          console.log('This is a single thread');
          return <Thread key={index} id={thread} />;
        })
      ) : (
        <div>
          <h3>There are no threads</h3>
        </div>
      )}
      {user && <Compose method="post" />}
    </Fragment>
  );
};

export default InboxPage;
