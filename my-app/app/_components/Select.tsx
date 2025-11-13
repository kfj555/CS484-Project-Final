interface SelectProps<T> {
  label?: string;
  items: T[];
  onChange: (val: any) => void; // TODO: type safety here
}

// simple select component for now, generalizes object so that it can iterate through it like
// a list and ignore the key name...
// takes in a label, list of objects used to display each option, and an onChange function
// which will just be a useState and change the associated state to the selected value
export default function Select<T>({ label, items, onChange }: SelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <select
        className="border-1 w-65"
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((item, index) => {
          let val;
          if (typeof item == "string") {
            val = item;
          } else {
            val = Object.values(item)[0];
          }
          return (
            <option key={val ?? index} value={val}>
              {val}
            </option>
          );
        })}
      </select>
    </div>
  );
}
