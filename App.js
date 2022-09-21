import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, Button, DatePickerIOSBase } from 'react-native';
import uuid from 'react-uuid'
import CountDownTimer from 'react-native-countdown-timer-hooks'

export default function App() {
  const NBR_OF_DICES = 2
  const [diceImages, setDiceImages] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [status, setStatus] = useState("Game is on...")
  const [nbrOfHits, setNrbOfHits] = useState(0)
  const [nbrOfFast, setNrbOfFast] = useState(0)
  const [timerEnd, setTimerEnd] = useState(false)
  const refTimer = useRef()

  function initialize() {
    let imgs= []
    for (let i=0; i < NBR_OF_DICES; i++) {
      imgs[i] = require("./assets/dice-images/smiley.png")
    }
      setDiceImages(imgs)
      setNrbOfHits(0)
      setNrbOfFast(0)
      setStatus("Game is on...")
      refTimer.current.resetTimer()
  }

  function setImages(throws) {
    let imgs = []
    for (let i=0; i < throws.length; i++) {
      switch(throws[i]) {
        case 1: imgs[i] = (require("./assets/dice-images/1.png")); break;
        case 2: imgs[i] = (require("./assets/dice-images/2.png")); break;
        case 3: imgs[i] = (require("./assets/dice-images/3.png")); break;
        case 4: imgs[i] = (require("./assets/dice-images/4.png")); break;
        case 5: imgs[i] = (require("./assets/dice-images/5.png")); break;
        case 6: imgs[i] = (require("./assets/dice-images/6.png")); break;
        default: break;
      }
    }
      setDiceImages(imgs)
  }

  function throwDices() {
    let throws = []
    let sum = 0
    setStartTime(new Date())
    setGameStarted(true)
    for (let i=0; i < NBR_OF_DICES; i++) {
      throws[i] = Math.floor(Math.random() * 6 + 1)
    }
    setImages(throws)
  }

  function checkDices() {
    if (gameStarted) {
      if (diceImages[0] === diceImages[1]) {
        setNrbOfHits(nbrOfHits+1)
        const reactionTime = new Date() - startTime
        setStatus("Last reaction time: " + (new Date() - startTime) + "ms.")
        if (reactionTime < 1000) {
          setNrbOfFast(nbrOfFast + 1)
        }
      }
      else {
        initialize()
      }
    }
  }

  const timerCallback = (timerFlag) => {
    setTimerEnd(timerFlag)
    initialize()
  }

  useEffect(() => {
    initialize()
  }, [])


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reaction game</Text>
      <Button 
        style={styles.button}
        onPress={throwDices} 
        title='Throw dices' >
      </Button>
      <View style={styles.flex}>
        {diceImages.map(dice => (
          <Image style={styles.dice} source={dice} key={uuid()} />
        ))}
      </View>
      <Button 
        style={styles.button}
        onPress={checkDices} 
        title='Same dices' >
      </Button>
      <View style={{ display: timerEnd ? 'none' : 'flex' }}>
        <CountDownTimer
          ref={refTimer}
          timestamp={60}
          timerCallback={timerCallback}
          containerStyle={{
            height: 40,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 35,
            backgroundColor: '#2196f3',
            marginTop:15
          }}
          textStyle={{
            fontSize: 25,
            color: '#FFFFFF',
            fontWeight: '300',
            letterSpacing: 0.25,
          }}
        />
      </View>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.hits}>Hits: {nbrOfHits}</Text>
      <Text style={styles.fast}>Fast reactions: {nbrOfFast}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    marginTop: 100,
    marginBottom: 30
  },
  button: {
    marginTop: 30,
    marginBottom: 30
  },
  flex: {
    flexDirection: 'row'
  },
  dice: {
    width: 80,
    height: 80,
    marginTop: 30,
    marginBottom: 15,
    marginRight: 10
  },
  sum: {
    fontSize: 20
  }
});
