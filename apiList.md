# ConnectDev APIs

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- POST /profile/view
- PATCH /profile/edit
- PATCH /profile/password //forgot password API

coneectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
  
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests/recieved
- GET /user/feed

Status: ignore, interested ,accepted, rejected