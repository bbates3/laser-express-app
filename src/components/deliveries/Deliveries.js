/* eslint-disable*/

import "./Deliveries.css"
import RepairModal from "../repairModal/RepairModal"
import React, { Component } from "react"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import "../../../node_modules/react-toastify/dist/ReactToastify.css"
import Toggle from 'react-toggle'
import "./react-toggle.css"
import NavBar from "../navbar/NavBar"
import CountUp from "react-countup"
import ApprovalModal from "../approvalmodal/ApprovalModal"

var Spinner = require('react-spinkit');




export default class Deliveries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideModal: false,
            hideApproval: false,
            hideComplete: false,

            deliveries: [],
            deliveriesToOrders: [],
            completeDeliveries: [],
            deliveriesReset: [],
            deliveriesForApprovalCount: 0,

            updateState: 0,
            delivTech: true,
            delivToEdit: null,

            contactName: '',
            tech: '',
            notes: '',

            quantEdits: [],
            cartEdits: []

        }
        this.showModal = this.showModal.bind(this)
        this.showModalApprove = this.showModalApprove.bind(this)

        this.updateOrder = this.updateOrder.bind(this)
        this.completeDelivery = this.completeDelivery.bind(this)
        this.toggleSwitch = this.toggleSwitch.bind(this)
        this.sendToOrder = this.sendToOrder.bind(this)
        this.deleteDelivery = this.deleteDelivery.bind(this)
        this.sortDeliveryName = this.sortDeliveryName.bind(this)
        this.sortDeliveryTech = this.sortDeliveryTech.bind(this)

    }

    notify = () => toast.success("Marked as complete!");
    notifyOrder = () => toast.success("Sent to Order Log!");
    deleted = () => toast.warning("Deleted!")


    componentDidMount() {

        axios.get("/api/deliveries/getcomplete")
            .then(response => {
                this.setState({
                    completeDeliveries: response.data
                })
            })


        axios.get("/api/deliveries/getall")
            .then(response => {
                response.data.sort((a, b) => {
                    var nameA = a.deliveriesid, nameB = b.deliveriesid;
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                })
                console.log(response.data)
                this.setState({ deliveries: response.data })
                this.setState({ deliveriesReset: response.data })
            })

        axios.get("/api/deliveriesapprove/count")
            .then(response => {
                console.log(response.data)
                this.setState({ deliveriesForApprovalCount: response.data[0].count })
            })
        console.log(this.state.deliveriesForApprovalCount)

    }

    showModal() {
        this.setState({ hideModal: !this.state.hideModal })
    }

    showModalApprove() {
        this.setState({ hideApproval: !this.state.hideApproval })
        console.log(this.state.hideApproval)
    }

    updateOrder(id, index) {
        axios.put(`/api/deliveries/updateorder/${id}`)
        this.state.deliveries[index].orderstatus = !this.state.deliveries[index].orderstatus;
        this.setState({ deliveries: this.state.deliveries })

    }

    updateInvoice(id, index) {

        axios.put(`/api/deliveries/updateinvoice/${id}`)


        this.state.deliveries[index].invoicestatus = !this.state.deliveries[index].invoicestatus;
        this.setState({ deliveries: this.state.deliveries })
    }

    completeDelivery(id, index) {
        axios.put(`/api/deliveries/completedelivery/${id}`)

        this.state.deliveries.splice(index, 1)
        this.setState({ deliveries: this.state.deliveries })
        this.notify();
    }

    toggleSwitch() {
        this.setState({
            hideComplete: !this.state.hideComplete
        })
    }

    orderFormat(id, q, c) {
        var arr = [];
        for (var i = 0; i < q.length; i++) {
            arr.push(q[i] + " - " + c[i])
        }
        //console.log(arr)
        return arr;

    }

    sendToOrder(index, indexOrder, order, delivCart, delivQuant) {

        console.log(this.state.deliveries[index])

        var order = {
            date: this.state.deliveries[index].date,
            time: this.state.deliveries[index].time,
            quantity: delivQuant[indexOrder],
            item: delivCart[indexOrder],
            customer: this.state.deliveries[index].name,
            customerid: this.state.deliveries[index].customerid
        }

        axios.post('/api/orders/insert', order)
            .then((response) => {
            })

        this.notifyOrder();
    }

    deleteDelivery(id, index) {
        const result = window.confirm("Are you sure? This action cannot be undone.")
        if (!result) return;
        axios.put(`/api/deliveries/deletedelivery/${id}`)

        this.state.completeDeliveries.splice(index, 1)
        this.setState({ completeDeliveries: this.state.completeDeliveries })
        this.deleted();
    }

    sortDeliveryName() {
        let tempArr = this.state.deliveries;
        tempArr.sort((a, b) => {
            var xa = a.contactname.toLowerCase(), xb = b.contactname.toLowerCase();
            if (xa < xb) {
                return -1;
            }
            if (xa > xb) {
                return 1;
            }
            return 0;
        })
        this.setState({ deliveries: tempArr })

    }

    sortDeliveryTech() {
        if (this.state.delivTech) {
            console.log("Tech Sort Active")
            let tempArr = this.state.deliveries;
            tempArr.sort((a, b) => {
                var xa = a.tech.toLowerCase(), xb = b.tech.toLowerCase();
                if (xa < xb) {
                    return -1;
                }
                if (xa > xb) {
                    return 1;
                }
                return 0;
            })
            this.setState({
                deliveries: tempArr,
                delivTech: !this.state.delivTech
            })
        }
        else {
            console.log("Tech Sort Inactive")
            console.log(this.state.deliveriesReset)
            var tempArr = this.state.deliveries;
            tempArr.sort((a, b) => {
                var nameA = a.deliveriesid, nameB = b.deliveriesid;
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            })
            this.setState({
                deliveries: tempArr,
                delivTech: !this.state.delivTech
            })

        }

    }

    editDelivery(id, index) {
        var delToEdit = this.state.deliveries[index]
        console.log(delToEdit.contactname)

        this.setState({ delivToEdit: delToEdit })

        this.setState({ quantEdits: this.state.deliveries[index].quantity })
        this.setState({ cartEdits: this.state.deliveries[index].cartridge })
        this.setState({ tech: this.state.deliveries[index].tech})
        console.log(this.state.delivToEdit)
        console.log(this.state.quantEdits)
        console.log(this.state.cartEdits)

    }


    handleChange(e, formField) {

        this.setState({
            [formField]: e
        })
        //console.log(this.state[formField])
        console.log(this.state)
    }

    handleQuantEdit(e, index) {
        let temp = this.state.quantEdits
        temp[index] = parseInt(e, 10)
        this.setState({ quantEdits: temp })
        console.log(this.state.quantEdits)
        console.log(this.state)
    }

    handleCartEdit(e, index) {
        let temp = this.state.cartEdits
        temp[index] = e

        this.setState({ cartEdits: temp })
        console.log(this.state)

    }

    updateDelivery(index){
        let updatedDel = 
        {
            deliveriesid: this.state.delivToEdit.deliveriesid,
            customerId: this.state.delivToEdit.customerid,
            date: this.state.delivToEdit.date,
            time: this.state.delivToEdit.time,
            status: this.state.delivToEdit.status,
            contactName: this.state.contactName,
            streetAddress: this.state.delivToEdit.streetaddress,
            city: this.state.delivToEdit.city,
            state: this.state.delivToEdit.state,
            phone: this.state.delivToEdit.phone,
            cartridge: '{' + this.state.cartEdits + '}',
            tech: this.state.tech,
            orderStatus: this.state.delivToEdit.orderstatus,
            invoiceStatus: this.state.delivToEdit.invoicestatus,
            notes: this.state.notes,
            quantity: '{' + this.state.quantEdits + '}',
        }

        let updatedDelForState = 
        {
            name: this.state.delivToEdit.name,
            deliveriesid: this.state.delivToEdit.deliveriesid,
            customerId: this.state.delivToEdit.customerid,
            date: this.state.delivToEdit.date,
            time: this.state.delivToEdit.time,
            status: this.state.delivToEdit.status,
            contactname: this.state.contactName,
            streetaddress: this.state.delivToEdit.streetaddress,
            city: this.state.delivToEdit.city,
            state: this.state.delivToEdit.state,
            phone: this.state.delivToEdit.phone,
            cartridge: this.state.cartEdits,
            tech: this.state.tech,
            orderStatus: this.state.delivToEdit.orderstatus,
            invoiceStatus: this.state.delivToEdit.invoicestatus,
            notes: this.state.notes,
            quantity: this.state.quantEdits,
        }

        // console.log(this.state.delivToEdit)
        // console.log(updatedDel)

        axios.put('/api/deliveries/updatedelivery/' + this.state.delivToEdit.deliveriesid, updatedDel)
        .then(response => console.log(response.data))
        var temp = this.state.deliveries
        temp[index] = updatedDelForState
        this.setState({deliveries: temp, 
            delivToEdit: null, 
            cartEdits: [], 
            quantEdits: [],
            contactName: '',
            tech: '',
            notes: '',})
        
       
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="outermostDiv">
                    <div className="fixedHeader">
                        <div className="sideBySide">
                            <h1 className="deliveriesWord">DELIVERIES</h1>{this.state.deliveriesForApprovalCount.length === 0 ? null : <div className="flexRow"><span className="forApproval">Deliveries for approval: </span><span onClick={this.showModalApprove} className="circleD"><CountUp duration={3} start={0} end={this.state.deliveriesForApprovalCount} /></span></div>}
                            <div className="showCompleteTitle">
                                <span className="showComplete">SHOW COMPLETE</span>
                                <Toggle
                                    defaultChecked={this.state.hideComplete}
                                    onChange={this.toggleSwitch} />
                            </div>
                        </div>
                        <div className="deliveriesHeader">
                            <span className="headerTitleDeliveries">DATE</span>
                            <div className="deliveriesDivider"></div>

                            <span className="headerTitleDeliveries">TIME</span>
                            <div className="deliveriesDivider"></div>
                            {/* <span className="headerTitleDeliveries">STATUS</span>
                        <div className="deliveriesDivider"></div> */}

                            <span className="headerTitleDeliveriesM" id="customerContact" onClick={this.sortDeliveryName}>CUSTOMER | CONTACT</span>


                            <div className="deliveriesDividerM"></div>

                            <span className="headerTitleDeliveriesM">ADDRESS</span>
                            <div className="deliveriesDividerM"></div>

                            <span className="headerTitleDeliveries">PHONE</span>
                            <div className="deliveriesDivider"></div>

                            <span className="headerTitleDeliveriesM">CARTRIDGE</span>
                            <div className="deliveriesDividerM"></div>

                            <span className="TechD" onClick={this.sortDeliveryTech}>TECH</span>
                            <div className="deliveriesDivider"></div>

                            <span className="headerTitleDeliveries">ORDERED</span>
                            <div className="deliveriesDivider"></div>

                            <span className="headerTitleDeliveries">INVOICED</span>
                            <div className="deliveriesDivider"></div>

                            <span className="headerTitleDeliveries">NOTES</span>
                            <div className="deliveriesDivider"></div>

                            {this.state.hideComplete ? <span className="headerTitleDeliveriesM">DELETE</span> : <span className="headerTitleDeliveriesM">COMPLETE | EDIT</span>}

                        </div>
                    </div>

                    {/* COMPLETED DELIVERIES HERE */}
                    {this.state.deliveries.length === 0 ? <div className="centerCenter"><span className="forApproval">No deliveries here...</span><Spinner name='pacman' color="#eded4d" fadeIn="quarter" /></div> : this.state.hideComplete ?
                        this.state.completeDeliveries.map((deliveries, index) => {


                            return (
                                <div className="deliveryContainer" key={deliveries.deliveriesid}>
                                    <span className="detailsDeliveries">{deliveries.date}</span>
                                    <span className="detailsDeliveries">{deliveries.time}</span>
                                    {/* <span className="detailsDeliveries">{deliveries.status}</span> */}
                                    <span className="detailsDeliveriesM">{deliveries.contactname}</span>
                                    <span className="detailsDeliveriesM">{deliveries.streetaddress}</span>
                                    <span className="detailsDeliveries">{deliveries.phone}</span>
                                    <span className="detailsDeliveriesM">{deliveries.cartridge}</span>
                                    <span className="detailsDeliveries">{deliveries.tech}</span>
                                    <span className="detailsDeliveries">{deliveries.orderstatus === false ? <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                        <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                    <span className="detailsDeliveries">{deliveries.invoicestatus === false ? <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                        <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                    <span className="detailsDeliveries" id="smallFont">{deliveries.notes}</span>
                                    <span className="detailsDeliveriesM"><button className="completed" onClick={() => this.deleteDelivery(deliveries.deliveriesid, index)}>&#x2715;</button></span>



                                </div>
                            )
                        })
                        :
                        this.state.deliveries.map((deliveries, index) => {

                            return (
                                <div key={deliveries.deliveriesid}>
                                    {this.state.delivToEdit ?

                                        this.state.delivToEdit.deliveriesid === deliveries.deliveriesid ?


                                            // DELIVERY TO EDIT HERE
                                            <div className="deliveryContainer" key={deliveries.deliveriesid}>
                                                <span className="detailsDeliveries">{deliveries.date}</span>
                                                <span className="detailsDeliveries">{deliveries.time}</span>
                                                <div className="ccEdit">
                                                    <span className="detailsDeliveriesM" >{deliveries.name}</span>
                                                    <input className="detailsDeliveriesM" defaultValue={deliveries.contactname} onChange={(e) => { this.handleChange(e.target.value, "contactName") }}></input>
                                                </div>
                                                <span className="detailsDeliveriesM">{deliveries.streetaddress}</span>
                                                <span className="detailsDeliveries">{deliveries.phone}</span>

                                                {/* CARTRIDGE ORDER FORMATTING */}
                                                <div className="ccEdit">
                                                    {deliveries.quantity.map((quant, index) => {

                                                        return (
                                                            <select value={quant} key={index} onChange={(e) => { this.handleQuantEdit(e.target.value, index) }}>
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                                <option value="6">6</option>
                                                                <option value="7">7</option>
                                                                <option value="8">8</option>
                                                                <option value="9">9</option>
                                                                <option value="10">10</option>
                                                                <option value="11">11</option>
                                                                <option value="12">12</option>

                                                            </select>
                                                        )
                                                    })}
                                                </div>
                                                <div className="ccEdit">
                                                    {deliveries.cartridge.map((cart, index) => {
                                                        return (
                                                            <div key={index} >
                                                                <input defaultValue={cart} onChange={(e) => this.handleCartEdit(e.target.value, index)}></input>
                                                            </div>
                                                        )
                                                    })}
                                                </div>



                                                {/* <span className="detailsDeliveriesM">{this.orderFormat(deliveries.deliveriesid, deliveries.quantity, deliveries.cartridge).map((order, indexOrder) => {
                                                    return (
                                                        <div>
                                                            <span className="detailsDeliveriesO">{order}</span>
                                                        </div>)
                                                })}</span> */}
                                                {/* *********************************** */}

                                                <div className="ccEdit">
                                                    <select onChange={(e) => { this.handleChange(e.target.value, "tech") }} value={this.state.tech}>
                                                        <option value="BB">BB</option>
                                                        <option value="LE">LE</option>
                                                        <option value="RD">RD</option>

                                                    </select>
                                                </div>
                                                <span className="detailsDeliveries">{deliveries.orderstatus === false ? <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                                    <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                                <span className="detailsDeliveries">{deliveries.invoicestatus === false ? <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                                    <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                                <input className="detailsDeliveries" onChange={(e) => { this.handleChange(e.target.value, "notes") }} id="smallFont" defaultValue={this.state.delivToEdit.notes}></input>
                                                <span className="detailsDeliveriesM"><button className="complete" onClick={() => this.updateDelivery(index)}>&#10003;</button><button onClick={() => this.setState({ delivToEdit: null })} className="cancel">&#x2715;</button></span>
                                            </div>

                                            :

                                            // ALL OTHER DELIVERIES HERE
                                            <div className="deliveryContainer" key={deliveries.deliveriesid}>
                                                <span className="detailsDeliveries">{deliveries.date}</span>
                                                <span className="detailsDeliveries">{deliveries.time}</span>
                                                {/* <span className="detailsDeliveries">{deliveries.status}</span> */}
                                                <span className="detailsDeliveriesM">{deliveries.name}<br />Contact: {deliveries.contactname}</span>
                                                <span className="detailsDeliveriesM">{deliveries.streetaddress}</span>
                                                <span className="detailsDeliveries">{deliveries.phone}</span>
                                                <span className="detailsDeliveriesM">{this.orderFormat(deliveries.deliveriesid, deliveries.quantity, deliveries.cartridge).map((order, indexOrder) => {
                                                    return (
                                                        <div key={indexOrder}>
                                                            <span className="detailsDeliveriesO">{order}</span>
                                                            <button className="sendToOrder" onClick={() => this.sendToOrder(index, indexOrder, order, deliveries.cartridge, deliveries.quantity)}>&rarr;</button>
                                                        </div>)
                                                })}</span>
                                                <span className="detailsDeliveries">{deliveries.tech}</span>
                                                <span className="detailsDeliveries">{deliveries.orderstatus === false ? <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                                    <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                                <span className="detailsDeliveries">{deliveries.invoicestatus === false ? <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                                    <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                                <span className="detailsDeliveries" id="smallFont">{deliveries.notes}</span>
                                                <span className="detailsDeliveriesM"><button className="complete" onClick={() => this.completeDelivery(deliveries.deliveriesid, index)}>&#10003;</button><button onClick={() => this.editDelivery(deliveries.deliveriesid, index)} className="complete">&#x270E;</button></span>



                                            </div>


                                        :
                                        <div className="deliveryContainer" key={deliveries.deliveriesid}>
                                            <span className="detailsDeliveries">{deliveries.date}</span>
                                            <span className="detailsDeliveries">{deliveries.time}</span>
                                            {/* <span className="detailsDeliveries">{deliveries.status}</span> */}
                                            <span className="detailsDeliveriesM">{deliveries.name}<br />Contact: {deliveries.contactname}</span>
                                            <span className="detailsDeliveriesM">{deliveries.streetaddress}</span>
                                            <span className="detailsDeliveries">{deliveries.phone}</span>
                                            <span className="detailsDeliveriesM">{this.orderFormat(deliveries.deliveriesid, deliveries.quantity, deliveries.cartridge).map((order, indexOrder) => {
                                                return (
                                                    <div key={indexOrder}>
                                                        <span className="detailsDeliveriesO">{order}</span>
                                                        <button className="sendToOrder" onClick={() => this.sendToOrder(index, indexOrder, order, deliveries.cartridge, deliveries.quantity)}>&rarr;</button>
                                                    </div>)
                                            })}</span>
                                            <span className="detailsDeliveries">{deliveries.tech}</span>
                                            <span className="detailsDeliveries">{deliveries.orderstatus === false ? <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                                <button onClick={() => this.updateOrder(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                            <span className="detailsDeliveries">{deliveries.invoicestatus === false ? <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="notOrdered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button> :
                                                <button onClick={() => this.updateInvoice(deliveries.deliveriesid, index)} className="Ordered"><div><span className="yes">YES</span><span className="slash">/</span><span className="no">NO</span></div></button>}</span>
                                            <span className="detailsDeliveries" id="smallFont">{deliveries.notes}</span>
                                            <span className="detailsDeliveriesM"><button className="complete" onClick={() => this.completeDelivery(deliveries.deliveriesid, index)}>&#10003;</button><button onClick={() => this.editDelivery(deliveries.deliveriesid, index)} className="complete">&#x270E;</button></span>



                                        </div>
                                    }
                                </div>
                            )
                        })


                    }
                    {/* Disable the modal below */}

                    {/* <button className="addDeliveryButton" onClick={this.showModal} onClose={this.showModal}>
                        <div className="vert"></div>
                        <div className="horiz"></div>
                    </button> */}

                    {/* <RepairModal show={this.state.hideModal} onClose={this.showModal} /> */}
                    <ApprovalModal show={this.state.hideApproval} onClose={this.showModalApprove} />
                    <ToastContainer
                        position="top-right"
                        type="default"
                        autoClose={3500}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        pauseOnHover
                    />
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>



        )
    }
}