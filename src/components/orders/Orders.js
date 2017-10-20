import "./Orders.css"
import RepairModal from "../repairModal/RepairModal"
import React, {Component} from "react"
import axios from "axios"

var Spinner = require('react-spinkit');

export default class Orders extends Component {
    constructor(props){
        super(props);
        this.state = {
            hideModal: false,
            
            orders: [],

        }
        this.showModal = this.showModal.bind(this)
        
    }

    componentDidMount(){
        axios.get("/api/orders/getall")
        .then(response => {
            this.setState({ orders: response.data})
        })
    }

    showModal(){
        this.setState({hideModal: !this.state.hideModal})
        console.log(this.state.hideModal)
    }
    render () {
        return (
            <div className="outermostDiv">
            <div className="fixedHeader">
                <h1 className="ordersWord">ORDERS</h1>
                <div className="ordersHeader">
                    <span className="headerTitleOrders">DATE</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">TIME</span>
                    <div className="ordersDivider"></div>
                    <span className="headerTitleOrders">QUANTITY</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">ITEM</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">CUSTOMER</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">COST</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">ORDER NUMBER</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">VENDOR</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">COST</span>
                    <div className="ordersDivider"></div>

                    <span className="headerTitleOrders">NOTES</span>
                </div>
            </div>
                {this.state.orders.length === 0 ? <Spinner name='double-bounce' /> : this.state.orders.map((order, index) => {
                    
                    //Extends the NumberFormat for use below in order to properly display the total amounts after converting the MONEY type from
                    //the database.
                    var formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        // the default value for minimumFractionDigits depends on the currency
                        // and is usually already 2
                      });

                    let costOfProduct = parseFloat(order.cost.replace('$',''))
                    return (
                        
                    <div className="ordersContainer" key={index}>
                        <span className="detailsOrders">{order.date}</span>
                        <span className="detailsOrders">{order.time}</span>
                        <span className="detailsOrders">{order.quantity}</span>
                        <span className="detailsOrders">{order.item}</span>
                        <span className="detailsOrders">{order.customer}</span>
                        <span className="detailsOrders">{order.cost}</span>
                        <span className="detailsOrders">{order.ordernumber}</span>
                        <span className="detailsOrders">{order.vendor}</span>
                        <span className="detailsOrders">{formatter.format(order.quantity * costOfProduct)}</span>
                        <span className="detailsOrders">{order.notes}</span>


                    </div>
                    )
                })}
            
            </div>
            
        )
    }
}