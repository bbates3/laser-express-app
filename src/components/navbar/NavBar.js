import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import LELogoWhite from "./LE White.svg"

import "./NavBar.css"

export default class NavBar extends Component {
    render() {
        return (
            <div className="NavBarContainer">


                <div className="tabs">
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" exact to="/deliveries">DELIVERIES</NavLink>
                    <div className="divider"></div>
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" exact to="/repairs">REPAIRS</NavLink>
                    <div className="divider"></div>
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" exact to="/orders">ORDERS</NavLink>
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" to="/dashboard"><img src={LELogoWhite} className="logoNav" alt="logo" /></NavLink>
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" exact to="/customers">CUSTOMERS</NavLink>
                    <div className="divider"></div>
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" exact to="/toners">TONERS</NavLink>
                    <div className="divider"></div>
                    <NavLink className="tabbedLinks" activeClassName="tabbedLinksActive" exact to="/insight">INSIGHT</NavLink>
                </div>


            </div>

        )
    }
}