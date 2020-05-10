import React from 'react'
import Map from './map.js'

export default class StopDetail extends React.Component {
	render() {
		return (
			<div>
				<Map latitude={this.props.latitude} longtitude={this.props.longtitude}/>
			</div>
		);
	}
}