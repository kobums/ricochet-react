/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react"
import React from "react"

// 아이콘은 예시로 설정
import { FaSun, FaMoon, FaCheck } from "react-icons/fa"
import { MdComputer } from "react-icons/md"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { themeModeState } from "../recoil/atoms"

const buttonGroupStyle = (theme: any) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.mode.background};
  padding: 5px;
  border-radius: 40px;
  border: 1px solid ${theme.mode.borderColor};
  width: fit-content;
`

const buttonStyle = (isSelected: boolean, theme: any) => css`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  background-color: ${isSelected
    ? theme.mode.toggleButtonBgHover
    : "transparent"};
  color: ${isSelected
    ? theme.mode.buttonTextSelect
    : theme.mode.buttonTextUnselected};
  border-radius: 30px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: ${isSelected ? theme.mode.buttonTextSelect : theme.mode.text};
  }

  svg {
    font-size: 1.2rem;
  }
`

const ThemeToggleButton: React.FC = () => {
  const theme = useTheme()
  const setThemeModeState = useSetRecoilState(themeModeState)
  const themeModea = useRecoilValue(themeModeState)

  const handleButtonClick = (mode: "light" | "dark" | "auto") => {
    setThemeModeState(mode)
  }

  return (
    <div css={buttonGroupStyle}>
      <button
        css={buttonStyle(themeModea === "light", theme)}
        onClick={() => handleButtonClick("light")}
      >
        {themeModea === "light" ? <FaCheck /> : <FaSun />}
        밝게
      </button>
      <button
        css={buttonStyle(themeModea === "dark", theme)}
        onClick={() => handleButtonClick("dark")}
      >
        {themeModea === "dark" ? <FaCheck /> : <FaMoon />}
        어둡게
      </button>
      <button
        css={buttonStyle(themeModea === "auto", theme)}
        onClick={() => handleButtonClick("auto")}
      >
        {themeModea === "auto" ? <FaCheck /> : <MdComputer />}
        기기 설정
      </button>
    </div>
  )
}

export default ThemeToggleButton
