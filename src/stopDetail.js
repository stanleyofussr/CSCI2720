import React from 'react'
import Map from './map.js'

export default class StopDetail extends React.Component {
	// <Map latitude={this.props.latitude} longtitude={this.props.longtitude}/>
	constructor(props) {
		super(props);
		this.state = {
			stopid: this.props.stopid,
		}
		console.log(this.state.stopid)
	}

	render() {
		return (
			<div className="card p-5 m-6">
				<div className="mb-4">
					<div className="row mb-3">
						<div className="col-lg-5"><hr></hr></div>
						<div className="col-lg-2 text-center"><h3>Detail</h3></div>
						<div className="col-lg-5"><hr></hr></div>
					</div>
					<div className="">
						{this.props.stopid}
					</div>
				</div>
				<div className="mb-4">
					<div className="row mb-3">
						<div className="col-lg-5"><hr></hr></div>
						<div className="col-lg-2 text-center"><h3>Map</h3></div>
						<div className="col-lg-5"><hr></hr></div>
					</div>
					<div className="d-flex justify-content-center">
						<Map latitude={this.props.latitude} longtitude={this.props.longtitude} />
					</div>
				</div>
				<div>
					<div className="row mb-3">
						<div className="col-lg-5"><hr></hr></div>
						<div className="col-lg-2 text-center"><h3>Comment</h3></div>
						<div className="col-lg-5"><hr></hr></div>
					</div>
					<Comments stopid={this.props.stopid} />
					<hr></hr>
				</div>
				<div className="btn btn-light float-center" onClick = {this.props.close}>Close stop detail</div>
			</div>
		);
	}
}
class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: [{ username: "luolu", content: "hello", time: "2019-02-14" },
			{ username: "wanru", content: "hi", time: "2019-02-14" },
			{ username: "luolu", content: "i'm testing", time: "2019-02-14" }],
			newComment: '',
			temp: null
		}
		/*
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
		*/
	}

	postComment = (event) => {
		//TODO fetch, send comment to backend
		//TODO get new comments.
	}

	inputHandler = event => {
		this.setState({
			newComment: event.target.value,
		})
	}

	render() {
		return (
			<div>
				{this.state.comments.map(comment => <CommentItem username={comment.username} content={comment.content} time={comment.time} />)}
				<hr></hr>
				<div className="form-group container">
					<label className = "text-muted text font-weight-bold" for="newComment">Your comments: </label>
					<textarea className="form-control" id="newComment" rows="3" onChange = {this.inputHandler}></textarea>
					<div className = "d-flex mt-2 justify-content-end">
						<button className = "btn btn-secondary btn-sm" onClick= {this.postComment}>Post comment</button>
					</div>
				</div>
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
					<h5 style={{ color: "#606270", fontSize: "20px" }}>{this.props.username}:</h5>
					<p className="ml-4 mr-4 mb-0" style={{ fontSize: "18px" }}>{this.props.content}</p>
					<p className="text-right mr-1" style={{ color: "#A5A6AD", fontSize: "15px" }}><small><i>{this.props.time}</i></small></p>
				</div>
			</div>
		);
	}
}