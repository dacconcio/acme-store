import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <div>
      <Link to="/"> HOME </Link>
      <Link to="/orders">ORDERS</Link>
      <br />
      <br />
    </div>
  );
};

export default Nav;
