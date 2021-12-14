import React from 'react';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';

const Main = (props) => {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
      <section className='profile'>
        <div
          className='profile__img-container'
          onClick={props.onEditAvatarClick}
        >
          <img
            src={currentUser.avatar}
            className='profile__img-content'
            alt='avatar'
          />
          <div className='profile__img-edit' />
        </div>
        <div className='profile__text'>
          <div className='profile__group'>
            <h1 className='profile__name'>{currentUser.name}</h1>
            <button
              className='profile__edit button'
              type='button'
              aria-label='edit'
              onClick={props.onEditProfileClick}
            />
          </div>
          <p className='profile__desc'>{currentUser.about}</p>
        </div>
        <button
          className='profile__add button'
          type='button'
          aria-label='add'
          onClick={props.onAddPlaceClick}
        />
      </section>
      <section className='grid'>
        <ul className='grid__list'>
          {props.cards.map((card) => {
            return (
              <Card
                key={card._id}
                card={card}
                onCardClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete}
              />
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default Main;
