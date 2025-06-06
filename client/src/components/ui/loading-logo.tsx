
import { CircuitryLogo } from "@/components/icons/CircuitryLogo";

export const LoadingLogo = () => {
  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="w-32 h-32 relative">
        <CircuitryLogo className="text-gray-200 absolute inset-0" />
        <div className="absolute inset-0 overflow-hidden">
          <CircuitryLogo className="text-orange-500">
            <animate
              attributeName="height"
              from="100%"
              to="0%"
              dur="2s"
              repeatCount="indefinite"
              values="100%;0%;100%"
              keyTimes="0;0.5;1"
            />
            <animate
              attributeName="y"
              from="0"
              to="100%"
              dur="2s"
              repeatCount="indefinite"
              values="0;100%;0"
              keyTimes="0;0.5;1"
            />
          </CircuitryLogo>
        </div>
      </div>
    </div>
  );
};
