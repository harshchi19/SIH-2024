import {
  CameraControls,
  Environment,
  Gltf,
  Html,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Doctor from "./Doctor";
import { degToRad } from "three/src/math/MathUtils";
import { Suspense } from "react";
import { TypingBox } from "./TypingBox";

const CameraManager = () => {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={2}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
      mouseButtons={{
        left: 1,
        wheel: 16,
      }}
      touches={{
        one: 32,
        two: 512,
      }}
      minAzimuthAngle={degToRad(-10)}
      maxAzimuthAngle={degToRad(10)}
      minPolarAngle={degToRad(90)}
      maxPolarAngle={degToRad(100)}
    />
  );
};

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-4">
        <p className="text-xl font-semibold">Loading...</p>
        <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

const Experience = () => {
  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="z-10 md:justify-center absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingBox />
      </div>
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 50,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={0.5} />
        <Suspense fallback={<Loader />}>
          <Gltf
            src="/models/doctors_office.glb"
            position={[0, -0.6, 1]}
            rotation-y={1}
            scale={2}
          />
          <Doctor
            position={[-0, 0.89, 0.5]}
            scale={0.5}
            rotation-x={degToRad(5)}
            rotation-z={degToRad(-1)}
          />
        </Suspense>
        <CameraManager />
      </Canvas>
    </div>
  );
};

export default Experience;
