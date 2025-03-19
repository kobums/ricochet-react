/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react"
import React from "react"
import { FaChevronRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const overlayStyle = (isMenuOpen: boolean, theme: any) => css`
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${theme.mode.background};
  transform: ${isMenuOpen ? "translateY(0)" : "translateY(-100vh)"};
  transition: transform 0.8s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1000;
  gap: 20px;

  @media (min-width: 769px) {
    display: none; /* 데스크탑에서는 오버레이 숨김 */
  }
`

const menuItemStyle = (theme: any) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  color: ${theme.mode.buttonText};
  width: 100vw;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 20px;
  &:hover {
    opacity: 0.8;
  }
`

const arrowIconStyle = css`
  opacity: 0;
  transition: opacity 0.3s ease;
  svg {
    font-size: 1.5rem;
  }
  &:hover {
    opacity: 1;
  }
`

interface MobileOverlayNavProps {
  isMenuOpen: boolean
}

const MobileOverlayNav: React.FC<MobileOverlayNavProps> = ({ isMenuOpen }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div css={overlayStyle(isMenuOpen, theme)}>
      <div css={menuItemStyle} onClick={() => handleNavigation("/item1")}>
        item1
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <div css={menuItemStyle} onClick={() => handleNavigation("/item2")}>
        item2
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <div css={menuItemStyle} onClick={() => handleNavigation("/item3")}>
        item3
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
      <div css={menuItemStyle} onClick={() => handleNavigation("/item4")}>
        item4
        <span css={arrowIconStyle}>
          <FaChevronRight />
        </span>
      </div>
    </div>
  )
}

export default MobileOverlayNav
