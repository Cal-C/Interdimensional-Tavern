import React from "react";
import { Textfit } from "react-textfit";

import imageDefault from "./images/tonychris.jpg";
import trashcanImage from "./images/trashcan.png";

import "./CustomCards.css";

const CardBox = ({ children, style, hoverColor, onClick }) => {
  return (
    <div
      className="cardBox"
      style={{
        ...style,
        "--hover-color": hoverColor,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const StatusCard = (props) => {
  const {
    image = imageDefault,
    stats = [{ Name: "Character Name", Cash: 69 }],
    health = 20,
    maxHealth = 20,
    drunkenness = 1,
    minDrunkenness = 0,
    liftColor = "#540a27",
    style = {
      height: "300px",
      width: "450px",
      minHeight: "300px",
      minWidth: "450px",
    },
    G,
    ctx,
    Colors,
  } = props;

  const onClick = () => {
    console.log(
      "StatusCard " +
        stats.Name +
        " clicked. With Colors " +
        JSON.stringify(Colors)
    );
  };

  let healthBarStatsLoaded = false;
  let totalHp = 20;
  let healthPercent = 100;
  let drunkennessPercent = 0;
  let bustedBy = 0;
  if (health && maxHealth && drunkenness !== null && minDrunkenness !== null) {
    totalHp = maxHealth - minDrunkenness;
    healthPercent = ((maxHealth - health) / totalHp) * 100;
    drunkennessPercent = (drunkenness / totalHp) * 100;
    if (drunkenness > health) {
      bustedBy = drunkenness - health;
    }
    healthBarStatsLoaded = true;
  }

  const statsBoarderString = "4px solid " + Colors[2];

  return (
    <CardBox
      style={{ ...style, position: "relative", backgroundColor: Colors[0] }}
      hoverColor={liftColor}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors[0],
        }}
      >
        <img
          src={image}
          alt="Character Image"
          style={{
            width: "100%",
            height: "100px",
            objectFit: "contain",
            margin: "auto",
            opacity: 0.8,
          }}
        />
      </div>
      {stats && (
        <div style={{ maxWidth: "95%", maxHeight: "124px", overflow: "auto" }}>
          <table>
            <tbody>
              <tr>
                {stats.map((stat, index) => (
                  <td
                    key={index}
                    style={{
                      borderLeft: statsBoarderString,
                      borderTop: statsBoarderString,
                      borderRight: statsBoarderString,
                      textAlign: "center",
                    }}
                  >
                    <Textfit
                      mode="single"
                      max={28}
                      style={{ width: "75px", height: "40px" }}
                    >
                      <strong
                        style={{
                          fontSize: "14px",
                          textAlign: "center",
                          color: Colors[2],
                        }}
                      >
                        {stat.name && stat.name}
                      </strong>
                    </Textfit>
                  </td>
                ))}
              </tr>
              <tr>
                {stats.map((stat, index) => (
                  <td
                    key={index}
                    style={{
                      fontSize: "14px",
                      borderLeft: statsBoarderString,
                      borderBottom: statsBoarderString,
                      borderRight: statsBoarderString,
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <Textfit
                      mode="single"
                      max={20}
                      style={{
                        width: "75px",
                        height: "40px",
                        color: Colors[2],
                      }}
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
      {healthBarStatsLoaded && (
        <div
          style={{
            border: "4px double " + Colors[2],
            margin: "5px",
            maxWidth: "95%",
            maxHeight: "30%",
            overflow: "auto",
            backgroundColor: Colors[3],
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              backgroundColor: Colors[3],
              maxWidth: "99.5%",
              maxHeight: "27%",
            }}
          >
            {bustedBy === 0 && (
              <div>
                <div
                  style={{
                    backgroundColor: Colors[1],
                    width: healthPercent + "%",
                    height: "50px",
                    float: "left",
                    marginTop: "3px",
                    marginBottom: "3px",
                    marginLeft: "3px",
                  }}
                >
                  <strong
                    style={{
                      whiteSpace: "nowrap",
                      position: "absolute", // Add this line
                      right: 90 - (healthPercent / 100) * 80 + "%",
                    }}
                  >
                    {health}
                  </strong>
                </div>
                <div
                  style={{
                    backgroundColor: Colors[2],
                    width: drunkennessPercent + "%",
                    height: "50px",
                    float: "right",
                    marginTop: "3px",
                    marginBottom: "2px",
                    marginRight: "0",
                  }}
                >
                  <strong
                    style={{
                      whiteSpace: "nowrap",
                      position: "absolute", // Add this line
                      right: (drunkennessPercent / 100) * 90 + 4 + "%",
                    }}
                  >
                    {drunkenness}
                  </strong>
                </div>
              </div>
            )}
            {bustedBy > 0 && (
              <div
                style={{ width: "95%", height: "95%", boxSizing: "border-box" }}
              >
                <Textfit
                  mode="single"
                  style={{
                    width: "95%",
                    height: "95%",
                    boxSizing: "border-box",
                  }}
                >
                  <h1
                    style={{
                      color: Colors[2],
                      textAlign: "center",
                      margin: "0px",
                      width: "95%",
                      height: "95%",
                      boxSizing: "border-box",
                    }}
                  >
                    Busted by {bustedBy}!
                  </h1>
                </Textfit>
              </div>
            )}
          </div>
        </div>
      )}
    </CardBox>
  );
};

export { StatusCard };

const PersonalDeckCard = (props) => {
  const {
    name,
    playerID,
    description,
    stats,
    index,
    image = imageDefault,
    style = {
      height: "500px",
      width: "250px",
      minHeight: "500px",
      minWidth: "250px",
    }, // default values for height and width
    trashing = false,
    inStack = false,
    liftColor = "InHand",
    Colors,
  } = props;

  const handleClick = () => {
    if (props.G.discarding[playerID]) {
      props.moves.toggleDiscarding(index, playerID);
      return;
    }
    if (inStack) {
      //allow the player to click the card to counter it with other cards
      return;
    } else {
      props.moves.playCard(index); // replace 'moveNameWhenNotDiscarding' with the name of your move
    }
  };
  let hoverColor = liftColor;
  if (liftColor === "InHand") {
    hoverColor = colorFromPlayable(props);
  }

  const statsBoarderString = "2px dotted " + Colors[2];

  return (
    <CardBox
      style={{ ...style, position: "relative" }}
      hoverColor={hoverColor}
      onClick={handleClick}
    >
      {trashing && (
        <img
          src={trashcanImage}
          alt="Trashcan"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            margin: "auto",
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
          backgroundColor: Colors[0],
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
            borderBottom: "5px solid "+ Colors[1],
            justifyContent: "center",
            color: Colors[2],
          }}
        >
          <h1>{name}</h1>
        </Textfit>
        {image && (
          <img
            src={image}
            alt="image"
            style={{
              border: "8px double "+ Colors[2],
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
              border: "8px solid "+ Colors[1],
              marginLeft: "10px",
              marginRight: "10px",
              margin: "5px",
              color: Colors[2],
              backgroundColor: Colors[3],
            }}
          >
            {description}
          </Textfit>
        )}
        {
          //this stats section should eventually be replaced with some kind of fancy bar that represents the data, but this should work for now
        }
        {stats && (
          <div
            style={{ maxWidth: "240px", maxHeight: "100px", overflow: "auto" }}
          >
            {
              <table style={{width: "240px"}}>
                <tbody>
                  <tr>
                    {stats.map((stat, index) => (
                      <td
                        key={index}
                        style={{
                          borderLeft: statsBoarderString,
                          borderTop: statsBoarderString,
                          borderRight: statsBoarderString,
                          textAlign: "center",
                          width: "40px",
                          height: "10px",
                          maxHeight: "20px",
                          maxWidth: "40px",
                        }}
                      >
                        <Textfit
                          mode="single"
                          max={14}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <strong
                            style={{ fontSize: "14px", textAlign: "center", color: Colors[2]}}
                          >
                            {stat.name && stat.name}
                          </strong>
                        </Textfit>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {stats.map((stat, index) => (
                      <td
                        key={index}
                        style={{
                          fontSize: "14px",
                          borderLeft: statsBoarderString,
                          borderBottom: statsBoarderString,
                          borderRight: statsBoarderString,
                          textAlign: "center",
                          width: "40px",
                          height: "20px",
                          maxWidth: "40px",
                        }}
                      >
                        <Textfit
                          mode="single"
                          max={14}
                          style={{ width: "95%", height: "100%", color: Colors[2]}}
                        >
                          {stat.value && stat.value}
                        </Textfit>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            }
          </div>
        )}
      </div>
    </CardBox>
  );
};

function colorFromPlayable(props) {
  const playableString = props.stats.find(
    (stat) => stat.name === "Playable"
  ).value;
  if (playableString.includes("✅")) {
    return "green";
  } else {
    return "red";
  }
}

export { PersonalDeckCard };
