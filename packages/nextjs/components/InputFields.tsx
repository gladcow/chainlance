import { Dispatch, SetStateAction } from "react";
import { timeRetrive } from "./utils";

interface TimeFieldProps {
  handleTimeChange: any;
  setTimeMult: Dispatch<SetStateAction<string>>;
  timeMult: string;
  timeError: string;
  value?: string;
}
export const TimeField = ({ handleTimeChange, setTimeMult, timeMult, timeError, value }: TimeFieldProps) => {
  let timePart;
  if (value) {
    const actualTimeAndMult = timeRetrive(Number(value));
    if (actualTimeAndMult) {
      const spaceIndex = actualTimeAndMult.indexOf(" ");
      timePart = actualTimeAndMult.slice(0, spaceIndex);
      setTimeMult(actualTimeAndMult?.slice(spaceIndex + 1, actualTimeAndMult.length));
    }
  }
  return (
    <div>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="Time"
          defaultValue={value ? timePart : ""}
          className="input w-full border border-primary input input-success"
          onChange={handleTimeChange}
        />
        <select
          onChange={e => {
            setTimeMult(e.target.value);
          }}
          value={timeMult}
          defaultValue={timeMult}
          className="select ml-2 border border-primary select-success"
        >
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>
      {timeError && <p className="relative text-red-500 text-sm">{timeError}</p>}
    </div>
  );
};

interface PriceFieldProps {
  handlePriceChange: any;
  priceError: string;
  value?: string;
}
export const PriceField = ({ handlePriceChange, priceError, value }: PriceFieldProps) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Price"
        defaultValue={value}
        className="input w-full border input input-success border-primary"
        onChange={handlePriceChange}
      />
      {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
    </div>
  );
};

interface DescriptionFieldProps {
  setDescription: Dispatch<SetStateAction<string>>;
}
export const DescriptionField = ({ setDescription }: DescriptionFieldProps) => {
  return (
    <textarea
      placeholder="Description"
      className="textarea w-full textarea-success border border-primary text-base"
      onChange={e => {
        setDescription(e.target.value);
      }}
    />
  );
};

interface TitleFieldProps {
  setTitle: Dispatch<SetStateAction<string>>;
}
export const TitleField = ({ setTitle }: TitleFieldProps) => {
  return (
    <input
      type="text"
      placeholder="Title"
      className="input w-full border input-success border-primary"
      onChange={e => {
        setTitle(e.target.value);
      }}
    />
  );
};
