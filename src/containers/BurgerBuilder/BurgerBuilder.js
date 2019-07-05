import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    /*constructor(props) { //tak też się da
        super(props);
        this.state = {...}
    }*/
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('https://react-burger-f0872.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({
        //             ingredients: response.data
        //         });
        //     }).catch(error => {
        //         this.setState({error: true});
        //     });
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
            return sum > 0;
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    } 
    //kiedyś to było
    //w mongoDB nie ma tabel tylko jest taka struktura obiektów jsonowych jak tu, on to tam wrzuca i tyle

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0; //przerobił obiekt składników na T/F czy pokazywać buttony
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner/>;
        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        price={this.props.price}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                price={this.props.price}
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios)); 
//withErrorHandler też oczekuje jako drugi props axiosa