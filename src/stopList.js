import React from 'react';
import StopDetail from './stopDetail.js'

const testData = [
    { stopid: "000001", stopname: "test1", longtitude: 123, latitude: 123, comment: [] },
    { stopid: "000002", stopname: "test2", longtitude: 143, latitude: 56, comment: [] },
    { stopid: "000003", stopname: "test3", longtitude: 23, latitude: 11, comment: [] },
    { stopid: "000004", stopname: "test4", longtitude: 45, latitude: 9, comment: [] },
    { stopid: "000005", stopname: "test5", longtitude: 12, latitude: 145, comment: [] },
    { stopid: "000006", stopname: "test6", longtitude: 67, latitude: 123, comment: [] },
]

export default class StopList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stopListData: testData,
            filteredData: testData,
            favourite: [],
            temp: null,
            page: "stoplist",
            username: this.props.username,
            admin: this.props.admin,
            order: "down",
            field: "name",
            searchType: "name",
            searchContent: "",
        };

        var stopList;
        var favouriteList;

        /*
            fetch('http://localhost:8000/stop/', {
                method: 'get',
                mode: 'cors',
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => {
                    if (data.login != 0 || data.login == null) {
                        stopList = data;
                    }
                    this.setState({
                        stopListData: stopList,
                        filteredData: stopList,
                    })
                });
    */
        fetch('http://localhost:8000/favourite/', {
            method: 'get',
            mode: 'cors',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.login != 0 || data.login == null) {
                    favouriteList = data;
                }
                this.setState({
                    favourite: favouriteList
                })
            });


    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page == "favourite") {
            switch (nextProps.searchType) {
                case "stopname":
                    this.setState({
                        filteredData: this.state.favourite.filter(item => {
                            if (item.stopname.toLowerCase().includes(nextProps.search.toLowerCase()))
                                return true;
                            return false;
                        }),
                    });
                    break;
                case "longitude":
                    this.setState({
                        filteredData: this.state.favourite.filter(item => {
                            if (item.stopname.toString().includes(nextProps.search))
                                return true;
                            return false;
                        }),
                    });
                    break;
                case "latitude":
                    this.setState({
                        filteredData: this.state.favourite.filter(item => {
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
        fetch('http://localhost:8000/favourite/' + name, {
            method: 'put',
            mode: 'cors',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.stopAdded == 1) {
                    var index = this.state.stopListData.findIndex(element => element.stopname == name);
                    var stopData = this.state.stopListData[index];
                    this.setState({
                        temp: this.state.favourite.push(stopData)
                    })
                }
            });
    }

    //FOR USER, delete the location from favourite
    delFavHandler = (name, event) => {
        fetch('http://localhost:8000/favourite/' + name, {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.stopRemoved == 1) {
                    console.log(data)
                    var index0 = this.state.favourite.findIndex(element => element.stopname == name);
                    var favorite = this.state.favourite
                    this.setState({
                        temp: favorite.splice(index0, 1),
                    })
                }
            })
    }

    //TODO: FOR SORTING
    sorting = (sortBy, type, event) => {
        var sortedData = this.state.filteredData.sort((data1, data2) => {
            var a = data1[sortBy];
            var b = data2[sortBy];
            if (type == "up")
                return a > b;
            else
                return b > a;
        })
        this.setState({
            filteredData: sortedData
        })
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
    changeOrder = (e) => {
        if(this.state.order=="up")
            this.setState({order: "down"});
        else
            this.setState({order: "up"});
    }
    fieldToDistance = (e) => {
        this.setState({field: "dist"});
    }
    fieldToName = (e) => {
        this.setState({field: "name"});
    }
    fieldToRoute = (e) => {
        this.setState({field: "route"});
    }
    searchTypeToName = (e) => {
        this.setState({searchType: "name"});
    }
    searchTypeToRoute = (e) => {
        this.setState({searchType: "route"});
    }
    handleSearchContent = (e) => {
        this.setState({searchContent: e.target.value});
    }
    render() {
        return (
            <div className="container mt-3">
                <div className="row d-flex align-items-center">
                    <div className="col-2"></div>
                    <SearchBar searchType={this.state.searchType} searchTypeToName={this.searchTypeToName} searchTypeToRoute={this.searchTypeToRoute} handleSearchContent={this.handleSearchContent}/>
                </div>
                <div className="row">
                    <div className="col-6"></div>
                    <SortBar changeOrder={this.changeOrder} order={this.state.order} fieldToName={this.fieldToName} fieldToRoute={this.fieldToRoute} fieldToDistance={this.fieldToDistance}/>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="card-columns mt-3 text-center">
                        {this.state.filteredData.map(stop =>
                            <StopItem key={stop._objectID} stopName={stop.stopname} longtitude={stop.longtitude} latitude={stop.latitude} commentNum={stop.comment.length}
                                addFavHandler={this.addFavHandler} delFavHandler={this.delFavHandler} inFavourite={this.state.favourite.find(element => element.stopname == stop.stopname)} />
                        )}
                    </div>
                </div>
                <StopDetail latitude={22.283948002091} longtitude={114.15630946053} stopid={"000001"}/>
                <button className="button btn btn-primary" onClick={(e) => this.sorting("longtitude", "up", e)}>click</button>
            </div >
        )
    }
}

class StopItem extends React.Component {
    render() {
        return (
            <div className="card mb-3">
                <div className="row no-gutters">
                    <div className="col-md-4 bg-light d-flex justify-content-center align-items-center">
                        <div><h2 className="font-weight-normal text-body text-wrap">{this.props.stopName}</h2></div>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <span className="float-right">
                                {this.props.inFavourite ? (
                                    <svg data-toggle="popover" data-content="Some" onClick={(e) => this.props.delFavHandler(this.props.stopName, e)} className="bi bi-heart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="#ea0000" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" clipRule="evenodd" />
                                    </svg>) : (
                                        <svg onClick={(e) => this.props.addFavHandler(this.props.stopName, e)} className="bi bi-heart" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z" clipRule="evenodd" />
                                        </svg>
                                    )
                                }
                            </span>
                            <div className="row">
                                <div className="col-6">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </div>
                                <div className="col-6">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class SearchBar extends React.Component {
    render() {
        return (
            <div className="input-group col-8">
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.searchType=="name"?"Name": "Route"}</button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <button className="dropdown-item" onClick={(e) => this.props.searchTypeToName(e)}>Name</button>
                        <button className="dropdown-item" onClick={(e) => this.props.searchTypeToRoute(e)}>Route</button>
                    </div>
                </div>
                <input type="text" className="form-control" placeholder="Search" onChange={(e) => this.props.handleSearchContent(e)}/>
            </div>
        )
    }
}
class SortBar extends React.Component {

    render() {
        return (
            <div>
                <div className="container mt-3">
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className="btn btn-secondary active" onClick={(e) => this.props.fieldToName(e)}>
                            <input type="radio" name="options" checked /> Name
                        </label>
                        <label className="btn btn-secondary" onClick={(e) => this.props.fieldToRoute(e)}>
                            <input type="radio" name="options" /> Route
                        </label>
                        <label className="btn btn-secondary" onClick={(e) => this.props.fieldToDistance(e)}>
                            <input type="radio" name="options" /> Distance from home
                        </label>
                    </div>
                    <button className="btn btn-outline-secondary ml-1 float-center" onClick={(e) => this.props.changeOrder(e)}>
                        <svg viewBox="0 0 512 512" width="24px">
                            {this.props.order=="down" ?
                                <path fill="currentColor" d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.39-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160z"></path>
                                :
                                <path fill="currentColor" d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm-64 0h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352z"></path>
                            }
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
}

class SortSelector extends React.Component {

}