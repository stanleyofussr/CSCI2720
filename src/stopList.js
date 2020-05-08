import React from 'react';
import ReactDOM from 'react-dom';
const testData = [
    { _objectID: "asdf", stopname: "test1", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "asdf", stopname: "test2", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "asdf", stopname: "test3", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "asdf", stopname: "test4", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "asdf", stopname: "longlonglonglonglonglonglongTESTlonglonglong", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
];

export default class ShowList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stopListData: testData,
        };
    }

    render() {
        return (
            <div className="container">
                <div className="card-columns mt-3 text-center">
                    {this.state.stopListData.map(stop =>
                        <StopItem stopName={stop.stopname} longtitude={stop.longtitude} latitude={stop.latitude} commentNum={stop.comment.length} />
                    )}
                </div>
            </div>
        )
    }
}

class StopItem extends React.Component {

    render() {
        return (
            <div className="stopItem card bg-light">
                <div className="card-header">
                    <h4>{this.props.stopName}</h4>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        Location longtitude:
                    </h5>
                    <p className="card-text">{this.props.longtitude}</p>
                    <h5 className="card-title">
                        Location latitude:
                    </h5>
                    <p className="card-text">{this.props.latitude}</p>
                    <div className="text-center">
                        <small className="text-muted"><p className="card-text">Comment number: {this.props.commentNum}</p></small>
                    </div>
                </div>
            </div>
        )
    }
}
