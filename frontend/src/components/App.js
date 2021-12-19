import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, Route, Switch, Redirect } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState('');
  const history = useHistory();

  ///POPUP FUNCTIONALITY
  const handleAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImageOpen(true);
  };
  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImageOpen(false);
    setIsTooltipOpen(false);
  };

  //TOKENCHECK
  const jwt = localStorage.getItem('jwt');
  const email = localStorage.getItem('user');
  const tokenCheck = useCallback(() => {
    if (jwt) {
      auth
        .getUser(jwt)
        .then((data) => {
          if (data) {
            setCurrentUser(data.user);
            setLogin(true);
            history.push('/');
          } else {
            setMessage('Token not provided or provided in the wrong format');
          }
        })
        .catch(() => {
          setMessage('The provided token is invalid ');
        });
    }
    return;
  }, [history, jwt]);

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  //LOGIN FUNCTIONALITY
  const handleLogin = (data) => {
    auth
      .signIn(data)
      .then((data) => {
        if (!data) {
          return setMessage('the user with the specified email not found');
        }
        if (data) {
          tokenCheck();
          setMessage('');
          setLogin(true);
          history.push('/');
          return;
        }
      })
      .catch(() => {
        setMessage('one or more of the fields were not provided');
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    history.push('/signin');
  };

  //REGISTRATION FUNCTIONALITY
  const handleRegister = (data) => {
    auth
      .signUp(data)
      .then((res) => {
        if (res) {
          setMessage('');
          history.push('/signin');
          setIsTooltipOpen(true);
          setIsSignUpSuccess(true);
          return;
        } else {
          setIsTooltipOpen(true);
          setIsSignUpSuccess(false);
          return setMessage('One of the fields was filled in incorrectly');
        }
      })
      .catch(() => {
        setIsTooltipOpen(true);
        setIsSignUpSuccess(false);
        return setMessage('An error occured');
      });
  };

  //GET INITIAL DATA
  useEffect(() => {
    api
      .getInitialCards(jwt)
      .then((res) => {
        setCards(res.map((card) => card));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [jwt]);

  useEffect(() => {
    api
      .getUserInfo(jwt)
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [jwt]);

  //CARD FUNCTIONALITY
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked, jwt)
      .then((newCard) => {
        setCards((oldCards) =>
          oldCards.map((c) => (c._id === card._id ? newCard.card : c)),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id, jwt)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlaceSubmit = (data) => {
    api
      .createNewCard(data, jwt)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //USER FUNCTIONALITY
  const handleUpdateUser = ({ name, about }) => {
    api
      .updateUserInfo(name, about, jwt)
      .then((data) => {
        setCurrentUser(data.user);
        setIsEditProfilePopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateAvatar = ({ avatar }) => {
    api
      .userAvatar(avatar, jwt)
      .then((data) => {
        setCurrentUser(data.user);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <Route path='/signin'>
            <Login onLogin={handleLogin} message={message} />
          </Route>
          <Route path='/signup'>
            <Register onRegister={handleRegister} message={message} />
          </Route>
          <ProtectedRoute exact path='/' login={login}>
            <Header
              link={'/signin'}
              message='Sign Out'
              login={login}
              signOut={handleSignOut}
              userEmail={email}
            />
            <Main
              cards={cards}
              onEditAvatarClick={handleAvatarClick}
              onEditProfileClick={handleProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />

            <Footer />
          </ProtectedRoute>
          <Route path='/'>
            {login ? <Redirect to='/' /> : <Redirect to='/signin' />}
          </Route>
        </Switch>
        <InfoTooltip
          isOpen={isTooltipOpen}
          onClose={closeAllPopups}
          isSuccessful={isSignUpSuccess}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isImageOpen}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
    </>
  );
};

export default App;
