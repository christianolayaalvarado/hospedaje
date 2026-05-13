type Props = {
  title: string;
  value: number | string;
};

export default function StatsCard({
  title,
  value,
}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
      "
    >

      <p
        className="
          text-sm
          text-gray-500
        "
      >
        {title}
      </p>

      <h3
        className="
          mt-2
          text-3xl
          font-bold
        "
      >
        {value}
      </h3>

    </div>

  );

}