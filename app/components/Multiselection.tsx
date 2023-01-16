import { useState, useMemo, useEffect } from "react"
import { useMultipleSelection, useCombobox } from "downshift"

export default function Multiselection({
  options,
  onChange,
  initialValue = [],
}: {
  options: string[]
  onChange: (selected: string[]) => void
  initialValue?: string[] | []
}) {
  const [inputValue, setInputValue] = useState("")

  const [selectedItems, setSelectedItems] = useState(initialValue)

  const items = useMemo(
    () =>
      options.filter((o) => {
        return (
          !selectedItems.includes(o) &&
          (o.toLowerCase().includes(inputValue.toLowerCase()) ||
            o.toLowerCase().includes(inputValue.toLowerCase()))
        )
      }),
    [selectedItems, inputValue, options]
  )

  useEffect(() => {
    setInputValue("")
    onChange(selectedItems)
  }, [selectedItems])

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
  } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems)
          break
        default:
          break
      }
    },
  })

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item : ""
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {
              isOpen: true,
              highlightedIndex: 0,
            }),
          }
        default:
          return changes
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          setSelectedItems([...selectedItems, newSelectedItem])
          break

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue)

          break
        default:
          break
      }
    },
  })

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-1'>
        <label className='text-slate-50' {...getLabelProps()}>
          Select a country
        </label>
        <div className='shadow-sm bg-white w-full px-2 rounded inline-flex gap-2 items-center flex-wrap'>
          {selectedItems.map(function renderSelectedItem(
            selectedItemForRender,
            index
          ) {
            return (
              <span
                className='bg-gray-100 p-2 rounded'
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {selectedItemForRender}
                <span
                  className='px-1 cursor-pointer'
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelectedItem(selectedItemForRender)
                  }}
                >
                  &#10005;
                </span>
              </span>
            )
          })}
          <div className='flex bg-white gap-0.5 grow'>
            <input
              placeholder='Add another country'
              className='w-full py-4 px-2 outline-0'
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
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
      </div>
      <div className='relative w-full'>
        <ul
          {...getMenuProps()}
          className='absolute p-0 bg-white shadow-md max-h-80 overflow-scroll w-full shadow divide-y divide-slate-300'
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
                className={`${
                  highlightedIndex === index ? "bg-slate-100" : ""
                } py-4 px-2 `}
              >
                <span>{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
