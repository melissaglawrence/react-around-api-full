const ImagePopup = ({ onClose, isOpen, card }) => {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__image-container'>
        <button
          className='popup__close button'
          type='button'
          aria-label='Close'
          onClick={onClose}
        />
        <img
          className='popup__image-content'
          src={card?.link}
          alt={card?.name}
        />
        <div className='popup__image-text'>{card?.name}</div>
      </div>
    </div>
  );
};

export default ImagePopup;
