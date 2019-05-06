import React from 'react';
import burderLogo from '../../assets/images/burger-logo.png'; //trzeba sobie zaimportować w .js ten obrazek bo potem webpack g ozbundluje i będzie niewiadomo gdzie
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo}>
        <img src={burderLogo} alt="MyBurger" />
    </div>
);

export default logo;