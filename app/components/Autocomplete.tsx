import { useState } from "react"
import { useCombobox } from "downshift"

export default function Autocomplete({
  label,
  placeholder = "",
  options,
  onChange,
  initialValue = "",
}: {
  label: string
  placeholder?: string
  options: string[]
  onChange: (s: string) => void
  initialValue?: string
}) {
  const [items, setItems] = useState(options)
  const [selectedItem, setSelectedItem] = useState(initialValue)

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    id: "autocomplete",
    onInputValueChange({ inputValue }) {
      setItems(
        options.filter(
          (o) =>
            !inputValue || o.toLowerCase().includes(inputValue.toLowerCase())
        )
      )
    },
    items,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem)
      onChange(newSelectedItem)
    },
  })

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-1'>
        <label className='text-slate-50' {...getLabelProps()}>
          {label}
        </label>
        <div className='flex border border-slate-100 bg-white gap-0.5 shadow-sm rounded'>
          <input
            placeholder={placeholder}
            className='w-full py-4 px-2 outline-0'
            {...getInputProps()}
          />
          <button
            aria-label='toggle menu'
            className='px-4 py-2'
            type='button'
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>
      <div className='relative w-full'>
        <ul
          {...getMenuProps()}
          className='absolute p-0 bg-white shadow-md max-h-80 overflow-scroll overflow-x-hidden w-full shadow divide-y divide-slate-300'
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                key={`${item}${index}`}
                className={`${
                  highlightedIndex === index ? "bg-slate-100" : ""
                } py-4 px-2 `}
                {...getItemProps({ item, index })}
              >
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
