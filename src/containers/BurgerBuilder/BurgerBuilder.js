import React, { useState, useEffect } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index'; 
///actions też by zadziałało bo taki index.js sam automatycznie bierze 

const burgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        props.onInitIngredients();
    }, []);

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const updatePurchaseState = (updatedIngredients) => {
        const sum = Object.keys(updatedIngredients)
            .map(igKey => {
                return updatedIngredients[igKey];
            })
            .reduce((sum, el) => {  //zlicza całą tablicę values ile czego jest, i robi jedną sumę wszystkiego przez reduce
                return sum + el;
            }, 0);
            return sum > 0;
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout');
    } 
    //kiedyś to było
    //w mongoDB nie ma tabel tylko jest taka struktura obiektów jsonowych jak tu, on to tam wrzuca i tyle

    const disabledInfo = {
        ...props.ings
    };
    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0; //przerobił obiekt składników na T/F czy pokazywać buttony
    }
    let orderSummary = null;
    let burger = props.error ? <p>Ingredients cannot be loaded!</p> : <Spinner/>;
    if(props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings} />
                <BuildControls 
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuthenticated}
                    price={props.price}/>
            </Aux>
        );
        orderSummary = <OrderSummary 
            ingredients={props.ings}
            price={props.price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}/>;
    }

    return(
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}   
            </Modal>
            {burger}
        </Aux>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios)); 
//withErrorHandler też oczekuje jako drugi props axiosa