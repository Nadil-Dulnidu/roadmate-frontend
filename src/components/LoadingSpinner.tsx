import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";

type LoadingSpinnerProps = {
  size?: number;
  stroke?: number;
  speed?: number;
  color?: string;
};

const LoadingSpinner = ({ size, stroke, speed, color }: LoadingSpinnerProps) => {
  return (
    <div className="text-center">
      <Waveform size={size} stroke={stroke} speed={speed} color={color} />
    </div>
  );
};

export default LoadingSpinner;
