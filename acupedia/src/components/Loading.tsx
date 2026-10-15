import { PulseLoader } from 'react-spinners';

function Loading() {
  return (
    <div className="w-full flex justify-center pt-[34px]">
      <PulseLoader size={5} />
    </div>
  );
}

export default Loading;
