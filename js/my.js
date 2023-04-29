const canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d")

backGraound = new Image () // ----------------------------- ստեղծում ենք backgraound-ի նկարը
backGraound.src = "img/flappy_bird_bg.png"

floorBackGround = new Image () // ------------------------- ստեղծում ենք հատակի նկարը
floorBackGround.src = "img/flappy_bird_fg.png"

pipeBottom = new Image () // ------------------------------ ստեղծում ենք ներքևի խողովակի նկարը
pipeBottom.src = "img/flappy_bird_pipeBottom.png"

pipeUp = new Image () // ---------------------------------- ստեղծում ենք վերևի խողովակի նկարը
pipeUp.src = "img/flappy_bird_pipeUp.png"

birdImg = new Image () 
birdImg.src = "img/flappy_bird_bird.png"

spaceBetweenPipe = ( canvas.width - 10 - 150 ) / 2 // ----- նախապես ստանում և փոփոխականի մեջ պահում ենք, և՛ վերևի, և՛ ներքևի խողովակների միջև եղած ստանդարտ հեռավորությունը

let yBottomPipes
let yUpPipes
let bottomY

let flyBird

let fixBirdPosition

let playOrPauseGame 

let keyShiftdown = false

let checkPlayOrPauseGame = false

let isLost = false



let textGameOver = false

let rotate = false

let sign = 1

const date = { // ----------- canvas-ի վրա նկարվող մարմինների տվյալները պահելու համար
    
    floorMoving: [ // ------- հատակի նախնական տվյալները
        {
            xDelta: 10,
            x: 0,
            y: 570,
            width: canvas.width,
            height: 130
        },
    
        {
            xDelta: 10,
            x: canvas.width,
            y: 570,
            width: canvas.width,
            height: 130
        }
    ],

    bottomPipes: [], // ----------------- զանգված ներքևի խողովակների տվյալները պահպանելու համար, որը սկզբից դատարկ է

    upPipes: [], // ----------------- զանգված վերևի խողովակների տվյալները պահպանելու համար, որը սկզբից դատարկ է

    bird: {
            x: 65,
            y: canvas.height / 2 - 100,
            yDelta: 10,
            yRotate: 0 
        }


}

document.addEventListener("keydown", function (event) { // -------- event ստեղնաշարի կոճակները սեղմելու համար
    
    if(event.code === "Space") {
        console.log(event.code)
        flyBird = "flyToUp"
        isLost = true

        textGameOver = false

        // START commit -> to raise and lower the bird's head

        rotate = false
        
        if(date.bird.yRotate >= 45){ // -------------- պայման, որն ապահովում է Space կոճակը սեղմելիս թռչունի գլուխը վերև բարձրացնելու համար 
            date.bird.yRotate = 45
        }else {
            date.bird.yRotate += 30
        }
            sign = -1

        // END commit -> to raise and lower the bird's head
    }

    if(event.code === "ShiftRight") { // ------------------------- թռչունի դիրքը ֆիքսելու համար

        if(keyShiftdown) {
            fixBirdPosition = "noFix"
            keyShiftdown = false
        }else {
            fixBirdPosition = "fix"
            keyShiftdown = true
        }
        
    }

    if(event.code === "Enter") { // խաղի պաուզայի համար
        if(checkPlayOrPauseGame) {
            playOrPauseGame = "playGame"
            checkPlayOrPauseGame = false
        }else {
            playOrPauseGame = "pauseGame"
            checkPlayOrPauseGame = true
        }
    }

})

document.addEventListener("keyup", function (event) {
    if(event.code === "Space") {
        flyBird = "flyToDown"

        // START commit -> to raise and lower the bird's head

        rotate = true

       // END commit -> to raise and lower the bird's head
    }
})
    

function setXOfBottomPipes () { // ---------------------- function, որը կարգավորում է ներքևի շարժվող խողովակների նախնական x կոորդինատները
    
    for(let i = 0; i < 6; i++) {
        
        yBottomPipes = Math.floor(200 + Math.random() * 350)

        if(i === 0) {
            date.bottomPipes[i] = {
                x: 5,
                y: yBottomPipes, // y-ները պետքա Math.random-ով սահմանել
                xDelta: 10, 
                isLost: false
            }
        }else {
            date.bottomPipes[i] = {
                x: date.bottomPipes[i - 1].x + 50 + spaceBetweenPipe,
                y: yBottomPipes, // y-ները պետքա Math.random-ով սահմանել
                xDelta: 10 
            }
        }
       }
}

function setXOfUppipes () { // ---------------------- function, որը կարգավորում է վերևի շարժվող խողովակների նախնական x կոորդինատները
    
    for(let i = 0; i < 6; i++) {

        yUpPipes = Math.floor(Math.random() * -100)
        bottomY = 241 + yUpPipes 
        // console.log("yUpPipes", yUpPipes)
        // console.log("bottomY", bottomY)

        if(i === 0) {
            date.upPipes[i] = {
                x: 5,
                y: yUpPipes,
                bottomYOfPipe: bottomY,
                xDelta: 10
            }
        }else {
            date.upPipes[i] = {
                x: date.upPipes[i - 1].x + 50 + spaceBetweenPipe,
                y: yUpPipes,
                bottomYOfPipe: bottomY,
                xDelta: 10
            }
           
        }
      }
}

setXOfBottomPipes ()

setXOfUppipes ()


function update () { // ----------------------- function, որն անընդհատ թարմացնում է տվյալները


    if(date.bottomPipes[3].x === 5) { // -------------- երբ ներքևի առաջին երեք խողովակները շարժման ընթացքում դուրս են գալիս տեսադաշտց, փոխվում են նրանց x կոորդինատները
           for(let i = 0; i < 3; i++) {
            if(i === 0) {
                yBottomPipes = Math.floor(200 + Math.random() * 350)
                date.bottomPipes[i].y = yBottomPipes
                date.bottomPipes[i].x = canvas.width - 5 + spaceBetweenPipe
            }else {
                yBottomPipes = Math.floor(200 + Math.random() * 350)
                date.bottomPipes[i].y = yBottomPipes
                date.bottomPipes[i].x = date.bottomPipes[i - 1].x + 50 + spaceBetweenPipe
            }
            
           }
    }

    if(date.bottomPipes[5].x === -spaceBetweenPipe + 5) { // ----------- երբ ներքևի 4-րդ, 5-րդ և 6-րդ խողովակները շարժման ընթացքում դուրս են գալիս տեսադաշտց, փոխվում են նրանց x կոորդինատները
        for(let i = 3; i < 6; i++) {
         if(i === 0) {
             yBottomPipes = Math.floor(200 + Math.random() * 350)
             date.bottomPipes[i].y = yBottomPipes
             date.bottomPipes[i].x = canvas.width - 5 + spaceBetweenPipe
         }else {
             yBottomPipes = Math.floor(200 + Math.random() * 350)
             date.bottomPipes[i].y = yBottomPipes
             date.bottomPipes[i].x = date.bottomPipes[i - 1].x + 50 + spaceBetweenPipe
         }
         
        }
    }

    if(date.upPipes[3].x === 5) { // -------------- երբ վերևի առաջին երեք խողովակները շարժման ընթացքում դուրս են գալիս տեսադաշտց, փոխվում են նրանց x կոորդինատները
        for(let i = 0; i < 3; i++) {
            if(i === 0) {
                yUpPipes = Math.floor(Math.random() * -100)
                bottomY =  241 + yUpPipes 
                // console.log("yUpPipes", yUpPipes)
                // console.log("bottomY", bottomY)
                date.upPipes[i].y = yUpPipes
                date.upPipes[i].bottomYOfPipe = bottomY
                date.upPipes[i].x = canvas.width - 5 + spaceBetweenPipe
            }else {
                yUpPipes = Math.floor(Math.random() * -100)
                bottomY = 241 + yUpPipes 
                // console.log("yUpPipes", yUpPipes)
                // console.log("bottomY", bottomY)
                date.upPipes[i].y = yUpPipes
                date.upPipes[i].bottomYOfPipe = bottomY
                date.upPipes[i].x = date.upPipes[i - 1].x + 50 + spaceBetweenPipe
            }
        }
    }

    if(date.upPipes[5].x === -spaceBetweenPipe + 5) { // -------------- երբ վերևի 4-րդ, 5-րդ և 6-րդ խողովակները շարժման ընթացքում դուրս են գալիս տեսադաշտց, փոխվում են նրանց x կոորդինատները
        for(let i = 3; i < 6; i++) {
            if(i === 0) {
                yUpPipes = Math.floor(Math.random() * -100)
                bottomY = 241 + yUpPipes 
                // console.log("yUpPipes", yUpPipes)
                // console.log("bottomY", bottomY)
                date.upPipes[i].y = yUpPipes
                date.upPipes[i].bottomYOfPipe = bottomY
                date.upPipes[i].x = canvas.width - 5 + spaceBetweenPipe
            }else {
                yUpPipes = Math.floor(Math.random() * -100)
                bottomY = 241 + yUpPipes 
                // console.log("yUpPipes", yUpPipes)
                // console.log("bottomY", bottomY)
                date.upPipes[i].y = yUpPipes
                date.upPipes[i].bottomYOfPipe = bottomY
                date.upPipes[i].x = date.upPipes[i - 1].x + 50 + spaceBetweenPipe
            }
        }
    }

    if(isLost) { // --------------------------------- ամեն GAME OVER-ից հետո խաղը "Space" կոճակով նորից սկսելու համար
        
        date.bird.yDelta = 10
        
        date.bottomPipes.forEach((bottomPipe) => {
             bottomPipe.xDelta = 10
        })

        date.upPipes.forEach((upPipe) => {
            upPipe.xDelta = 10
        })

        date.floorMoving.forEach((floor) => {
            floor.xDelta = 10
        })

    }

    if(fixBirdPosition === "fix") { // ------ թռիչքի ընթացքում թռչունի դիրքը օդի մեջ ֆիքսելու համար 
        date.bird.yDelta = 0

        // START commit -> to raise and lower the bird's head

        date.bird.yRotate = 0 // --------- RightShift սեղմելուց, երբ թռչունիյ դիրքը ֆիքսվում է օդում, այս կոդը ապահովում է դռչունի հորիզոնական դիրքը
        
        rotate = false // սա ապահովում է, որ RightShift սեղմելուց հետո թռչունը գլուխը չկախի

        // END commit -> to raise and lower the bird's head
    
    }else if (fixBirdPosition === "noFix") {
        date.bird.yDelta = 10
        fixBirdPosition = null
    }

    if(playOrPauseGame === "pauseGame") {  // ----------------------- խաղը պաուզա տալու համար
        date.bottomPipes.forEach((bottomPapie) => {
            bottomPapie.xDelta = 0
        })

        date.upPipes.forEach((upPipe) => {
            upPipe.xDelta = 0
        })

        date.floorMoving.forEach((floor) => {
            floor.xDelta = 0
        })

        // START commit -> to raise and lower the bird's head

        date.bird.yDelta = 0

        rotate = false

         // END commit -> to raise and lower the bird's head
    
    }else if (playOrPauseGame === "playGame") {

        date.bottomPipes.forEach((bottomPapie) => {
            bottomPapie.xDelta = 10
        })

        date.upPipes.forEach((upPipe) => {
            upPipe.xDelta = 10
        })

        date.floorMoving.forEach((floor) => {
            floor.xDelta = 10
        })

        playOrPauseGame = null

        if(date.bird.yDelta === 0 && fixBirdPosition !== "fix") {
            date.bird.yDelta = 10
        }else if(date.bird.yDelta === 10 && fixBirdPosition !== "noFix") {
                date.bird.yDelta = 0
        }

    }

         if(flyBird === "flyToUp") { // -------- պայման, որը ստուգում է, եթե սեղմել ենք կոճակը, ապա նվազում է թռչյունի y կոորդինատը yDelta-ի չափով, որպեսզի թռչյունը թռչի վերև 
             date.bird.y -= date.bird.yDelta
         }
     
         if(flyBird === "flyToDown") { // ------ պայման, որը ստուգում է, եթե բաց ենք թողել կոճակը, ապա ավելանում է թռչյունի y կոորդինատը yDelta-ի չափով, որպեսզի թռչյունը թռչի ներքև
             date.bird.y += date.bird.yDelta
         }
         
         date.bottomPipes.forEach((bottomPipe) => { // ----- ներքևի խողովակների շարժումն ապահովելու համար փոփոխում ենք նրանց x կորդինատները xDelta-ի չափով
             bottomPipe.x -= bottomPipe.xDelta
         })
     
         date.upPipes.forEach((upPipe) => { // ------------- վերևի խողովակների շարժումն ապահովելու համար փոփոխում ենք նրանց x կորդինատները xDelta-ի չափով
             upPipe.x -= upPipe.xDelta
         })

    if(date.bird.yRotate <= -90) { // --------------- պայման, որը ապահովում է Space կոճակը բաց թողնելուց հետո թռչունի գլխիվայր իջնելը մինչև 90 աստիճան
        date.bird.yRotate = -90
    }else {
        if(rotate) {
            date.bird.yRotate -= 10
        }
    }

    
    if(date.floorMoving[0].x === -canvas.width) { //---------- երբ 1-ին շարժվող հատակի նկարը դուրս է գլիս տեսադաշտից, փոխում ենք նրա x կոորդինատը   
        date.floorMoving[0].x = canvas.width
    }

    if(date.floorMoving[1].x === -canvas.width) { // --------- երբ 2-րդ շարժվող հատակի նկարը դուրս է գլիս տեսադաշտից, փոխում ենք նրա x կոորդինատը   
        date.floorMoving[1].x = canvas.width
    }
      
    date.floorMoving.forEach((floorImge, index) => { // ------------ հատակի շարժումն ապահովելու համար փոփոխվում է նրա x կորդինատը xDelta-ի չափով
        floorImge.x -= floorImge.xDelta
      })

    date.bottomPipes.forEach((bottomPipe, index) => { // ----------------- ներքևի ու վերևի խողովակները իրար չդիպչելու համար, կամ ներքևի ու վերևի խողովակների միջև չափազանց նեղ արանքից խուսափելու համար 
        if(bottomPipe.y <= canvas.height / 2 - 100 && date.upPipes[index].y === 0){
            date.upPipes[index].y = date.upPipes[index].y - 15
        }
        
        if(bottomPipe.y <= canvas.height / 2 - 100 ) {
            bottomPipe.y = bottomPipe.y + 80
        }
    })

    if(date.bird.y >= canvas.height - date.floorMoving[0].height - 10) { // --------------- երբ թռչյունը դիպչում է հատակին, խաղը սկսում է նորից 
        //  console.log(flyBird)
         date.bird = {
            x: 65,
            y: canvas.height / 2 - 100,
            yDelta: 0,
         }

         date.bottomPipes.forEach((bottomPipe) => {  
            bottomPipe.xDelta = 0
         })

         date.upPipes.forEach((upPipe) => {  
            upPipe.xDelta = 0
         })

         date.floorMoving.forEach((floor) => {
            floor.xDelta = 0
         })

         isLost = false

         textGameOver = true

         // START commit -> to raise and lower the bird's head

         date.bird.yRotate = 0

         rotate = false

         // END commit -> to raise and lower the bird's head

         setXOfBottomPipes ()
         setXOfUppipes ()
    }

    date.bottomPipes.forEach((bottomPipe) => { // -------------- երբ թռչունը դիպչում է ներքրի խողովակներին, խաղը սկսում է նորից

          if( (date.bird.x >= bottomPipe.x && date.bird.x <= bottomPipe.x + 50 ) && bottomPipe.y <= date.bird.y) {

            console.log("eee")
            date.bird = {
                x: 65,
                y: canvas.height / 2 - 100,
                yDelta: 0,
             }

             setXOfBottomPipes ()

             date.bottomPipes.forEach((bottomPipe) => {  
                bottomPipe.xDelta = 0
             })

             date.upPipes.forEach((upPipe) => {  
                upPipe.xDelta = 0
             })

             date.floorMoving.forEach((floor) => {
                floor.xDelta = 0
             })

             isLost = false
             textGameOver = true

             // START commit -> to raise and lower the bird's head

             date.bird.yRotate = 0

             rotate = false

             // END commit -> to raise and lower the bird's head

          }


    })

    date.upPipes.forEach((upPipe) => { // -------------- երբ թռչունը դիպչում է վերևի խողովակներին, խաղը սկսում է նորից
        
        if( (date.bird.x >= upPipe.x && date.bird.x <= upPipe.x + 50 ) && upPipe.bottomYOfPipe >= date.bird.y) {

          console.log("eee")
          date.bird = {
              x: 65,
              y: canvas.height / 2 - 100,
              yDelta: 0,
           }

           setXOfUppipes ()

           date.bottomPipes.forEach((bottomPipe) => {  
            bottomPipe.xDelta = 0
           })

           date.upPipes.forEach((upPipe) => {  
              upPipe.xDelta = 0
           })

           date.floorMoving.forEach((floor) => {
               floor.xDelta = 0
           })

           isLost = false
           textGameOver = true

           // START commit -> to raise and lower the bird's head

           date.bird.yRotate = 0

           rotate = false

           // END commit -> to raise and lower the bird's head
        }
  })
}

function draw () { // ---------------------------------- function, որը canvas-ի վրա անընդհատ նկարում է բոլոր նկարները, ըստ փոփոխվող տվյալների
    
    ctx.drawImage(backGraound, 0, 0, canvas.width, canvas.height) // ----- canvas-ի backgraound-ը նկարելու համար

    // START commit -> to raise and lower the bird's head

    ctx.save()
    // ctx.beginPath()
    ctx.translate(date.bird.x, date.bird.y) // --------------------- սա սահմանում է այն կոորդինատները, որի շուրջ տեղի է ունենում թռչունի վերև ներքև պտույտը
    
    ctx.rotate((date.bird.yRotate * sign) * (Math.PI / 180)) // ------------------- սա ապահովում է թռչունի պտույտը կախված yRotate փոփոխականի արժեքից, որը Space կոխակը սեղմելիս ավելանում է մինչև, իսկ բաց թողնելիս, պակասում
    
    ctx.drawImage(birdImg, 0, 0) // ------------------ թռչյունին նկարելու համար
    // ctx.closePath()

    ctx.restore()

    // END commit -> to raise and lower the bird's head

    date.bottomPipes.forEach((bottomPipe, index) => { // ----------------- ներքևի խողովակները նկարելու համար
        ctx.drawImage(pipeBottom, bottomPipe.x, bottomPipe.y )
    })
    
    date.upPipes.forEach((upPipe, index) => { // -------------------------  վերևի խողովակները նկարելու համար
        ctx.drawImage(pipeUp, upPipe.x, upPipe.y)
    })
    
    for(let i = 0; i < date.floorMoving.length; i++) { // ---------------- հատակը նկարելու համար
        ctx.drawImage(floorBackGround, date.floorMoving[i].x, date.floorMoving[i].y, date.floorMoving[i].width, date.floorMoving[i].height)
    }

    if(textGameOver) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "yellow";
        ctx.fillStyle = "red"
        ctx.font = "50px serif"
        ctx.fillText("GAME OVER", 50, canvas.height / 2 - 50)
    }

    update ()
}

setInterval(draw, 100)

// վերևի խողովակի y կոորդինատը 0-ից մինչև -150
// ներքևի խողովակի y կոորդինատը 400-ից մինչև  (canvas.height - date.floorMoving[0].height) / 2, որը կազմում է -> (235)

// խողովակների լայնությունը 50

// 323 