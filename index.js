const safeElements=[1,8,15,22]
let red={
    value:"red",
    stopPoint: 28,
    startPoint:1,
    tokkenAtHome: 2,
    TokkenWon: 0,
    TokkenOnBoard: 0,
}
let blue={
    value:"blue",
    stopPoint: 42,
    startPoint:15,
    tokkenAtHome: 2,
    TokkenWon: 0,
    TokkenOnBoard: 0
}
let green={
    value:"green",
    stopPoint: 35,
    startPoint:8,
    tokkenAtHome: 2,
    TokkenWon: 0,
    TokkenOnBoard: 0
}

let yellow={
    value:"yellow",
    stopPoint: 49,
    startPoint:22,
    tokkenAtHome: 2,
    TokkenWon: 0,
    TokkenOnBoard: 0
}
let player={
    playerTurn: "red",
    noOfPlayers: 2,
    move: 0,
    NoOfCards: 0,
    SelectedCardValue: {
        value: 0,
        card: "",
        is6: false,
    },
    generatedCard:{
        card: "",
        value: 0
    } 
}

function tokkenDiv(color) {
    return `<div class="token ${color} house" role="button"></div>`
}
function canTokkenMove(nextIdNumber,currentIdNumber,color) {
    if(color.value=="red"){
        if(currentIdNumber>nextIdNumber){
            nextIdNumber+=28
        }
        if (nextIdNumber>color.stopPoint) {
            return 0
        }
       if (nextIdNumber==color.stopPoint){
            return 1
       }
       return 2
    }else{
        if(currentIdNumber<((color.stopPoint%28))){
            nextIdNumber+=28
        }
        if (nextIdNumber>color.stopPoint) {
            return 0
        }
       if (nextIdNumber==color.stopPoint){
            return 1
       }
       return 2
    }
}
function is6() {
    const displayContainer = document.getElementById("diceCard")
    const childs = displayContainer.childNodes;
    for (const child of childs) {
        if(child.innerText==6){
            player.SelectedCardValue.is6=true;
            HouseHoverInit(true)
            break;
        }else{
            player.SelectedCardValue.is6=false;
            HouseHoverInit(false)
        }
    }
    

}

function moveForward(event) {
    const step = player.SelectedCardValue.value
    if (step) {
    const parentId = event.target.parentElement.id;
    const parent = document.getElementById(parentId)
    const self = event.target;
    const currentIdNumber = (parseInt(parentId.slice(3)))
    let nextIdNumber = (parseInt(parentId.slice(3))+parseInt(step))
    if (nextIdNumber%28!=0) {
        nextIdNumber=nextIdNumber%28
    }else{
        nextIdNumber=28
    }
    let array = [red,blue,green,yellow]
    array.forEach(element => {
        if (element.value==player.playerTurn) {
            
            if (canTokkenMove(nextIdNumber,currentIdNumber,element)==2) {
                const nextId = parentId.slice(0,3)+nextIdNumber
                const nextParent = document.getElementById(nextId)
                parent.removeChild(self);   
                nextParent.appendChild(self)
                let displayContainer= document.getElementById("diceCard");
                displayContainer.removeChild(player.SelectedCardValue.card);
                player.NoOfCards--
                is6()
                if(!(safeElements.includes(nextIdNumber))){
                    killopponent(nextParent,self,element)
                }
            }else if(canTokkenMove(nextIdNumber,currentIdNumber,element)==1){
                const nextId = parentId.slice(0,3)+nextIdNumber
                const nextParent = document.getElementById(nextId)
                if(!(safeElements.includes(nextIdNumber))){
                    killopponent(nextParent,self,element)
                }
                parent.removeChild(self); 
                let displayContainer= document.getElementById("diceCard");
                displayContainer.removeChild(player.SelectedCardValue.card);
                player.NoOfCards--
                element.TokkenOnBoard--
                element.TokkenWon++
                is6()
                if(element.TokkenWon==2){
                    alert(`${element.value} won \n \n GAME ENDED \n \n THANKU for PLAYING`)
                    nextPlayerTurn()
                }
                
               
            }else if(canTokkenMove(nextIdNumber,currentIdNumber,element)==0){
                is6()
            }
           
        }
    })
    
    const generateNumber = document.getElementById("regularDice")
    if(generateNumber.classList.contains("disabled")&&player.NoOfCards==0){
        nextPlayerTurn()       
    }
    }
}
function killopponent(nextParent,self,element) {
    const childs = nextParent.childNodes
    for (const child of childs) {
        if(!(child.isEqualNode(self))){
            child.remove();
            let house = document.getElementById(`${child.classList[1]}House`);
            child.removeEventListener("click",moveForward)
            child.addEventListener("click",moveToBoard)
            child.classList.add("house")
            house.appendChild(child)   
            let array = [red,blue,green,yellow]
            array.forEach(element => {
                if(element.value==child.classList[1]){
                    element.TokkenOnBoard--
                    element.tokkenAtHome++
                }
            })     

        }
    }
}
function moveToBoard(event) {
    const step = player.SelectedCardValue.value
    if (step==6) {
    const parentId = event.target.parentElement.id;
    const parent = document.getElementById(parentId);
    const self = event.target;
    let id;
    
    switch (self.classList[1]) {
        case "red":
            id=red.startPoint;
            red.tokkenAtHome--
            red.TokkenOnBoard++
            break;
        case "green":
            id=green.startPoint
            green.tokkenAtHome--
            green.TokkenOnBoard++
            break;
        case "blue":
            id=blue.startPoint
            blue.tokkenAtHome--
            blue.TokkenOnBoard++
            break;
        case "yellow":
            id=yellow.startPoint
            yellow.tokkenAtHome--
            yellow.TokkenOnBoard++
            break;
        default:
            break;
    }
    self.classList.remove("house")
    const toParent = document.getElementById(`box${id}`)
    self.addEventListener("click",moveForward)
    self.removeEventListener("click",moveToBoard)
    parent.removeChild(self);
    toParent.appendChild(self)
    let displayContainer= document.getElementById("diceCard");
    displayContainer.removeChild(player.SelectedCardValue.card);
    player.NoOfCards--
    const generateNumber = document.getElementById("regularDice")
    is6();
    
    if(generateNumber.classList.contains("disabled")&&player.NoOfCards==0){
        nextPlayerTurn()
        
    }
    
}}
function Hover(color) {
    if(player.playerTurn==color){
        const Tokken=document.getElementsByClassName(`${color}`);
        for (const element of Tokken) {
            if(!element.classList.contains("won") && !element.classList.contains("house")){
                if (element.classList.contains("token")) {
                    element.classList.add("hover")
                    element.addEventListener("click",moveForward)
                    
                }
                else{
                    if (element.classList.contains("hover")) {
                        element.classList.remove("hover")
                        element.removeEventListener("click",moveForward)
                    }
                }
            }else{
                if (element.classList.contains("hover")) {
                    element.classList.remove("hover")
                    element.removeEventListener("click",moveForward)
                }
            }
        }
    }else{
        const Tokken=document.getElementsByClassName(`${color}`);
        for (const element of Tokken) {
            element.classList.remove("hover")
            element.removeEventListener("click",moveForward)
        }
    }
}
function HoverHouseTokken(color,bool) {
    if(player.playerTurn==color){
        const Tokken=document.getElementsByClassName(`${color}`);
        for (const element of Tokken) {
            if (element.classList.contains("house")&&element.classList.contains("token")) {
                if(bool){
                    element.classList.add("hover")
                element.addEventListener("click",moveToBoard)
                }if(!bool){
                    element.classList.remove("hover")
                element.removeEventListener("click",moveToBoard)
                }
            }
        }
    }
}
function hoverinit() {
    let array = [red,blue,green,yellow]
array.forEach(element => {Hover(element.value)})
}
function HouseHoverInit(bool) {
    let array = [red,blue,green,yellow]
    array.forEach(element => {HoverHouseTokken(element.value,bool)})
    }


function nextPlayerTurn(){
    if (player.noOfPlayers==2) {
        if (player.playerTurn=="red") {
            player.playerTurn="blue"
        } else {
            player.playerTurn="red"
        }
        ResetForNExtPlayer()
        HighlightNextPlayer()
    } else {
        switch (player.playerTurn) {
            case "red":
                player.playerTurn="green"
                break;
            case "green":
                player.playerTurn="blue"
                break;
            case "blue":
                player.playerTurn="yellow"
                break;
            case "yellow":
                player.playerTurn="red"
                break;
            default:
                break;
        }
        ResetForNExtPlayer()
        HighlightNextPlayer()
    }
}
function HighlightNextPlayer(){
    let array = [red,blue,green,yellow]
    array.forEach(element => {
        if(player.playerTurn==element.value){
            let house = document.getElementById(`${element.value}House`);
            house.classList.add("turn")
        }else{
            let house = document.getElementById(`${element.value}House`);
            house.classList.remove("turn")
        }
    })
    
}

function generateNumber() {
    
    let randomNumber = Math.floor((Math.random() * 6) + 1);
    let displayContainer= document.getElementById("diceCard");
    displayContainer.innerHTML+=`<div class="card m-2" style="display: inline-block;" tabindex="-1" onfocus="selectCard(event)" onblur="deSelectCard()" >
    <div class="card-body" >
      <h5 class="card-title">${randomNumber}</h5>
    </div>
  </div>`
  spinner.innerHTML=""
  player.generatedCard.value=randomNumber;
  player.generatedCard.card= `<div class="card m-2" style="display: inline-block;" tabindex="-1" onfocus="selectCard(event)" onblur="deSelectCard()" >
  <div class="card-body" >
    <h5 class="card-title">${randomNumber}</h5>
  </div>
</div>`
player.NoOfCards++

  if(randomNumber!=6){
    removeDice()
  }
  if(randomNumber==6){
    player.SelectedCardValue.is6=true;
    HouseHoverInit(true)
    
  }
  is6()
  
  let array = [red,blue,green,yellow]
array.forEach(element => {
    if(player.playerTurn==element.value){
        if(randomNumber!=6&&element.TokkenOnBoard==0&&!player.SelectedCardValue.is6){
            player.NoOfCards--
            setTimeout(nextPlayerTurn,1000)
        }
    }
})
  
}
function cheatNumber() {
    
    let cheatcontainer=document.getElementById("cheatnumber")
    const number = cheatcontainer.value;
    if(number){
        cheatcontainer.value="";
    let displayContainer= document.getElementById("diceCard");
    displayContainer.innerHTML+=`<div class="card m-2" style="display: inline-block;" tabindex="-1" onfocus="selectCard(event)" onblur="deSelectCard()"  >
    <div class="card-body">
      <h5 class="card-title">${number}</h5>
    </div>
  </div>`
  player.generatedCard.value=number;
  player.generatedCard.card= `<div class="card m-2" style="display: inline-block;" tabindex="-1" onfocus="selectCard(event)" onblur="deSelectCard()" >
  <div class="card-body" >
    <h5 class="card-title">${number}</h5>
  </div>
</div>`
player.NoOfCards++

  if(number!=6){
    removeDice()
  }
  if(number==6){
    player.SelectedCardValue.is6=true;
    HouseHoverInit(true)
  }
    }
  
  is6()
    let array = [red,blue,green,yellow]
array.forEach(element => {
    if(player.playerTurn==element.value){
        if(number!=6&&element.TokkenOnBoard==0&&!player.SelectedCardValue.is6){
            player.NoOfCards--
            setTimeout(nextPlayerTurn,1000)
        }
    }
})
}
function removeDice() {
    const generateNumber = document.getElementById("regularDice")
    generateNumber.classList.add("disabled")
    const cheatDice = document.getElementById("cheatDice")
    cheatDice.classList.add("disabled")
    cheatDice.classList.add("collapsed")
    cheatDice.setAttribute("aria-expanded","false")
    const collapse = document.getElementById("collapseExample")
    collapse.classList.remove("show")
}
function initDice(){
    const generateNumber = document.getElementById("regularDice")
    generateNumber.classList.remove("disabled")
    const cheatDice = document.getElementById("cheatDice")
    cheatDice.classList.remove("disabled")
}
function spinDice() {
    let spinner =document.getElementById('spinner');
    spinner.innerHTML=`<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
</div>  `
setTimeout(() => {
    generateNumber()
}, 1000);
}

function clearDiceCard() {
    let displayContainer= document.getElementById("diceCard");
    const childs=displayContainer.childNodes;
    for (let index = 3; index < childs.length; index++) {
        const element = childs[index];
        element.remove()
        
    }
}
function selectCard(event) {
    const card = event.target
    player.SelectedCardValue.card=card
    const value = card.innerText
    player.SelectedCardValue.value = value;
}
function deSelectCard(){
    setTimeout(() => {
        player.SelectedCardValue.card="";
        player.SelectedCardValue.value="";
    }, 500);
}
function ResetForNExtPlayer() {
    hoverinit()
    player.SelectedCardValue.value=0
    player.SelectedCardValue.card=""
    player.SelectedCardValue.is6=false
    initDice()
    clearDiceCard()
}
function StartGame() {
    player.playerTurn= "red"
    player.generatedCard={
        card: "",
        value: 0
    } 
    player.SelectedCardValue={
        value: 0,
        card: "",
        is6: false,
    }
    player.NoOfCards=0
    if (player.noOfPlayers==2) {
        var array = [red,blue]
    }else{
        var array = [red,blue,green,yellow]
    }
    array.forEach(element => {
        let house = document.getElementById(`${element.value}House`);
        house.innerHTML=` 
        <h1 class="${element.value}">${element.value.toUpperCase()} HOUSE</h1>${tokkenDiv(element.value)}${tokkenDiv(element.value)}`;
        element.tokkenAtHome= 2;
        element.TokkenWon=0;
        element.TokkenOnBoard= 0;
        hoverinit()
        HighlightNextPlayer()
    });
    let smallbox =document.getElementsByClassName("smallbox")
    for (const child of smallbox) {
        child.innerHTML=""
    }
}
//form
function Submit(event){
    event.preventDefault()
    const noOfPlayers =document.getElementById("inputGroupSelect01")
    player.noOfPlayers=noOfPlayers.value
    StartGame()
    
}
function Submit1(event){
    event.preventDefault()
    const noOfPlayers =document.getElementById("inputGroupSelect02")
    player.noOfPlayers=noOfPlayers.value
    StartGame()
    let startmenu = document.getElementById("startmenu")
    startmenu.style.display="none"
}



