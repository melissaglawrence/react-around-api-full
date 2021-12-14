import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ login, signOut, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isMenuOpen ? 'header__open' : ''}`}>
      <div className='logo' />
      <button
        className={` ${isMenuOpen ? 'nav__menu_close' : 'nav__menu'}`}
        onClick={isMenuOpen ? handleCloseMenu : handleOpenMenu}
      />
      <div className={`nav ${isMenuOpen ? 'nav__open' : 'nav__hidden'}`}>
        {login ? <p className='nav__info'>{props.userEmail}</p> : null}
        <Link to={props.link} onClick={signOut} className='button'>
          {props.message}
        </Link>
      </div>
    </header>
  );
};

export default Header;
