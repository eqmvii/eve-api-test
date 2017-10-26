import React, { Component } from 'react';
import './App.css';

// Client ID: 9b66dbb382374c74aa8d7a6d3d20f475

class App extends Component {
  constructor(props) {
    super(props); // required in the constructor of a React component
    this.state = { data: "No request/response from the server yet..." };

    // bind this for use in below callback
    // Not using an arrow function to preserve readability 
    var that = this;

    // test connection to the server by fetching data to display
    fetch('/test')
      .then(function (res) {
        if (res.ok) {
          return res.json();
        } else {
          return "Error: Tried, but failed, to get data from the server.";
        }
      })
      .then(function (res) {
        console.log(res);
        that.setState({ data: res });
      })
  }

  render() {
    // var sso_query= "https://login.eveonline.com/oauth/authorize";
    var sso_query = "https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=http://localhost:3001/callback&client_id=9b66dbb382374c74aa8d7a6d3d20f475&scope=characterLocationRead&state=eqmviistate1";
    
    /*
    response_type: Must be set to “code”.
    redirect_uri: After authentication the user will be redirected to this URL on your website. It must match the definition on file in the developers site.
    client_id: A string identifier for the client, provided by CCP.
    scope: The requested scopes as a space delimited string.
    state: An opaque value used by the client to maintain state between the request and callback. The SSO includes this value when redirecting back to the 3rd party website. While not required, it is important to use this for security reasons. http://www.thread-safe.com/2014/05/the-correct-use-of-state-parameter-in.html explains why the state parameter is needed.
    */
    
    
    return (
      <div className="App">
        <p>Hello, user. Why don't you lgin?</p>
        <p>Server response: {this.state.data} </p>
        <a href={sso_query}>
          <img src="https://images.contentful.com/idjq7aai9ylm/4PTzeiAshqiM8osU2giO0Y/5cc4cb60bac52422da2e45db87b6819c/EVE_SSO_Login_Buttons_Large_White.png?w=270&h=45" />
        </a>
      </div>
    );
  }
}

export default App;
