import React, { useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useFetch, { Usefetch } from '../../hooks/useFetch';

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { data, error, loading, setCurrent } = useFetch({
    method: undefined,
    path: undefined,
    formdata: undefined,
  }) as Usefetch;
  const {
    register,
    handleSubmit,
    // watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCurrent({
      method: 'post',
      path: '/login',
      formdata: { email: data.email, password: data.password },
    });
    reset();
    return !errors.email && !errors.password && console.log(data);
  };

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

    errors.email && errors.password && console.log(errors.email);
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
