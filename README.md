# API LIST

## Sign up
__Request__
* Line: POST /signup
* Body: ``` {"username": xxx, "pwd": xxx} ```

__Response__
* ``` {"signup": false} ``` (sign up fail)
* ``` {"signup": true} ``` (sign up success)

## Log in as a user
__Request__
* Line: POST /login
* Body: ``` {"username": xxx, "pwd": xxx} ```

__Response__
* ``` {"username": null, "admin": false} ```
* ``` {"username": "xxxxx", "admin": false} ```

## Log out as a user or an admin
__Request__
* Line: POST /logout

__Response__
* ``` {"username": null, "admin": false} ```

## Change password
__Request__
* Line: PUT /changePwd
* Body: {"pwd": xxx}

__Response__
* ``` {"username": null} ``` (which means the user haven"t logged in)
* ``` {"pwdChanged": true} ```

## Add a stop to one"s favourite
__Request__
* Line: PUT /favourite/:stopname

__Response__
* ``` {"username": null} ```
* ``` {"stopAdded": true} ```
* ``` {"stopAdded": false} ```

## Get one"s favourite stop list
__Request__
* Line: GET /favourite

__Response__
* ``` {"username": null} ```
* ``` [ "stopname1", "stopname2", ....] ``` (favourite list)

## Remove a stop from one"s favourite list
__Request__
* Line: DELETE /favourite/:stopname

__Response__
* ``` {"username": null} ```
* ``` {"stopRemoved": true} ``` (remove successfully)
* ``` {"inFavourite": false} ``` (unable to remove it because it"s not in one"s favourite)

## Log in as an admin
__Request__
* Line: POST /adminLogIn

__Response__
* ``` {"username": null, "admin": true} ```

## Delete a user
__Request__
* Line: DELETE /user/:username

__Response__
* ``` {"admin": false} ``` (you are not an admin)
* ``` {"deleted": true} ``` (remove successfully)
* ``` {"deleted": false} ``` (unable to delete it because it"s not in db)

## Delete a bus stop
__Request__
* Line: DELETE /stop/:stopId

__Response__
* ``` {"admin": false} ``` (you are not an admin)
* ``` {"deleted": true} ``` (remove successfully)
* ``` {"deleted": false} ``` (unable to delete it because it"s not in db)

## Get all bus stops
__Request__
* Line: GET /stop

__Response__
* ``` {"admin": false, "username": null} ```
* stop list, same as format in db


## Flush stops
__Request__
* Line: POST /flush/stop
* Body: 
```Js
{
	"stops": [
	    {
	        "stopid": "xxxx",
	        "stopname": "xxxx",
	        "longtitude": 123,
	        "latitude": 123,
	    },
	    ...,
	    ...,
	]
}
```
__Response__
* ``` { "flush": true } ```
* ``` { "admin": false } ```

## Reload comment for each stop
__Request__
* Line: POST /flush/comment

__Response__
* ``` { "flush": true } ```
* ``` { "admin": false } ```

## Reload arrival time for each stop
__Request__
* Line: POST /flush/arrival
* Body:
```Js
{
	"arrival": 
	[
		{
			"stopid": "xxxx",
			"route": "xxxx",
			"dir": "x",
			"co": "xxx",
			"seq": 1, // 第几站
			"time": [time1, time2, time3], // date format 未来三个arrival time
			"dest": "xxxx" // stop name
		},
		...,
		...,
	]
}
```

__Response__
* ```{ 'flush': true }```
* ```{ 'admin': false }```

## Get comments by stopid
__Request__
* Line: GET /comment/stop/:stopid

__Response__
*
```Js
[ 
    {
        "_id": "5eb68a9db0839e58faf92238",
        "username": "wanru",
        "stopid": "000001",
        "content": "test comment",
        "time": "2020-01-01T00:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "5eb68ab2b0839e58faf92239",
        "username": "wanru",
        "stopid": "000001",
        "content": "test comment",
        "time": "2020-01-01T00:00:00.000Z",
        "__v": 0
    }
] // comment list
```
* ``` { "admin": false, "username": null } ```

## Comment on a stop
__Request__
* Line: POST /comment/stop/:stopid
* Body: ```{content: "xxx"}```

__Response__
* ``` { "comment" : true } ```
* ``` { "username": null } ```


## Test API
__Request__
* Line: POST /comment

__Response__
* ``` { "comment": true} ```



