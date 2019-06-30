import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom'; //Route importujemy tam gdzie tworzymy ścieżki
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state= {
        ingredients: null,
        totalPrice: 0
    }

    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search); //wyciągamy parametry zaszyte w URLu
        const ingredients = {};
        let price = 0;
        for(let param of query.entries()) {
            // ['salad', '1']
            if(param[0] === 'price') {
                price = param[1];
            } else {
                ingredients[param[0]] = +param[1]
            }
        }
        this.setState({ingredients: ingredients, totalPrice: price});
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack(); //WBUDOWANA METODA Z ROUTINGU
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    
    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)} />
                    {/* component={ContactData} to nie bo nie da się przekazać ingredientów tam, daltego RENDER */}
                    {/* innymi słowy: jak nasz url jest na 'cokolwiek/contact-data' to wyrenderuj tu tego kolesia */}
            </div>
        );
    }
}

export default Checkout;