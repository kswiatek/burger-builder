import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom'; //Route importujemy tam gdzie tworzymy ścieżki
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
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
                    ingredients={this.props.ings}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    component={ContactData} />
                    {/* render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.props.price} {...props} />)} /> */}
                    {/* component={ContactData} to nie bo nie da się przekazać ingredientów tam, daltego RENDER */}
                    {/* innymi słowy: jak nasz url jest na 'cokolwiek/contact-data' to wyrenderuj tu tego kolesia */}
            </div>
        );
    }
}

const mapStateToProps = state => {  //tutaj nie potrzebujemy uruchamiania akcji
    return {
        ings: state.ingredients
    }
};

export default connect(mapStateToProps)(Checkout);