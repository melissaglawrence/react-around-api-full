import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Register = ({ handleChange, onRegister, ...props }) => {
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

    onRegister({ email, password });
  };

  React.useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  return (
    <>
      <Header link='/signin' message='Log In' login={false} />
      <section id='signUp' className='auth'>
        <div className='auth__container'>
          <form
            className='auth__info'
            id='signUpForm'
            name='signUp'
            onSubmit={handleSubmit}
          >
            <h2 className='auth__title'>{'Sign Up'}</h2>
            <div className='auth__input-Container'>
              <input
                className='auth__input auth__input_email'
                id='signUpEmailInput'
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
                id='signUpPasswordInput'
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
              {'Sign Up'}
            </button>
          </form>
          <div className='redirect'>
            <p>Already a member? </p>
            <Link to='/signIn' className='button redirect__button'>
              Log in here!
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
