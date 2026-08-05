"use client";
import { useState, useEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
// import Konva from "konva";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ColoredRect = ({
  id,
  area,
  toggleModal,
}: {
  id: number;
  area: string;
  toggleModal: (arg0: boolean) => void;
}) => {
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setStageWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [color, setColor] = useState("green");

  const handleClick = () => {
    // setColor(Konva.Util.getRandomColor());
    toggleModal(true);
  };

  let thisHeight = 20;
  if (area === "A") {
    thisHeight = 20;
  } else if (area === "B") {
    thisHeight = 600;
  }

  let thisWidth = stageWidth;
  if (stageWidth < 400) {
    thisWidth = 2 * stageWidth;
  }

  return (
    <Rect
      x={(thisWidth / 6) * id}
      y={thisHeight}
      width={thisWidth / 6}
      height={300}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
    />
  );
};

export default function App() {
  const [mounted, setMounted] = useState<boolean>();
  const [isModalOpened, setModal] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <div className="flex justify-center items-center absolute inset-0">
        <h1 className="text-5xl font-bold">Parking Management System</h1>
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {Array.from({ length: 6 }).map((_, index) => (
            <ColoredRect
              key={index}
              id={index}
              area="A"
              toggleModal={setModal}
            />
          ))}
          {Array.from({ length: 6 }).map((_, index) => (
            <ColoredRect
              key={index}
              id={index}
              area="B"
              toggleModal={setModal}
            />
          ))}
        </Layer>
      </Stage>
      {isModalOpened && (
        <div className="w-full bg-mist-700/50 h-full flex absolute inset-0 justify-center items-center">
          <Card className=" w-1/2 h-1/2 rounded-2xl">
            <CardHeader>
              <CardTitle>Pilih Parkiran Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col text-gray-950 mb-4 font-bold">
                  <label htmlFor="name">Name</label>
                  <Input className="border rounded" type="text" name="name" />
                </div>
                <div className="flex flex-col text-gray-950 mb-4 font-bold">
                  <label htmlFor="plate">No. Kendaraan</label>
                  <Input className="border rounded" type="text" name="plate" />
                </div>
                <div className="flex flex-col text-gray-950 mb-4 font-bold">
                  <label htmlFor="duration">Durasi</label>
                  <Input
                    className="border rounded"
                    type="number"
                    name="duration"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    className="bg-mist-800 hover:bg-mist-600 px-4 py-1 rounded-lg"
                    onClick={() => setModal(false)}
                  >
                    Close
                  </Button>
                  <Button className="px-4 py-1 rounded-lg">Input</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
