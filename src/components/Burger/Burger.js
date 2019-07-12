import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients) //wyciąganie keyów z obiektu
        .map(igKey => {
            return [...Array(props.ingredients[igKey])] //samo np. Array(3)  zrobi nam tablicę z trzema pustymi miejscami
                .map((_, i) => {  // to _ to pusty element tablicy, nie ważny
                    return <BurgerIngredient key={igKey + i} type={igKey} />;
                });
        }).reduce((arr, el) => {     //reduce spłaszcza np tablicę zawierającą mniejsze tablice jako elementy
            return arr.concat(el)
        }, []);
    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;