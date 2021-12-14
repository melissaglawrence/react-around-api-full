import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Login = ({ onLogin, handleChange, ...props }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin({ email, password });
  };

  React.useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <>
      <Header link={'/signup'} message='Sign Up' login={false} />
      <section className='auth' id='signIn'>
        <div className='auth__container'>
          <form
            className='auth__info'
            id='signInForm'
            name='signIn'
            onSubmit={handleSubmit}
          >
            <h2 className='auth__title'>{'Log In'}</h2>
            <div className='auth__input-Container'>
              <input
                className='auth__input auth__input_email'
                id='signInEmailInput'
                placeholder='Email'
                name='email'
                type='text'
                onChange={handleEmail}
                value={email || ''}
                required
              />
              <span className='auth__input-error'>{props.message}</span>
            </div>
            <div className='auth__input-container'>
              <input
                className='auth__input'
                id='signInPasswordInput'
                placeholder='Password'
                name='password'
                type='password'
                onChange={handlePassword}
                value={password || ''}
                required
              />
              <span className='auth__input-error'>{props.message}</span>
            </div>
            <button type='submit' className='auth__save' aria-label='save'>
              {'Log In'}
            </button>
          </form>
          <div className='redirect'>
            <p>Not a member yet? </p>
            <Link to='/signUp' className='button redirect__button'>
              Sign up here!
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
