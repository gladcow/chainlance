import { Dispatch, SetStateAction } from "react";

interface TimeFieldProps {
  handleTimeChange: any;
  setTimeMult: Dispatch<SetStateAction<string>>;
  timeMult: string;
  timeError: string;
}
export const TimeField = ({ handleTimeChange, setTimeMult, timeMult, timeError }: TimeFieldProps) => {
  return (
    <div>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="Time"
          className="input w-full border border-primary input input-success"
          onChange={handleTimeChange}
        />
        <select
          onChange={e => {
            setTimeMult(e.target.value);
          }}
          value={timeMult}
          defaultValue="hours"
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
}
export const PriceField = ({ handlePriceChange, priceError }: PriceFieldProps) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Price"
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
