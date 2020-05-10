import React from 'react'
import Map from './map.js'

export default class StopDetail extends React.Component {
	// <Map latitude={this.props.latitude} longtitude={this.props.longtitude}/>
	render() {
		return (
			<div className="card p-5 m-6">
				<div className="mb-4">
					<h3>Location</h3>
					<Map latitude={this.props.latitude} longtitude={this.props.longtitude}/>
				</div>
				<div>
					<h3>Comment</h3>
					<Comments stopid={this.props.stopid} />
				</div>
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
		fetch('http://localhost:8000/comment/stopid/' + this.props.stopid, {
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
				{this.state.comments.map(comment => <CommentItem username={comment.username} content={comment.content} time={comment.time}/>)}
			</div>
		);
	}
}

class CommentItem extends React.Component {
	render() {
		return (
			<div>
				<div className="dropdown-divider"></div>
				<div className="mt-3 ml-4 mr-4">
					<p style={{color: "#606270", fontSize: "20px"}}>{this.props.username}</p>
					<p style={{fontSize: "20px"}}>{this.props.content}</p>
					<p style={{color: "#A5A6AD", fontSize: "15px"}}><i>{this.props.time}</i></p>
				</div>
			</div>
		);
	}
}