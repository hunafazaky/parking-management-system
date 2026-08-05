"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stage, Layer, Rect } from "react-konva";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SelectedSlot = { area: string; id: number };

const slotIdFor = (area: string, id: number) => `${area}-${id + 1}`;

const ColoredRect = ({
  id,
  area,
  booked,
  toggleModal,
}: {
  id: number;
  area: string;
  booked: boolean;
  toggleModal: (slot: SelectedSlot) => void;
}) => {
  const router = useRouter();
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setStageWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    if (booked) {
      router.push(`/parking-detail/${slotIdFor(area, id)}`);
    } else {
      toggleModal({ area, id });
    }
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
      fill={booked ? "yellow" : "green"}
      shadowBlur={5}
      onClick={handleClick}
    />
  );
};

export default function App() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>();
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [bookings, setBookings] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    const raw = localStorage.getItem("parkingBookings");
    if (raw) setBookings(JSON.parse(raw));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const plate = formData.get("plate") as string;
    const duration = Number(formData.get("duration"));
    const slotId = slotIdFor(selectedSlot.area, selectedSlot.id);

    const newBookings = {
      ...bookings,
      [slotId]: { name, plate, duration, startTime: Date.now() },
    };
    localStorage.setItem("parkingBookings", JSON.stringify(newBookings));
    setBookings(newBookings);
    setSelectedSlot(null);
    router.push(`/parking-detail/${slotId}`);
  };

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
              booked={Boolean(bookings[slotIdFor("A", index)])}
              toggleModal={setSelectedSlot}
            />
          ))}
          {Array.from({ length: 6 }).map((_, index) => (
            <ColoredRect
              key={index}
              id={index}
              area="B"
              booked={Boolean(bookings[slotIdFor("B", index)])}
              toggleModal={setSelectedSlot}
            />
          ))}
        </Layer>
      </Stage>
      {selectedSlot && (
        <div className="w-full bg-mist-700/50 h-full flex absolute inset-0 justify-center items-center">
          <Card className=" w-1/2 h-1/2 rounded-2xl">
            <CardHeader>
              <CardTitle>
                Pilih Parkiran Ini: {slotIdFor(selectedSlot.area, selectedSlot.id)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col text-gray-950 mb-4 font-bold">
                  <label htmlFor="name">Name</label>
                  <Input className="border rounded" type="text" name="name" required />
                </div>
                <div className="flex flex-col text-gray-950 mb-4 font-bold">
                  <label htmlFor="plate">No. Kendaraan</label>
                  <Input className="border rounded" type="text" name="plate" required />
                </div>
                <div className="flex flex-col text-gray-950 mb-4 font-bold">
                  <label htmlFor="duration">Durasi</label>
                  <Input
                    className="border rounded"
                    type="number"
                    name="duration"
                    required
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    className="bg-mist-800 hover:bg-mist-600 px-4 py-1 rounded-lg"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Close
                  </Button>
                  <Button type="submit" className="px-4 py-1 rounded-lg">
                    Input
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
