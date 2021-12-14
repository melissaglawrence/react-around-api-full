const PopupWithForm = (props) => {
  return (
    <section
      className={`popup ${props.isOpen ? 'popup_opened' : ''}`}
      id={`${props.id}`}
    >
      <div className='popup__container'>
        <button
          className='popup__close button'
          type='button'
          aria-label='Close'
          onClick={props.onClose}
        />
        <form
          className='popup__info'
          id={props.formId}
          name={props.formName}
          onSubmit={props.onSubmit}
        >
          <h2 className='popup__title'>{props.header}</h2>
          <>{props.children}</>
          <button
            type='submit'
            className='popup__save button'
            aria-label='save'
          >
            {props.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};
export default PopupWithForm;
