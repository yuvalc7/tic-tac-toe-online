# about the project 
In this project I built an multiple online checkers game (there can be more the one board) according to checkers game rules  
The game board is represented by an 8x8 matrix.   
0 is an empty cell    
1 represent a red player   
2 represent a black player     
3 represent a queen of a red player     
4 represent a queen of a black player   

With socket.io, communication between client and server takes place.    
Communication emit/on:    
     create a game,    
     join an existing game,    
     move player piece,    
     color of player turn,    
     each game add to games,  
     disconnect (server reload),    
     end of game (opponent leave game or refresh page),  
     winner of the game (no more piece for red / black player)  
     
     
## technologies:    
           Front-end: React    
           Back-end: NodeJS  


## how to run
### npm install  
### open 2 terminal:         
                  - cd client  
                     - npm start (will open browser in http://localhost:3000/ )
                  - cd server  
                     - npm start       
### open second windows in browser (`http://localhost:3000/`)  
### create game in one browser and join in second browser     
### play !!
