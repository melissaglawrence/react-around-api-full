import React from 'react';
import success from '../images/success.svg';
import error from '../images/error.svg';

const InfoTooltip = ({ isOpen, isSuccessful, onClose, ...props }) => {
  return (
    <section className={`popup ${isOpen ? 'popup_opened' : ''}`} id='tooltip'>
      <div className='popup__container tooltip'>
        <button
          className='popup__close tooltip__close button'
          type='button'
          aria-label='Close'
          onClick={onClose}
        />
        <img
          className='tooltip__img'
          src={isSuccessful ? success : error}
          alt='Status response'
        />
        <h1 className='tooltip__title'>
          {isSuccessful
            ? 'Success! You have now been registered.'
            : 'Oops, something went wrong! Please try again'}
        </h1>
      </div>
    </section>
  );
};

export default InfoTooltip;
