var database ,dog,dog1,dog2
var position
//var form
var feed,add
var foodobject
var Feedtime
var Lastfeed = Feedtime;
var gameState, changeState, readState; 
var bedroomImg, gardenImg, washroomImg; 


//Create variables here

function preload()

{
  
  dogimg1 = loadImage("images/dogImg.png");
  dogimg2 = loadImage("images/dogImg1.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodobject=new Milk();
  dog = createSprite(550,365,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  var dogo = database.ref('Food');
  dogo.on("value", readPosition);
  feed = createButton("FEED THE DOG MILK");
  feed.position(1100,500);
  feed.mousePressed(FeedDog);
  add = createButton("ADD MORE MILK");
  add.position(1100,455);
  add.mousePressed(AddFood);

  readState = database.ref("gameState");
  readState.on("value", function (data){
    gameState = data.val();
  });

} 

function draw(){
 background(255);

 foodobject.display();

 Feedtime = database.ref('FeedTime');
 Feedtime.on("value",function(data){
   Lastfeed = data.val();
 })

 currentTime = hour();
 if(currentTime == (Lastfeed + 1)){
   update("Playing");
   foodobject.garden();
 }else if(currentTime == (Lastfeed + 2)){
   update("Sleeping");
   foodobject.bedroom();
 }else if(currentTime > (Lastfeed + 2) && currentTime <= (Lastfeed + 4)){
   update("Bathing");
   foodobject.washroom();
 }else{
   update("Hungry");
   foodobject.display();
 }


 if(gameState != "Hungry"){ 
  feed.hide();
  add.hide();
  dog.remove();
}else{
  feed.show();
  add.show();
  dog.addImage(dogimg1);
  dog.scale = 0.2;
  textSize(20);
  textFont("Aharoni");
  fill("black");
  text("See! The Dog Is Hungry Now....",10,20);
  text("Press On 'ADD FOOD' Button To Add Food,",10,50);
  text("Then Press On 'FEED DOG' Button To Feed The Dog",10,80);
}


if(gameState === "Sleeping"){
  background("pink");
  image(bedroomImg,500,250,1000,500);
  textSize(20);
  textFont("Aharoni");
  fill("black");
  text("See! You Dog Is Sleeping Now....",10,20);
  text("Shhhhhhhhhh!!",10,50);
  text("zzzzzzzzzzzzzzzzz",10,80);
}


if(gameState === "Playing"){
  background(rgb(133, 182, 250));
  image(gardenImg,500,250,1000,500);
  textSize(20);
  textFont("Aharoni");
  fill("black");
  text("See! You Dog Is Playing Now....",10,20);
  text("He Is Enjoing Digging,",10,50);
  text("And Trying To Find A Bone!!",10,80);
}


if(gameState === "Bathing"){
  background(rgb(133, 182, 250));
  image(washroomImg,500,250,1000,500);
  textSize(20);
  textFont("Aharoni");
  fill("black");
  text("See! You Dog Is Bathing Now....",10,20);
  text("He Is Tickling And Removing Insects,",10,50);
  text("From His Body!!",10,80);
}


function update(state){
  database.ref('/').update({
    gameState : state
  });
}


 drawSprites();
  
 textSize(20);
 textFont("Aharoni");
 fill("black");
 if(Lastfeed >= 12){
   text("Last Feed : " + Lastfeed%12 + " PM",750,25);
 }else if(Lastfeed === 0){
   text("Last Feed : 12 AM",750,25);
 }else{
   text("Last Feed : " + Lastfeed + " AM",750,25);
 }


 
 textSize(20);
 textFont("Aharoni");
 fill("black");
 text("See! The Dog Is Hungry....",10,20);
 text("Press On 'ADD FOOD' Button To Add Food,",10,50);
 text("Then Press On 'FEED DOG' Button To Feed The Dog",10,80);

 drawSprites();
  
 textSize(20);
 textFont("Aharoni");
 fill("black");
 if(Lastfeed >= 12){
   text("Last Feed : " + Lastfeed%12 + " PM",750,25);
 }else if(Lastfeed === 0){
   text("Last Feed : 12 AM",750,25);
 }else{
   text("Last Feed : " + Lastfeed + " AM",750,25);
 }

drawSprites();
}
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
}

function writePosition(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    'Food': nazo
  })

}
function AddFood(){
position++
database.ref('/').update({
  Food:position
}

)
}
function FeedDog(){
dog.y = 380
dog.addImage(dogimg2)
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour ()
 })
}