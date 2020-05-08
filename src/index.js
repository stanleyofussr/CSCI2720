import React from 'react'
import ReactDOM from 'react-dom'
import ShowList from "./stopList.js"
import NavigationBar from './navigationBar.js'



ReactDOM.render(<NavigationBar/>, document.querySelector("#navigationBar"));
ReactDOM.render(<ShowList/>, document.querySelector("#stopList"));
