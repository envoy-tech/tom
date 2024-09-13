"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import usePlacesAutocomplete, {
  RequestOptions,
  Suggestions,
} from "use-places-autocomplete";
import { useEffect } from "react";

type GooglePlacesSearchFieldProps = {
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestions | undefined>>;
  options?: RequestOptions;
};

export default function GooglePlacesSearchField({
  setSuggestions,
  options = {},
}: GooglePlacesSearchFieldProps) {
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  const { suggestions, ready, setValue, clearSuggestions } =
    usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => 38, lng: () => 97 },
        radius: 100 * 1000,
        ...options,
      },
    });

  const handleOnKeyDown = (e) => {
    clearSuggestions();
    setValue(e.target.value);
  };

  useEffect(() => {
    setSuggestions(suggestions);
  }, [suggestions]);

  return (
    <div className="relative mt-2 rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="location"
        name="location"
        id="location"
        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-navyblue-500 sm:text-sm sm:leading-6"
        placeholder="Search for a location..."
        disabled={!ready}
        onKeyDown={handleOnKeyDown}
      />
    </div>
  );
}
