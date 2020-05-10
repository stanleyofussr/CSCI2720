import React from 'react'
import Map from './map.js'

export default class StopDetail extends React.Component {
	// <Map latitude={this.props.latitude} longtitude={this.props.longtitude}/>
	render() {
		return (
			<div className="card p-5 m-6">
				<Comments stopid={this.props.stopid} />
			</div>
		);
	}
}

class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: []
		}
	}
	componentWillReceiveProps(nextProps) {
		fetch('http://localhost:8000/comment/stopid/' + nextProps.stopid, {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
        	if(data.admin == undefined && data.username == undefined) {
        		this.setState({comments: data})
        	}
        });
	}
	render() {
		return (
			<div>
				<p>Comment</p>
				{this.state.comments.map(comment => <CommentItem username={comment.username} content={comment.content} time={comment.time}/>)}
			</div>
		);
	}
}

class CommentItem extends React.Component {
	render() {
		return (
			<div>
				<div class="dropdown-divider"></div>
				<p>{this.props.username}</p>
				<p>{this.props.content}</p>
				<p>{this.props.time}</p>
			</div>
		);
	}
}