# API LIST

## Sign up
__Request__
* Line: POST /signup
* Body: {"username": xxx, "pwd": xxx}

__Response__
* {"signup": 0}
* {"signup": 1}

## Log in as a user
__Request__
* Line: POST /login
* Body: {"username": xxx, "pwd": xxx}

__Response__
* {"username": null}
* {"username": "xxxxx"}

## Log out as a user or an admin
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

## View one's favourite stop list
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

## Log in as an admin
__Request__
* Line: POST /adminLogIn

__Response__
* {"login": 1}

## Delete a user
__Request__
* Line: DELETE /user/:username

__Response__
* {'authority': 0} (you are not an admin)
* {'deleted': 1} (remove successfully)
* {'deleted': 0} (unable to delete it because it's not in db)

## Delete a bus stop
__Request__
* Line: DELETE /stop/:stopname

__Response__
* {'authority': 0} (you are not an admin)
* {'deleted': 1} (remove successfully)
* {'deleted': 0} (unable to delete it because it's not in db)
