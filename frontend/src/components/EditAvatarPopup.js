import React from 'react';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = (props) => {
  const avatarRef = React.useRef('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  };
  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      onClose={props.onClose}
      header='Change Profile Picture'
      buttonText='Save'
      id='popupProfilePicture'
      formId='profilePictureInfo'
      formName='editPicture'
    >
      <div className='popup__input-container' id='popupInfoContainer'>
        <input
          className='popup__input popup__input_edit_title'
          id='profileImageInput'
          placeholder='Profile Image URL'
          name='profileUrl'
          type='url'
          ref={avatarRef}
          required
        />
        <span className='title-input-error popup__input-error' />
      </div>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;
