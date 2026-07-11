import { useMemo, useState } from "react";
import { Search, Check } from "lucide-react";

interface SearchSelectProps<T> {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;

  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string;
}

export default function SearchSelect<T>({
  items,
  value,
  onChange,
  getLabel,
  getSubLabel,
}: SearchSelectProps<T>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) =>
      getLabel(item)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search, getLabel]);

  return (
    <div className="relative">

      <div
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-700 bg-gray-800 p-3"
      >
        <span className="text-gray-200">
          {value ? getLabel(value) : "Select..."}
        </span>

        <Search size={18} />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">

          <input
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-gray-700 bg-gray-800 p-3 outline-none"
          />

          <div className="max-h-72 overflow-y-auto">

            {filtered.map((item, index) => (

              <div
                key={index}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex cursor-pointer items-center justify-between border-b border-gray-800 p-3 hover:bg-blue-600/20"
              >
                <div>

                  <div className="font-semibold">
                    {getLabel(item)}
                  </div>

                  {getSubLabel && (
                    <div className="text-sm text-gray-400">
                      {getSubLabel(item)}
                    </div>
                  )}

                </div>

                {value === item && (
                  <Check
                    size={18}
                    className="text-green-400"
                  />
                )}

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}