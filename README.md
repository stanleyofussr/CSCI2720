# API LIST

## Sign up
__Request__
* Line: POST /signup
* Body: {"username": xxx, "pwd": xxx}

__Response__
* {"signup": 0}
* {"signup": 1}

## Log in
__Request__
* Line: POST /login
* Body: {"username": xxx, "pwd": xxx}

__Response__
* {"login": 0}
* {"login": 1}

## Log out
__Request__
* Line: POST /logout

__Response__
* {"logout": 1}

## Change password
__Request__
* Line: PUT /changePwd
* Body: {"pwd": xxx}

__Response__
* {"login": 0} (which means the user haven't logged in)
* {"pwdChanged": 1}

## Add a stop to one's favourite
__Request__
* Line: PUT /favourite/:stopname

__Response__
* {"login": 0}
* {"stopAdded": 1}

## View one's favourite
__Request__
* Line: GET /favourite

__Response__
* {"login": 0}
* (favourite list): [ "stopname1", "stopname2", ....]

## Remove a stop from one's favourite list
__Request__
* Line: DELETE /favourite/:stopname

__Response__
* {"login": 0}
* {'stopRemoved': 1} (remove successfully)
* {'inFavourite': 0} (unable to remove it because it's not in one's favourite)
