import React from "react";
import { Textfit } from "react-textfit";

import imageDefault from "./images/tonychris.jpg";
import trashcanImage from "./images/trashcan.png";

import './CustomCards.css';

const CardBox = ({ children, style, hoverColor, onClick }) => {
  return (
    <div className="cardBox" style={{
      ...style,
      '--hover-color': hoverColor,
    }}
    onClick={onClick}
    >
      {children}
    </div>
  );
};

const PersonalDeckCard = (props) => {
  const {
    name,
    playerID,
    description,
    stats,
    index,
    image = imageDefault,
    style = { height: "500px", width: "250px", minHeight: "500px", minWidth: "250px" }, // default values for height and width
    trashing = false,
    inStack = false,
  } = props;

  const handleClick = () => {
    if (props.G.discarding[playerID]) {
      props.moves.toggleDiscarding(index, playerID); 
      return;
    } 
    if(inStack) {
      //allow the player to click the card to counter it with other cards
      return;
    } else {
      props.moves.playCard(index); // replace 'moveNameWhenNotDiscarding' with the name of your move
    }
};

  const hoverColor = colorFromPlayable(props);
  return (
    <CardBox style={{...style, position: "relative"}} hoverColor={hoverColor}  onClick={handleClick}>
        {trashing && (
  <img 
    src={trashcanImage} 
    alt="Trashcan" 
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      margin: 'auto',
      opacity: 0.8,
    }}
  />
)}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:"#a06b2d",
        }}
      >
        <Textfit
          mode="single"
          max={10}
          style={{
            alignItems: "center",
            display: "flex",
            width: "225px",
            maxHeight: "35px",
            textAlign: "center",
            borderBottom: "5px solid purple",
            justifyContent: "center",
          }}
        >
          <h1>{name}</h1>
        </Textfit>
        {image && (
          <img
            src={image}
            alt="image"
            style={{
              border: "8px double black",
              maxWidth: "80%",
              height: "200px",
              marginTop: "5px",
            }}
          />
        )}
        {description && (
          <Textfit
            mode="multi"
            max={25}
            style={{
              flex: 1,
              minHeight: "150px",
              height: "150px",
              maxHeight: "150px",
              width: "240px",
              border: "8px double black",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            {description}
          </Textfit>
        )}
        {//this stats section should eventually be replaced with some kind of fancy bar that represents the data, but this should work for now
        }
        {stats && (

          <div
            style={{ maxWidth: "250px", maxHeight: "100px", overflow: "auto" }}
          >
            <table >
              <tbody>
                <tr>
                  {stats.map((stat, index) => (
                    <td key={index} style = {{borderLeft: "2px dotted black",  borderTop: "2px dotted black",borderRight: "2px dotted black", textAlign:'center'}}>
                      <Textfit
                      mode = "single"
                      max = {14}
                      style = {{ width: "75px", height: "20px",}}
                      >
                        <strong style={{fontSize:"14px", textAlign:'center' }}>{stat.name && stat.name}</strong>
                      </Textfit>
                      
                    </td>
                  ))}
                </tr>
                <tr>
                  {stats.map((stat, index) => (
                    <td key={index} style={{fontSize:"14px", borderLeft: "2px dotted black",  borderBottom: "2px dotted black",borderRight: "2px dotted black" , textAlign:'center'}}>
                      <Textfit
                      mode = "single"
                      max = {14}
                      style = {{ width: "75px", height: "20px",}}
                      >
                        {stat.value && stat.value}
                      </Textfit>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CardBox>
  );
};

function colorFromPlayable(props) {
  const playableString = props.stats.find(stat => stat.name === "Playable").value;
  if (playableString.includes("✅")) {
    return "green";
  } else {
    return "red";
  }
}

export { PersonalDeckCard };
