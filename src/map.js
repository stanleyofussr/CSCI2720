import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

export default class Map extends React.Component{
	render() {
		var Stop = withGoogleMap(props => (
			<GoogleMap defaultCenter = {{lat: this.props.latitude, lng: this.props.longtitude}} defaultZoom = { 13 }>
				<Marker position={{lat: this.props.latitude, lng: this.props.longtitude}} />
			</GoogleMap>
		));
		return (
			<div>
				<Stop containerElement={ <div style={{ height: `400px`, width: '600px' }} /> } mapElement={ <div style={{ height: `100%` }} /> }/>
			</div>
		);
	}
}