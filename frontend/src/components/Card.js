import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

const Card = (props) => {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = props.card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = `grid-item__trash button ${
    isOwn ? 'grid-item__trash_active' : ''
  }`;

  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `grid-item__like button ${
    isLiked ? 'grid-item__like_active' : ''
  }`;

  const handleClick = () => {
    props.onCardClick(props.card);
  };
  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  return (
    <li className='grid-item'>
      <button
        className={cardDeleteButtonClassName}
        type='button'
        aria-label='trash'
        onClick={handleDeleteClick}
      />
      <img
        className='grid-item__img'
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <div className='grid-item__info'>
        <h2 className='grid-item__text'>{props.card.name}</h2>
        <div className='grid-item__like-container'>
          <button
            className={cardLikeButtonClassName}
            type='button'
            aria-label='like'
            onClick={handleLikeClick}
          />
          <span className='grid-item__like-counter'>
            {props.card.likes.length}
          </span>
        </div>
      </div>
    </li>
  );
};

export default Card;
