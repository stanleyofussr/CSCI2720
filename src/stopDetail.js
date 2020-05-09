import React from 'react'

export default class StopDetail extends React.Component {
	render() {
		return (
			<div className="modal fade bd-example-modal-lg" id={"Modal" + this.props.stopName} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">{this.props.stopName}</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							{this.props.stopName}
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary">Save changes</button>
							{this.props.isAdmin ? (
								<button type="button" className="btn btn-danger">delete</button>
							):null}
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}