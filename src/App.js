
import React, { Component } from 'react';
import './App.css';
import ListItem from './components/ListItem'
// import {ipcRenderer} from 'electron'

//  const electron = window.require('electron');
// const fs = electron.remote.require('fs');
// const ipcRenderer = electron.ipcRenderer;

class App extends Component {

  state ={
    items : ['mango','bananna','apple']
  }
  handle =(e)=>{
    e.target.remove()
  }
  componentDidMount = () => {
    if (window.ipc) {
      window.ipc.on('item:publish', this.publishItem )
    }
  }
  publishItem = (event, item) =>{
    this.setState({
      items: [...this.state.items, item]
    })         
  }
  componentWillUnmount(){
    window.ipc.removeListener('item:publish', this.publishItem)
  }
  render() {
    // console.log(electron);
    // if (window.ipc) {
    //   window.ipc.on('item:publish', (event, item) => {
    //     console.log('event happing')
    //     console.log(item)
    //     this.setState({
    //       items: [...this.state.items, item]
    //     })
    //     item = ""
    //   })
    // }

    return (
      <div className="App">
        <header className="App-header">

          <h1 className="App-title">Welcome to Electron React Desktop Test  Application</h1>
        </header>
        <div className="wrapper">
          <ListItem handle={this.handle} items ={this.state.items} />
        </div>
        
         
      </div>
    );
  }
}

export default App;
