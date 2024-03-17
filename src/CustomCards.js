import React from "react";
import { Textfit } from "react-textfit";

import imageDefault from "./images/tonychris.jpg";

const CardBox = ({ children, style }) => {
  return (
    <div
      style={{
        color: "black",
        wordWrap: "break-word",
        borderRadius: "10px",
        padding: "5px",
        margin: "5px",
        ...style,
      }}
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
    image = imageDefault,
    style = { height: "500px", width: "250px", minHeight: "500px", minWidth: "250px" }, // default values for height and width
  } = props;

  return (
    <CardBox style={style}>
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
            style={{ maxWidth: "225px", maxHeight: "100px", overflow: "auto" }}
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

export { PersonalDeckCard };
