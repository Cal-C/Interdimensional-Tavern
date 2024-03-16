import React from 'react';
import { Textfit } from 'react-textfit';

import imageDefault from './images/tonychris.jpg';




const CardBox = ({ children, style }) => {
    return (
      <div style={{ color: 'black', wordWrap: 'break-word', borderRadius: "10px", ...style }}>
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
      style = { height: '400px', width: '250px' } // default values for height and width
    } = props;
  
    return (
        <CardBox style={style}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Textfit mode= "single" max={10}  style= {{width : "225px", maxHeight:"35px", textAlign: "center"}}><h1>{name}</h1></Textfit>
            {image && <img src={image} alt="image" style={{ maxWidth: '100%', height: "250px" }} />}
            {description && <Textfit mode="multi" style={{ flex: 1, height:'200px', width:'225px' }}>{description}</Textfit>}
            {stats && 
              <Textfit mode="multi" style={{ width: '250px', height: '100px', overflow: 'auto' }}>
                {stats.map((stat, index) => (
                  <div key={index}>
                    <strong>{stat.name && stat.name}</strong>: {stat.value && stat.value}
                  </div>
                ))}
              </Textfit>
            }
          </div>
        </CardBox>
      );
  }

  export {PersonalDeckCard};