export default function createGame(screenObject) {
    const state = {
        players: {},
        fruits: {},
        screen: screenObject
    }

    const observers = []

    function start() {
        const frequency = 2000

        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY,
        }

        notifyAll({
            type: 'add-player',
            playerId,
            playerX,
            playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId,
        })
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX =  command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY =  command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                console.log('game.movePlayer().ArrowUp() -> moving player up')
                if (player.y - 1 >= 0) {
                    player.y -= 1
                    return
                }
            },
            ArrowRight(player) {
                console.log('game.movePlayer().ArrowRight() -> moving player right')
                if (player.x + 1 < state.screen.width) {
                    player.x += 1
                    return
                }
            },
            ArrowDown(player) {
                console.log('game.movePlayer().ArrowDown() -> moving player down')
                if (player.y + 1 < state.screen.height) {
                    player.y += 1
                    return
                }
            },
            ArrowLeft(player) {
                console.log('game.movePlayer().ArrowLeft() -> moving player left')
                if (player.x - 1 >= 0) {
                    player.x -= 1
                    return
                }
            },
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkForFruitCollision(playerId)
        }

        function checkForFruitCollision(playerId) {
            const player = state.players[playerId]
            for (const fruitId in state.fruits) {
                const fruit = state.fruits[fruitId]
                console.log(`checking ${playerId} and ${fruitId}`)
                if (player.x === fruit.x && player.y == fruit.y) {
                    console.log(`COLLIISION between ${playerId} and ${fruitId}`)
                    removeFruit({ fruitId })
                }
            }
        }
    }

    return {
        movePlayer,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        subscribe,
        setState,
        start,
        state
    } 
}
