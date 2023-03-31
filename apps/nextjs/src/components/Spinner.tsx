import Image from "next/image";

type Props = {
  width?: number;
  height?: number;
};

const Spinner = ({ width = 30, height = 30 }: Props) => (
  <div className="mt-2 flex flex-col justify-center">
    <Image
      className="animate-spin-slow"
      alt="image of a football"
      src="/ball.svg"
      height={width}
      width={height}
    />
  </div>
);

export default Spinner;
