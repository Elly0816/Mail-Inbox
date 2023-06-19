import React, { useContext, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { authContext, authContextType } from '../../App';
import { queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';

type Inputs = {
  email: string;
  password: string;
};

export interface loginFormInput {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<loginFormInput> = ({ setLoading }) => {
  const { setAuth, setUser } = useContext(authContext) as authContextType;
  const {
    register,
    handleSubmit,
    // watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  // const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);

    queryServer({
      formdata: { email: data.email, password: data.password },
      method: 'post',
      url: '/login',
    })
      .then((res) => {
        const { user } = res.data;
        console.log(res);
        if (user) {
          setUser && setUser(user as userFromDb);
          setAuth && setAuth(true);
        }
      })
      .catch((e) => {
        setAuth && setAuth(false);
        console.log(e);
      });
    // navigate('');
    reset();
    setLoading(false);
    return !errors.email && !errors.password && console.log(data);
  };

  // useEffect(() => {
  //   if (auth) {
  //     navigate('');
  //   }
  // }, [auth, navigate]);

  // console.log(watch('email')); // watch input value by passing the name of it

  useEffect(() => {
    setError('email', {
      types: {
        required: 'This is required',
        minLength: 'This is the min Length',
      },
    });
    setError('password', {
      types: {
        required: 'This is required',
        minLength: 'This is the min Length',
      },
    });

    (errors.email || errors.password) && console.log(errors);
  }, [setError]);

  const submitButton = useRef(null);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form>
      {/* register your input into the hook by invoking the "register" function */}
      <input placeholder="email" {...register('email', { required: true })} />

      {/* include validation with required or other standard HTML validation rules */}
      <input
        {...register('password', { required: true })}
        placeholder="password"
      />
      {/* errors will return when field validation fails  */}
      {errors.email && <span>{errors.email.message || 'email error'}</span>}
      {errors.password && (
        <span>{errors.password.message || 'password error'}</span>
      )}

      <input
        ref={submitButton}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};

export default LoginForm;
