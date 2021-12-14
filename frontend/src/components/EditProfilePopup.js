import React from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';

const EditProfilePopup = (props) => {
  const currentUser = React.useContext(CurrentUserContext);
  const [profileName, setProfileName] = React.useState(currentUser.name);
  const [profileDescription, setProfileDescription] = React.useState(
    currentUser.about,
  );

  const handleProfileName = (e) => {
    setProfileName(e.target.value);
  };
  const handleProfileDescription = (e) => {
    setProfileDescription(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    props.onUpdateUser({
      name: profileName,
      about: profileDescription,
    });
  };

  React.useEffect(() => {
    setProfileName(currentUser.name);
    setProfileDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      onClose={props.onClose}
      header='Edit Profile'
      buttonText='Save'
      id='popupEdit'
      formId='profileInfo'
      formName='editForm'
    >
      <div className='popup__input-container' id='popupInfoContainer'>
        <input
          className='popup__input popup__input_edit_title'
          id='name-input'
          placeholder='Name'
          name='name'
          type='text'
          minLength='2'
          maxLength='40'
          onChange={handleProfileName}
          value={profileName || ''}
          required
        />
        <span className='title-input-error popup__input-error' />
      </div>
      <div className='popup__input-container'>
        <input
          className='popup__input popup__input_edit_about'
          id='about-input'
          placeholder='About Me'
          name='about'
          type='text'
          onChange={handleProfileDescription}
          value={profileDescription || ''}
          required
        />
        <span className='image-input-error popup__input-error' />
      </div>
    </PopupWithForm>
  );
};

export default EditProfilePopup;
