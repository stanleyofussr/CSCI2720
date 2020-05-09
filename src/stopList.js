import React from 'react';
import $ from 'jquery';
import StopDetail from './stopDetail.js'

const testData = [
    { _objectID: "1", stopname: "test1", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "2", stopname: "test2", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "3", stopname: "test3", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "4", stopname: "test4", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "5", stopname: "test5", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "6", stopname: "test6", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "7", stopname: "test7", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "8", stopname: "test8", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
    { _objectID: "9", stopname: "longlonglonglonglonglonglongTESTlonglonglong", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
];
const favourite = [
    { _objectID: "4", stopname: "test4", longtitude: 123.21, latitude: 32.123, arrival: [12.32, 13.32], comment: ['test', 'test2'] },
];

export default class StopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stopListData: testData,
            filteredData: testData,
            favourite: favourite,
            temp: null,
            page: "stoplist",
            username : this.props.username,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page == "favourite") {
            switch (nextProps.searchType) {
                case "stopname":
                    this.setState({
                        filteredData: favourite.filter(item => {
                            if (item.stopname.toLowerCase().includes(nextProps.search.toLowerCase()))
                                return true;
                            return false;
                        }),
                    });
                    break;
                case "longitude":
                    this.setState({
                        filteredData: favourite.filter(item => {
                            if (item.stopname.toString().includes(nextProps.search))
                                return true;
                            return false;
                        }),
                    });
                    break;
                case "latitude":
                    this.setState({
                        filteredData: favourite.filter(item => {
                            if (item.latitude.toString().includes(nextProps.search))
                                return true;
                            return false;
                        }),
                    });
                    break;
            }
        }
        else {
            switch (nextProps.searchType) {
                case "stopname":
                    this.setState({
                        filteredData: this.state.stopListData.filter(item => {
                            if (item.stopname.toLowerCase().includes(nextProps.search.toLowerCase()))
                                return true;
                            return false;
                        }),
                    });
                    break;
                case "longitude":
                    this.setState({
                        filteredData: this.state.stopListData.filter(item => {
                            if (item.stopname.toString().includes(nextProps.search))
                                return true;
                            return false;
                        }),
                    });
                    break;
                case "latitude":
                    this.setState({
                        filteredData: this.state.stopListData.filter(item => {
                            if (item.latitude.toString().includes(nextProps.search))
                                return true;
                            return false;
                        }),
                    });
                    break;
            }
        }
    }

    //FOR USER, add the location to favourite
    addFavHandler = (name, event) => {
        //TODO Ajax
        var index = testData.findIndex(element => element.stopname == name);
        var stopData = testData[index];
        this.setState({
            temp: favourite.push(stopData)
        })
        alert("Location has been added to your favourite.")
    }

    //FOR USER, delete the location from favourite
    delFavHandler = (name, event) => {
        //TODO Ajax
        var index0 = favourite.findIndex(element => element.stopname == name);
        var index1 = this.state.filteredData.findIndex(element => element.stopname == name)
        
        this.setState({
            temp: favourite.splice(index0, 1),
            temp: this.state.filteredData.splice(index1 ,1)
        })
        alert("Location has been removed from your favourite.")
    }

    //FOR ADMIN, delete the location from database
    delItemHandler = event => {
        //TODO Ajax
    }

    inFavChecker = (value, item) => {
        if (item.stopname == value)
            return true;
        return false;
    }

    render() {
        return (
            <div className="container">
                <div className="card-columns mt-3 text-center">
                    {this.state.filteredData.map(stop =>
                        <StopItem key={stop._objectID} stopName={stop.stopname} longtitude={stop.longtitude} latitude={stop.latitude} commentNum={stop.comment.length}
                            addFavHandler={this.addFavHandler} delFavHandler={this.delFavHandler} inFavourite={favourite.find(element => element.stopname == stop.stopname)} />
                    )}
                </div>
                {this.state.stopListData.map(stop =>
                    <StopDetail stopName={stop.stopname} isAdmin={true} />
                )}
            </div>
        )
    }
}

class StopItem extends React.Component {
    render() {
        return (
            <div className="stopItem card bg-light">
                <div className="card-header">
                    <div className="row">
                        <div className="col-10 text-left"><h4>{this.props.stopName}</h4></div>
                        <div className="col-2 d-flex justify-content-center align-items-center">
                            {this.props.inFavourite ? (
                                <svg data-toggle="popover" data-content="Some" onClick={(e) => this.props.delFavHandler(this.props.stopName, e)} className="bi bi-heart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="#ea0000" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" clipRule="evenodd" />
                                </svg>) : (
                                    <svg onClick={(e) => this.props.addFavHandler(this.props.stopName, e)} className="bi bi-heart" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z" clipRule="evenodd" />
                                    </svg>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Location longtitude:</h5>
                    <p className="card-text">{this.props.longtitude}</p>
                    <h5 className="card-title">Location latitude:</h5>
                    <p className="card-text">{this.props.latitude}</p>
                    <div className="text-center">
                        <small className="text-muted"><p className="card-text">Comment number: {this.props.commentNum}</p></small>
                    </div>
                </div>
                <div className="card-footer text-primary">
                    <a className="btn" data-toggle="modal" data-target={"#Modal" + this.props.stopName}>Location detail</a>
                </div>

            </div>
        )
    }
}

class SortSelector extends React.Component {

}