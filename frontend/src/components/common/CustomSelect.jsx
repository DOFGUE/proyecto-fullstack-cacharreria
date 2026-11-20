import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"

export default function CustomSelect({ label, value, options, onChange, icon: Icon, className = "" }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const selected = options.find((option) => option.value === value) || options[0]

  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === value)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [options, value])

  useEffect(() => {
    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handlePointer)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handlePointer)
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

  const moveActive = (step) => {
    setOpen(true)
    setActiveIndex((current) => Math.min(Math.max(0, current + step), options.length - 1))
  }

  const handleTriggerKey = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      moveActive(open ? 1 : 0)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      moveActive(open ? -1 : 0)
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      if (open) {
        onChange(options[activeIndex].value)
        setOpen(false)
      } else {
        setOpen(true)
      }
    }
  }

  const choose = (option) => {
    onChange(option.value)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`custom-select ${open ? "open" : ""} ${className}`}>
      {Icon && <Icon className="custom-select-icon" size={17} />}
      {label && <span className="custom-select-label">{label}</span>}
      <button
        type="button"
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKey}
      >
        <span>{selected?.label || ""}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="custom-select-menu" role="listbox" aria-label={label || "Opciones"}>
          {options.map((option, index) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={index === activeIndex ? "active" : ""}
              key={option.value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(option)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
