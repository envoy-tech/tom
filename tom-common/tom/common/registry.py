from typing import Any, Iterable
from collections.abc import MutableMapping


class Registry(MutableMapping):

    def __init__(self, registry_type: Any, *, name = ""):
        super().__init__()
        self._registry: dict[str, Any] = {}
        self._name = name or f"{registry_type.__name__}Registry"
        self._registry_type = registry_type

    def keys(self) -> Iterable[str]:
        return self._registry.keys()

    def register(self, entry_name: str):
        def wrapper(entry_class):
            # Assign name to the entry class and add it to the registry.
            entry_class.REGISTRY_ENTRY_NAME = entry_name
            if entry_name in self and self[entry_name] != entry_class:
                raise ValueError(f"Registry naming conflict '{entry_name}'.")
            self[entry_name] = entry_class
            return entry_class

        return wrapper

    def __getitem__(self, key: str) -> Any:
        return self._registry[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self._registry[key] = value

    def __delitem__(self, key: str) -> None:
        del self._registry[key]

    def __iter__(self) -> Iterable:
        return iter(self._registry)

    def __len__(self) -> int:
        return len(self._registry)

    def __contains__(self, item) -> bool:
        return item in self._registry
