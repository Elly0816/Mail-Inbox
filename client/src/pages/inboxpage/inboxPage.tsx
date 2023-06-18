import { Fragment, useContext, useMemo } from 'react';
// import useFetch from '../../hooks/useFetch';
import { authContext } from '../../App';
import Thread from '../../components/thread/Thread';
// import Loading from '../../components/loading/Loading';
// import Error from '../../components/error/Error';
// import './inboxPage.css';
import Compose from '../../components/compose/Compose';

// interface inboxPageProps {}

const InboxPage: React.FC = () => {
  const { user } = useContext(authContext);

  //   const { data, error, loading } = useFetch({
  //     method: 'get',
  //     path: `/user/${user?._id}`,
  //   });
  //   const child = useMemo(() => {
  //     return loading ? (
  //       <Loading />
  //     ) : error ? (
  //       <Error message={error.message} />
  //     ) : (
  //       data && <div>{data}</div>
  //     );
  //   }, [data, error, loading]);

  const child = useMemo(() => {
    return user && user.threads.length > 0 ? (
      user['threads'].map((thread, index) => {
        console.log(thread);
        console.log('This is a single thread');
        return <Thread key={index} id={thread} />;
      })
    ) : (
      <div>
        <h3>There are no threads</h3>
        <Compose method="post" />
      </div>
    );
  }, [user]);

  return <Fragment>{child}</Fragment>;
};

export default InboxPage;
