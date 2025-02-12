"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type DropdownProps = {
  items: {
    name: string;
    value: number;
  }[];
  fieldName: string;
  name: string;
  textColor: string;
  preselected?: number;
};

export default function Dropdown(props: DropdownProps) {
  const { items, fieldName, name, textColor, preselected } = props;
  const [selectedItem, setSelectedItem] = useState(
    (preselected as number) >= 0
      ? items.find((item) => item.value === (preselected as number))
      : items[0]
  );

  return (
    <>
      <Listbox value={selectedItem} onChange={setSelectedItem} name={name}>
        <div className="relative mt-1">
          <div className="flex flex-col justify-center align-start">
            <Listbox.Label
              className={`mb-2 text-sm font-semibold ${textColor}`}
            >
              {fieldName}
            </Listbox.Label>
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm overflow-ellipsis">
              <span className="block truncate">{selectedItem.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
              {items.map((item, itemIdx) => (
                <Listbox.Option
                  key={`${fieldName}-item-${itemIdx}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-advus-lightblue-500 text-white"
                        : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-advus-navyblue-500">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
}
