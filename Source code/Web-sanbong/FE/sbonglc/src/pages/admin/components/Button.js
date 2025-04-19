"use client"
import "./Button.scss"

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const buttonClass = `admin-button ${variant} ${size} ${className} ${disabled ? "disabled" : ""}`

  return (
    <button type={type} className={buttonClass} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

