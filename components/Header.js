import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route={'/'}>
        <a className='item'>CrowdCoin</a>
      </Link>
      <Menu.Menu position='right'>
        <Link route={'/'}>
        <a className='item'>Campaigns</a>
        </Link>
        <Link route={'/campaigns/new'}>
        <a className='item'>
            <i aria-hidden='true' className='add icon' />
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;