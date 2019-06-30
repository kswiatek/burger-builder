import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = { //duże litery na wszystko bo to będzie globalna zmienna jakby
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    /*constructor(props) { //tak też się da
        super(props);
        this.state = {...}
    }*/
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-burger-f0872.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients: response.data
                });
            }).catch(error => {
                this.setState({error: true});
            });
    }

    purchaseHandler = () => {
        this.setState({purchasing: true}); //problem jest gdy to normalna func() {} a nie arrow, a używamy tam THIS i metoda odpala się przez event jakiś
    }

    updatePurchaseState (updatedIngredients) {
        const sum = Object.keys(updatedIngredients)
            .map(igKey => {
                return updatedIngredients[igKey];
            })
            .reduce((sum, el) => {  //zlicza całą tablicę values ile czego jest, i robi jedną sumę wszystkiego przez reduce
                return sum + el;
            }, 0);
            this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients); //bez tego updatedIngredients przekazanego dalej koleś będzie patrzył na stare propsy
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
            //robi sobie takie pary key value kodując to w urlu
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString //wysłał w URLu składniki
        });
    } //w mongoDB nie ma tabel tylko jest taka struktura obiektów jsonowych jak tu, on to tam wrzuca i tyle

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0; //przerobił obiekt składników na T/F czy pokazywać buttony
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner/>;
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>;
        }
        if(this.state.loading) {
            orderSummary = <Spinner />;
        }
        
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}   
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios); //withErrorHandler też oczekuje jako drugi props axiosa