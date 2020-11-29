import React from "react";
import styled from "styled-components";
import devices from "../devices";

const LogoText = styled.p`
  position: absolute;
  font-family: 'Cairo', serif;
  display: none;
  font-weight: bold;
  color: black;
  letter-spacing: -0.01em;
  -webkit-text-fill-color: white; /* Will override color (regardless of order) */
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  -webkit-user-select: none; /* Safari */        
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
  @media ${devices.mobileL} {
    display: block;
    font-size: 16px;
  }
  @media ${devices.tablet} {
    font-size: 24px;
  }
  @media ${devices.laptop} {
    font-size: 28px;
  }
  @media ${devices.desktop} {
    font-size: 32px;
  }
`
const Logo = () => {
  return (
    <LogoText unselectable="on" className='logo'><strong>WEATHER</strong><i>TRACKER</i></LogoText>
  )
}

export default Logo;