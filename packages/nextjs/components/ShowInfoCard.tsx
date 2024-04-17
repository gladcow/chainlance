export const ShowInfo = ({ info }: { info: Array<[any, number]> }) => {
  console.log(info);
  if (info) {
    info = info.map((item, index) => [item, index]);
  }
  return (
    <div className="self-start card w-5/6 bg-base-100 shadow-xl m-5">
      <div className="card-body items-center">
        {info.map(([item, index]) => (
          <p key={index} className="card-title break-all">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};
