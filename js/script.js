let map = []

map[0] = "Vanha linnan torni"
map[1] = "Kaivo"
map[2] = "Aurinkoinen metsäaukio"
map[3] = "Vihainen lohikäärme"
map[4] = "Kapea polku"
map[5] = "Vanha portti"
map[6] = "Joen ranta"
map[7] = "Vanha puupenkki"
map[8] = "Kaukainen mökki"

let images = []
images[0] = "torni.jpg"
images[1] = "kaivo.jpg"
images[2] = "aukio.jpg"
images[3] = "dragon.jpg"
images[4] = "polku.jpg"
images[5] = "portti.jpg"
images[6] = "joki.jpg"
images[7] = "penkki.jpg"
images[8] = "mokki.jpg"

let blockMessage = []

blockMessage[0] = "Haluamasi reitti on liian vaarallinen"
blockMessage[1] = "Salaperäinen voima estää liikkumisesi tuohon suuntaan"
blockMessage[2] = "Vaikeakulkuinen pusikko estää liikkumisesi"
blockMessage[3] = "Et pääse sieltä karkuun lohikäärmettä"
blockMessage[4] = ""
blockMessage[5] = "Portti sulkeutui"
blockMessage[6] = "Joki on liian syvä ylitettäväksi"
blockMessage[7] = "Metsä on liian tiheä läpäistäväksi"
blockMessage[8] = "Olet liian peloissasi mennäksesi siihen suuntaan"

mapLocation = 4

// Player input
let playersInput = ""

// Game message
let gameMessage = ""

// Actions for player
let actionsForPlayer = ["pohjoinen", "itä", "etelä", "länsi", "poimi", "käytä", "jätä"]
let action = ""

// Variables for player actions
let taikajuoma = false
let kiviKaivoon = false
let taikahuilu = false
let portti = false

// Objects for player to use
let items = ["huilu", "kivi", "miekka", "pullo"]
let itemLocations = [1, 6, 8, 7]
let backPack = []
const knownItems = ["huilu", "kivi", "miekka", "pullo"]
let item = ""

const input = document.querySelector("#input")
const button = document.querySelector("button")
const output = document.querySelector("#output")
const image = document.querySelector("#image")

button.style.cursor = "pointer"
button.addEventListener("click", clickHandler, false)

document.addEventListener("keypress", (event) => {
    if(event.key === "Enter") {
        button.click()
    }
})

render()

function clickHandler() {
    playGame()
}

function playGame() {
    playersInput = input.value.toLowerCase()

    action = ""
    gameMessage = ""

    for (let i = 0; i < actionsForPlayer.length; i++) {
        if (playersInput.indexOf(actionsForPlayer[i]) !== -1) {
            action = actionsForPlayer[i]
            console.log(action)
            break
        }
    }

    for(let i = 0; i < knownItems.length; i++) {
        if(playersInput.indexOf(knownItems[i]) !== -1) {
            item = knownItems[i]
            break
        }
    }

    switch (action) {
        case "pohjoinen":
            if(mapLocation >= 3) {
                mapLocation -= 3
                taikahuilu = false
            } else {
                gameMessage = blockMessage[mapLocation]
            }
            break

        case "itä":
            if(mapLocation % 3 != 2) {
                mapLocation += 1
                taikahuilu = false
            } else if(portti === true) {
                gameMessage = "<span class='action'>Portti on auki ja pääset seuraavaan seikkailuun.</span>"
            } 
            else {
                gameMessage = blockMessage[mapLocation]
            }
            break

        case "etelä":
            if(mapLocation <= 5) {
                mapLocation += 3
                taikahuilu = false
            } else {
                gameMessage = blockMessage[mapLocation]
            }
            break

        case "länsi":
            if(mapLocation % 3 != 0) {
                mapLocation -= 1
                taikahuilu = false
            } else {
                gameMessage = blockMessage[mapLocation]
            }
            break
        case "poimi":
            takeItem()
            break

        case "käytä":
            useItem()
            break

        case "jätä":
            leaveItem()
            break

        default:
            gameMessage = "<span class='error'>Tuntematon toiminto.</span>"
    }

    render()
}

function render() {
    image.src = "images/" + images[mapLocation]
    output.innerHTML = "Sijaintisi:<br>" + map[mapLocation]
    output.innerHTML += "<br>" + gameMessage
    if(backPack.length > 0) {
        output.innerHTML += "<br>Mukanasi on: " + backPack.join(", ")
    }
    for(let i = 0; i < items.length; i++) {
        if(mapLocation === itemLocations[i]) {
            output.innerHTML += "<br>Näet esineen: " + items[i]
        }
    }
}

function takeItem() {
    let itemIndexNumber = items.indexOf(item)
    
    if(itemIndexNumber !== -1 && itemLocations[itemIndexNumber] === mapLocation) {
        if(mapLocation === 1 && kiviKaivoon === false) {
            gameMessage = "<span class='error'>Et voi poimia huilua. Se on kiinnitetty jonkinlaisella mekanismilla.</span>"
        } else if(mapLocation === 8 && taikahuilu === false) {
            gameMessage = "<span class='error'>Mökistä juoksee vihainen mies, joka heiluttelee kirvestä. Et uskalla ottaa miekkaa. Mies häviää takaisin mökkiin.</span>"
        } 
        else {
        backPack.push(item)
        items.splice(itemIndexNumber, 1)
        itemLocations.splice(itemIndexNumber, 1)
        gameMessage = "<span class='action'>Poimit esineen: </span>" + item
        console.log("Repussa on " + backPack)
        }
    } else {
        gameMessage = "<span class='error'>Et voi poimia mitään</span>"
    }
}

function useItem() {
    let backPackIndexNumber = backPack.indexOf(item)
    if(backPackIndexNumber === -1) {
        gameMessage = "<span class='error'>Sinulla ei ole tätä esinettä</span>"
    }
    if (backPack.length === 0) {
        gameMessage = "<span class='error'>Repussa ei ole yhtään esinettä</span>"
    }

    if(backPackIndexNumber !== -1) {
        switch(item) {
            case "huilu":
                gameMessage = "<span class='action'>Lumoavan kaunis musiikki soi ympärilläsi.</span>"
                taikahuilu = true
                break
            case "miekka":
                if(mapLocation === 3 && taikajuoma === true) {
                    gameMessage = "<span class='action'>Hiivit lohikäärmeen alle ja survot miekan lohikäärmeen vatsaan. Lohikäärme kuolee. Lohikäärmeen takaa löytyy vipu ja vedät vivusta. Kuuluu mekanismin aukeamisen ääntä.</span>"
                    portti = true
                } else if(mapLocation === 3){
                    gameMessage = "<span class='error'>Et uskalla kohdalta lohikäärmettä.</span>"
                } else {
                    gameMessage = "<span class='error'>Heiluttelet miekkaa ympäriinsä.</span>"
                }
                break
            case "kivi":
                 if(mapLocation === 1) {
                    gameMessage = "<span class='action'>Pudotat kiven kaivoon ja kuulet kolahduksen sekä saranan aukeamisen äänen.</span>"
                    backPack.splice(backPackIndexNumber, 1)
                    kiviKaivoon = true
                } else {
                    gameMessage = "<span class='action'>Pyörittelet kiveä kädessäsi.</span>"
                }
                break
            case "pullo":
                gameMessage = "<span class='action'>Juot pullossa olevan nesteen. Tunnet itsesi voittamattomaksi ja rohkeaksi. Pullo on tyhjä ja lasket sen maahan.</span>"
                backPack.splice(backPackIndexNumber, 1)
                taikajuoma = true
        }
    }

}

function leaveItem() {
    if(backPack.length !== 0) {
        let backPackIndexNumber = backPack.indexOf(item)
        if(backPackIndexNumber !== -1) {
            items.push(backPack[backPackIndexNumber])
            itemLocations.push(mapLocation)
            backPack.splice(backPackIndexNumber, 1)
        } else {
            gameMessage = "<span class='error'>Et voi tehdä tätä toimintoa</span>"
        }
    } else {
        gameMessage = "<span class='error'>Reppu on tyhjä, et voi jättää mitään</span>"
    }

}