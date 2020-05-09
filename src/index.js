import React from 'react'
import ReactDOM from 'react-dom'
import StopList from "./stopList.js"

/* upper layer */
class Project extends React.Component {
	constructor(props) {
		super(props);
		this.state = {username: null, admin: false, page: "stops", search: ""};
		if(window.location.href=='http://localhost:3000/admin') {
			// admin log in
			fetch('http://localhost:8000/adminLogIn', {
				method: 'get',
				mode: 'cors',
				credentials: 'include',
			})
			.then(res => res.json())
			.then(data => {
				if(data.admin) {
					this.setState({username: data.username, admin: data.admin});
					alert("Log in as admin successfully");
				}
				else
					alert("Failed to log in as admin");
			});
		}
		else {
			/* get login status */
			fetch('http://localhost:8000/username', {
				method: 'get',
				mode: 'cors',
				credentials: 'include',
			})
			.then(res => res.json())
			.then(data => {
				this.setState({username: data.username, admin: data.admin});
			});
		}
	}
	/* test login */
	login = (e) => {
		var details = {
			'username': 'test',
			'pwd': 'test'
		};
		var formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		formBody = formBody.join("&");

		fetch('http://localhost:8000/login', {
			method: 'post',
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: formBody
		})
		.then(res => res.json())
		.then(data => {
			this.setState({username: data.username, admin: data.admin});
		});
	}

	/* test logout */
	logout = (e) => {
		fetch('http://localhost:8000/logout', {
			method: 'post',
			mode: 'cors',
			credentials: 'include',
		})
		.then(res => res.json())
		.then(data => {
			if(data.logout == 1)
				this.setState({username: null, admin: false});
		});
	}

	handleSearchChange = (e) => {
		this.setState({search: e.target.value});
	}
	clickStops = (e) => {
		this.setState({page: "stops"});
	}
	clickFavorUser = (e) => {
		if(this.state.username != null) {
			this.setState({page: "favourite"});
		} else {
			this.setState({page: "users"});
		}
	}
	render() {
		return (
			<div>
				<NavigationBar username={this.state.username} admin={this.state.admin} handleSearchChange={this.handleSearchChange}
					logout={this.logout} login={this.login} clickStops={this.clickStops} clickFavorUser={this.clickFavorUser} page={this.state.page}/>
				<div id="log"></div>
				{this.state.username==null&&(!this.state.admin) ? null:<StopList searchType = "stopname" page={this.state.page} search={this.state.search} />  }
				<div id="userList"></div>
				<div id="stopInfo"></div>
			</div>
		);
	}
}

class NavigationBar extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#A8D0E7"}}>
				<a className="navbar-brand" href="#" style={{fontSize: "25px"}}>{"BUS"}</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarText">
					<ul className="navbar-nav mr-auto">
						{(!this.props.admin)&&this.props.username==null ? null:
						<li className={this.props.page=="stops"?"active": ""} style={{margin: "auto 5px"}} onClick={(e) => this.props.clickStops(e)}>
							<a className="nav-link" href="#" style={{fontSize: "18px"}}>{"Stops"}<span className="sr-only">(current)</span></a>
						</li>}
						{(!this.props.admin)&&this.props.username==null ? null:
						<li className={this.props.page!="stops"?"active": ""} style={{margin: "auto 5px"}} onClick={(e) => this.props.clickFavorUser(e)}>
							<a className="nav-link" href="#" style={{fontSize: "18px"}}>{this.props.admin?"Users":"Favourite"}</a>
						</li>}
						{(!this.props.admin)&&this.props.username==null ? null:
						<form className="form-inline">
	    					<input className="form-control mr-sm-2" type="search" placeholder="Search" onChange={(e) => this.props.handleSearchChange(e)}/>
	  					</form>}
					</ul>
					<LogInStatus username={this.props.username} admin={this.props.admin} login={this.props.login} logout={this.props.logout}/>
				</div>
			</nav>
		);
	}
}

class LogInStatus extends React.Component {
	
	render() {
		if(this.props.admin == false)
			return (
				<span>
					{this.props.username == null ? <SignUp/> : <a>{this.props.username}</a>}
					{this.props.username == null ? <LogIn login={this.props.login}/> : <LogOut logout={this.props.logout}/>}
				</span>
			);
		return (
			<span>
				<a>{"Admin"}</a>
				<LogOut logout={this.props.logout}/>
			</span>
		);
	}
}

class LogIn extends React.Component {
	constructor(props){
		super(props);
		this.state = {hover: false}
	}
	enter = e => {this.setState({hover: true});}
	leave = e => {this.setState({hover: false});}
	render() {
		return (
			<span className="logIcon" onMouseEnter={(e) => this.enter(e)} onMouseLeave={(e) => this.leave(e)} onClick={(e) => this.props.login(e)}>
				<svg focusable="false" viewBox="0 0 512 512" width="28px">
					<title>{"Log In"}</title>
					<path fill={this.state.hover?"#656B6F":"black"} d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>;
				</svg>
			</span>
		);
	}
}
class LogOut extends React.Component {
	constructor(props){
	    super(props);
	    this.state = {hover: false}
	}
	enter = e => {this.setState({hover: true});}
	leave = e => {this.setState({hover: false});}
	render() {
		return (
			<span className="logIcon" onMouseEnter={(e) => this.enter(e)} onMouseLeave={(e) => this.leave(e)} onClick={(e) => this.props.logout(e)}>
				<svg focusable="false" viewBox="0 0 512 512" width="28px">
					<title>{"Log Out"}</title>
					<path fill={this.state.hover?"#656B6F":"black"} d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
				</svg>
			</span>
		);
	}
}

class SignUp extends React.Component {
	constructor(props){
	    super(props);
	    this.state = {hover: false}
	}
	enter = e => {this.setState({hover: true});}
	leave = e => {this.setState({hover: false});}
	render() {
		return (
			<span className="logIcon" onMouseEnter={(e) => this.enter(e)} onMouseLeave={(e) => this.leave(e)}>
				<svg focusable="false" viewBox="0 0 640 512" width="28px">
					<title>{"Sign Up"}</title>
					<path fill={this.state.hover?"#656B6F":"black"} d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
				</svg>
			</span>
		);
	}
}

ReactDOM.render(<Project/>, document.getElementById('project'));
