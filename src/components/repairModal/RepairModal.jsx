/* eslint-disable */
import React, { Component } from "react"
import PropTypes from "prop-types"
import Select from "react-select"
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import "../../../node_modules/react-toastify/dist/ReactToastify.min.css"


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';


//import './Select.css'

import "./RepairModal.css"

class RepairModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: [],
            value: '',
            currentCustomer: [],
            rdSetting: null,
            customerAdded: false,

            contactName: "",
            printer: "",
            printerID: "",
            symptoms: "",

            tech: "BB",
            notes: "",
            location: "",

            cartridge: "",
            quantity: "",

            city: "",
            name: "",
            phone: "",
            state: "",
            streetaddress: "",
            customerid: "",


            cartridgeForOrder: [{ name: '', quant: '' }],

            finished: false,
            stepIndex: 0,

        }
        this.logChange = this.logChange.bind(this)
        this.setDelivery = this.setDelivery.bind(this)
        this.setRepair = this.setRepair.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.submitRepair = this.submitRepair.bind(this)
        this.submitDelivery = this.submitDelivery.bind(this)
        this.addCartridge = this.addCartridge.bind(this)
        this.removeCartridge = this.removeCartridge.bind(this)
        this.addToArrayName = this.addToArrayName.bind(this)
        this.addToArrayQuant = this.addToArrayQuant.bind(this)
        this.submitCustomer = this.submitCustomer.bind(this)
    }

    notify = () => toast.success("Added Customer!");


    componentDidMount() {
        axios.get('/api/customers/getselect')
            .then(response => {
                console.log(response.data)
                this.setState({ customers: response.data })
            })
    }

    logChange(val) {
        console.log("selected: " + JSON.stringify(val))
        this.setState({ value: val })
        if (val !== null) {
            axios.get(`/api/customers/getone/${val.value}`)
                .then(response => {
                    this.setState({ currentCustomer: response.data })
                    console.log(response.data)
                })
        }
        else this.setState({ currentCustomer: [] })
    }


    setDelivery() {
        this.setState({ rdSetting: "d" })
    }

    setRepair() {
        this.setState({ rdSetting: "r" })
    }

    handleChange(e, formField) {

        this.setState({
            [formField]: e
        })
        // console.log(this.state[formField])
        console.log(this.state)
    }

    submitRepair() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = mm + '/' + dd + '/' + yyyy;
        console.log(today)
        var time = new Date().toLocaleTimeString();

        var repair = this.state.currentCustomer.length !== 0 ? {
            customerid: this.state.currentCustomer[0].customerid,
            date: today,
            time: time,
            status: "In Process",
            contactName: this.state.contactName,
            streetAddress: this.state.currentCustomer[0].streetaddress,
            city: this.state.currentCustomer[0].city,
            state: this.state.currentCustomer[0].state,
            phone: this.state.currentCustomer[0].phone,
            printer: this.state.printer,
            tech: this.state.tech,
            symptoms: this.state.symptoms,
            orderStatus: false,
            invoiceStatus: false,
            notes: this.state.notes

        }
            :
            {
                customerid: this.state.customerid,
                date: today,
                time: time,
                status: "In Process",
                contactName: this.state.contactName,
                streetAddress: this.state.streetaddress,
                city: this.state.city,
                state: this.state.state,
                phone: this.state.phone,
                printer: this.state.printer,
                tech: this.state.tech,
                symptoms: this.state.symptoms,
                orderStatus: false,
                invoiceStatus: false,
                notes: this.state.notes
            }
        // console.log(repair)
        axios.post('/api/repairs/insert', repair)
            .then(response => {
                console.log(response)
            })
        this.props.onClose;
        window.location.reload(true)

    }

    submitDelivery() {
        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        date = mm + '/' + dd + '/' + yyyy;

        var time = new Date().toLocaleTimeString();

        /*Somehow the name/quant got switched when being sent to state... Not sure how, but 
        *for now this works and send the correct info to the correct places*/

        var names = []
        var quantitiesMap = this.state.cartridgeForOrder.map((cartridge) => {
            console.log(cartridge.quant)
            names.push(cartridge.quant)
        })
        names.join()
        console.log(names)

        var quantities = []
        var namesMap = this.state.cartridgeForOrder.map((cartridge) => {
            console.log(cartridge.name)
            quantities.push(cartridge.name)
        })
        quantities.join()
        console.log(quantities)

        var delivery = this.state.currentCustomer.length !== 0 ? {
            customerid: this.state.currentCustomer[0].customerid,
            date: date,
            time: time,
            status: "In Process",
            contactname: this.state.contactName,
            streetaddress: this.state.currentCustomer[0].streetaddress,
            city: this.state.currentCustomer[0].city,
            state: this.state.currentCustomer[0].state,
            phone: this.state.currentCustomer[0].phone,
            cartridge: '{' + names + '}',
            tech: this.state.tech,
            orderstatus: false,
            invoicestatus: false,
            notes: this.state.notes,
            quantity: '{' + quantities + '}',
        }
            :
            {
                customerId: this.state.customerid,
                date: date,
                time: time,
                status: "In Process",
                contactName: this.state.contactName,
                streetAddress: this.state.streetaddress,
                city: this.state.city,
                state: this.state.state,
                phone: this.state.phone,
                cartridge: '{' + names + '}',
                tech: this.state.tech,
                orderStatus: false,
                invoiceStatus: false,
                notes: this.state.notes,
                quantity: '{' + quantities + '}',
            }

        console.log(delivery)
        axios.post('/api/deliveries/insert', delivery)
            .then(response => {
                console.log(response)
            })
        axios.get('/api/customers/getselect')
            .then(response => {
                console.log(response.data)
                this.setState({ customers: response.data })
            })
        this.props.OnClose;
        window.location.reload(true)
    }

    addCartridge() {

        this.setState({ inputs: this.state.inputs.concat({ quant: '', name: '' }) });
        console.log(this.state.inputs)
    }

    removeCartridge() {
        var newInputs = this.state.inputs
        newInputs.splice(this.state.inputs.length - 1, 1)
        this.setState({
            inputs: newInputs
        })
    }

    addToArrayQuant(e, index) {
        const newArray = this.state.inputs.map((quant, qindex) => {
            if (index !== qindex) return quant
            return { ...this.state.inputs, quant: e }
        })
        this.setState({ inputs: newArray })
        // this.setState(prevState => ({
        //     cartQuantities: [...prevState.cartQuantities, e]
        // }))
        console.log(this.state.inputs)
    }

    addToArrayName(e, formField) {
        this.setState(prevState => ({
            cartNames: [...prevState.cartNames, e]
        }))
        console.log(this.state.cartNames)

    }





    handleCartridgeOrderChangeName = (idx) => (evt) => {
        const newCart = this.state.cartridgeForOrder.map((cartridge, sidx) => {
            if (idx !== sidx) return cartridge;
            return { ...newCart, name: evt.target.value, quant: this.state.cartridgeForOrder[idx].quant };
        });

        this.setState({ cartridgeForOrder: newCart });
    }

    handleCartridgeOrderChangeQuantity = (idx) => (evt) => {
        const newCart = this.state.cartridgeForOrder.map((cartridge, sidx) => {
            if (idx !== sidx) return cartridge;
            return { ...newCart, quant: evt.target.value, name: this.state.cartridgeForOrder[idx].name };
        });

        this.setState({ cartridgeForOrder: newCart });
    }

    handleAddCartridgeOrder = () => {
        this.setState({
            cartridgeForOrder: this.state.cartridgeForOrder.concat([{ name: '', quant: '' }])
        });
    }

    handleRemoveCartridgeOrder = (idx) => () => {
        this.setState({
            cartridgeForOrder: this.state.cartridgeForOrder.filter((s, sidx) => idx !== sidx)
        });
    }


    submitCustomer() {
        var data = {
            name: this.state.name,
            phone: this.state.phone,
            streetaddress: this.state.streetaddress,
            city: this.state.city,
            state: this.state.state,
        }
        axios.post('/api/customers/insert', data)
            .then(response => {
                this.setState({ customerid: response.data[0].customerid })
                console.log(response.data)
            })
        this.setState({ customerAdded: !this.state.customerAdded })
        this.notify();

    }


    handleNext = () => {
        const { stepIndex } = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    };

    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };

    

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <div>
                        <Select
                            className="Select-inputTEST"
                            name="form-field-one"
                            placeholder="Existing company select"
                            value={this.state.value}
                            options={this.state.customers}
                            onChange={this.logChange} />

                        {this.state.currentCustomer.length !== 0 ?
                            <div className="customerInfoRM">
                                <div className="rowOne">
                                    <div className="aboveBelow">
                                        <input className="inputBoxR Name" value={this.state.currentCustomer.length === 0 ? ' ' : this.state.currentCustomer[0].name}></input>
                                    </div>
                                    <div className="aboveBelow">
                                        <input className="inputBoxR Phone" value={this.state.currentCustomer.length === 0 ? ' ' : this.state.currentCustomer[0].phone}></input>
                                    </div>
                                </div>
                                <div className="rowTwo">

                                    <div className="aboveBelow">
                                        <input className="inputBoxR Address" value={this.state.currentCustomer.length === 0 ? ' ' : this.state.currentCustomer[0].streetaddress}></input>
                                    </div>
                                    <div className="aboveBelow">
                                        <input className="inputBoxR City" value={this.state.currentCustomer.length === 0 ? ' ' : this.state.currentCustomer[0].city}></input>
                                    </div>
                                    <div className="aboveBelow">
                                        <input className="inputBoxR State" value={this.state.currentCustomer.length === 0 ? ' ' : this.state.currentCustomer[0].state}></input>
                                    </div>
                                </div>

                            </div>
                            :
                            <div className="customerInfoRM">
                                <div className="rowOne">
                                    <div className="aboveBelow">
                                        <input className="inputBoxR Name" placeholder="NAME" onChange={(e) => { this.handleChange(e.target.value, "name") }}></input>
                                    </div>
                                    <div className="aboveBelow">
                                        <input className="inputBoxR Phone" placeholder="PHONE" onChange={(e) => { this.handleChange(e.target.value, "phone") }}></input>
                                    </div>

                                </div>
                                <div className="rowTwo">

                                    <div className="aboveBelow">
                                        <input className="inputBoxR Address" placeholder="STREET ADDRESS" onChange={(e) => { this.handleChange(e.target.value, "streetaddress") }}></input>
                                    </div>
                                    <div className="aboveBelow">
                                        <input className="inputBoxR City" placeholder="CITY" onChange={(e) => { this.handleChange(e.target.value, "city") }}></input>
                                    </div>
                                    <div className="aboveBelow">
                                        <input className="inputBoxR State" placeholder="ST" onChange={(e) => { this.handleChange(e.target.value, "state") }}></input>
                                    </div>
                                </div>
                            </div>
                        }
                        
                    </div>
                    
                )
            case 1:
                return (
                <div className="buttons">
                <button className="repairButtond" onClick={this.setRepair}>REPAIR</button>
                <button className="deliveryButtond" onClick={this.setDelivery}>DELIVERY</button>

                </div>);
            case 2:
                return (
                                    <div>

{this.state.rdSetting === null ? null : this.state.rdSetting === "d" ?
                        //DELIVERY ***********************************************************************************************
                        <div>
                            <div className="rowForDeliveriesD">
                                <div className="colOneD">
                                    <input className="inputBoxD Name" onChange={(e) => { this.handleChange(e.target.value, "contactName") }} placeholder="CONTACT NAME"></input>
                                    <input className="inputBoxD Notes" onChange={(e) => { this.handleChange(e.target.value, "notes") }} placeholder="NOTES"></input>
                                    <span className="inputNames Tech">Tech:  </span>
                                    {/* <input className="inputBoxR Tech" onChange={(e) => { this.handleChange(e.target.value, "tech") }}></input> */}
                                    <div className="selectFormat">
                                        <select onChange={(e) => { this.handleChange(e.target.value, "tech") }} value={this.state.tech}>
                                            <option value="BB">BB</option>
                                            <option value="LE">LE</option>
                                            <option value="RD">RD</option>

                                        </select>
                                    </div>

                                </div>
                                <div className="colOneDC">
                                    <span className="cartridgesNameD">CARTRIDGES</span>
                                    <div>
                                        {this.state.cartridgeForOrder.map((cartridge, idx) => (
                                            <div className="cartQuantD">
                                                <input
                                                    type="text"
                                                    placeholder={`CARTRIDGE #${idx + 1}`}
                                                    value={cartridge.quant}
                                                    onChange={this.handleCartridgeOrderChangeQuantity(idx)}
                                                    className="cartNameD"
                                                />

                                                <select onChange={this.handleCartridgeOrderChangeName(idx)} className="quantD">
                                                    <option selected disabled>QUANTITY</option>
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
                                                <button type="button" className="removeButtonDE" onClick={this.handleRemoveCartridgeOrder(idx)}>-</button>
                                            </div>
                                        ))}


                                    </div>
                                    <div className="centerButtonD"><button type="button" onClick={this.handleAddCartridgeOrder} className="smallSAddD">+</button></div>

                                </div>

                            </div>
                            <div className="centerButtonD"><button onClick={this.submitDelivery} className="submit">Submit</button></div>

                        </div>

                        :
                        //REPAIR ***********************************************************************************************
                        <div>
                            <div className="rowOne">
                                <div className="aboveBelow">
                                    <input className="inputBoxR ContactNameRep" onChange={(e) => { this.handleChange(e.target.value, "contactName") }} placeholder="CONTACT NAME"></input>
                                </div>
                                <div className="aboveBelow">
                                    <input className="inputBoxR Printer" onChange={(e) => { this.handleChange(e.target.value, "printer") }} placeholder="PRINTER"></input>
                                </div>
                                <div className="aboveBelow">

                                    <input className="inputBoxR IDNum" onChange={(e) => { this.handleChange(e.target.value, "printerID") }} placeholder="PRINTER ID"></input>
                                </div>

                            </div>
                            <div className="rowTwo">

                                <div className="aboveBelow">
                                    <input className="inputBoxR Loc" onChange={(e) => { this.handleChange(e.target.value, "location") }} placeholder="LOCATION"></input>
                                </div>
                                <div className="aboveBelow">
                                    <span className="inputNames Tech">Tech:  </span>
                                    <select onChange={(e) => { this.handleChange(e.target.value, "tech") }}>
                                        <option value="BB">BB</option>
                                        <option value="LE">LE</option>
                                        <option value="RD">RD</option>

                                    </select>
                                </div>
                                <div className="aboveBelow">
                                    <input className="inputBoxR Notes" onChange={(e) => { this.handleChange(e.target.value, "notes") }} placeholder="NOTES"></input>
                                </div>
                            </div>
                            <div className="centerButtonD"><button onClick={this.submitRepair} className="submit">Submit</button></div>

                        </div>}
                </div>

                                    );
            default:
                return 'You\'re a long way from home sonny jim!';
        }
    }

    render() {
        
        return (
            <div>
                {this.props.children}
                <div>

                    <MuiThemeProvider>

                        <div style={{ width: '90%', height: '100%', margin: '50px' }}>
                            <Stepper activeStep={this.state.stepIndex}>
                                <Step>
                                    <StepLabel>Select customer</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Select Repair/Delivery</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel >Submit</StepLabel>
                                </Step>
                            </Stepper>
                            <div >
                                {this.state.finished ? (
                                    <span>
                                        <a
                                            href="#"
                                            onClick={(event) => {
                                                event.spanreventDefault();
                                                this.setState({ stepIndex: 0, finished: false });
                                            }}
                                        >
                                            Click here
              </a> to reset the example.
            </span>
                                ) : (
                                        <div>
                                            <span>{this.getStepContent(this.state.stepIndex)}</span>
                                            <div style={{ marginTop: 12 }}>
                                                <FlatButton
                                                    label="Back"
                                                    disabled={this.state.stepIndex === 0}
                                                    onClick={this.handlePrev}
                                                    style={{ marginRight: 12 }}
                                                />
                                                <RaisedButton
                                                    label={this.state.stepIndex === 2 ? 'Submit' : this.state.stepIndex === 0 && this.state.currentCustomer.length === 0 ? 'Add' : 'Next'}
                                                    disabled={this.state.stepIndex === 1 && this.state.rdSetting === null ? true : false }
                                                    primary={true}
                                                    onClick={this.state.stepIndex === 2 && this.state.rdSetting === 'd' ? () => this.submitDelivery() : this.state.stepIndex === 2 && this.state.rdSetting === 'r' ? () => this.submitRepair() : this.handleNext}
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </MuiThemeProvider>


                    
                </div>
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

        )
    }
}

RepairModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default RepairModal

