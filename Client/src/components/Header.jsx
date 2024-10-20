import React from 'react';
import styled from 'styled-components';
const Buttons = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;

  width: 200px; /* Set the desired width of the button */
  height: 50px;  /* Set the height of the button */
  top: 20px;     /* Offset to position it in the header */
  left: 20px;    /* Position it at the top-left corner */

  background: linear-gradient(90deg, rgba(0, 35, 77, 0.8) 11.46%, rgba(0, 35, 77, 0) 77.37%), 
              #FFFFFF; /* Background gradient and color */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  border-radius: 12px; /* Rounded corners */
  cursor: pointer;     /* Pointer cursor on hover */
}
`;
const Buttons_Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;

`;
const Buttons_Icon_Image = styled.div`
  width: 100%;
  height: auto;
`;

const Buttons_Text = styled.div`
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  color: #00234D; /* Text color */
  font-weight: bold;
`;
const Header = () => {
  return (
    <div>      
        <Buttons>
            <Buttons_Icon>
            </Buttons_Icon>
            <Buttons_Icon_Image>
            </Buttons_Icon_Image>
            <Buttons_Text>
            </Buttons_Text>
        </Buttons>
    </div>
  )
}


export default Header
