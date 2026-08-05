"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Booking {
  name: string;
  plate: string;
  duration: number;
  startTime: number;
}

function formatDuration(totalSeconds: number) {
  const sign = totalSeconds < 0 ? "-" : "";
  const abs = Math.abs(Math.floor(totalSeconds));
  const m = Math.floor(abs / 60).toString().padStart(2, "0");
  const s = (abs % 60).toString().padStart(2, "0");
  return `${sign}${m}:${s}`;
}

const currentDate = Date.now()
export default function ParkingDetail() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [now, setNow] = useState(currentDate);

  useEffect(() => {
    const raw = localStorage.getItem("parkingBookings");
    if (raw) {
      const all = JSON.parse(raw);
    // eslint-disable-next-line
      setBooking(all[slug] ?? null);
    }
  }, [slug]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEndSession = () => {
    const raw = localStorage.getItem("parkingBookings");
    const all = raw ? JSON.parse(raw) : {};
    delete all[slug];
    localStorage.setItem("parkingBookings", JSON.stringify(all));
    router.push("/");
  };

  const remainingSeconds = booking
    ? (booking.startTime + booking.duration * 60000 - now) / 1000
    : 0;
  const isOvertime = remainingSeconds < 0;

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <h1 className="text-4xl font-bold my-4">Parking Detail</h1>
      <Card className=" w-1/2 h-1/2 rounded-2xl bg-amber-400">
        <CardHeader>
          <CardTitle>ID Parkiran: {slug}</CardTitle>
        </CardHeader>
        <CardContent>
          {booking ? (
            <>
              <div className="flex flex-col text-gray-950 mb-4 font-bold">
                <p>Name</p>
                <p className="border border-gray-950 rounded p-2">{booking.name}</p>
              </div>
              <div className="flex flex-col text-gray-950 mb-4 font-bold">
                <p>No. Kendaraan</p>
                <p className="border border-gray-950 rounded p-2">{booking.plate}</p>
              </div>
              <div className="flex flex-col text-gray-950 mb-4 font-bold">
                <p>Durasi</p>
                <p className="border border-gray-950 rounded p-2">{booking.duration} menit</p>
              </div>
              <div className="flex flex-col text-gray-950 mb-4 font-bold">
                <p>{isOvertime ? "Overtime" : "Sisa Waktu"}</p>
                <p className="border border-gray-950 rounded p-2">
                  {formatDuration(remainingSeconds)}
                </p>
              </div>
              {isOvertime && (
                <p className="text-red-600 font-bold mb-4">
                  Waktu parkir telah melebihi batas!
                </p>
              )}
            </>
          ) : (
            <p className="mb-4 font-bold text-gray-950">Data tidak ditemukan</p>
          )}
          <div className="flex gap-1">
            <Link href={"/"}>
              <Button className="bg-mist-800 hover:bg-mist-600 px-4 py-1 rounded-lg">
                Go Back
              </Button>
            </Link>
            {booking && (
              <Button
                type="button"
                className="px-4 py-1 rounded-lg"
                onClick={handleEndSession}
              >
                End Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
