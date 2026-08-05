import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ParkingDetail() {
  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <h1 className="text-4xl font-bold my-4">Parking Detail</h1>
      <Card className=" w-1/2 h-1/2 rounded-2xl bg-amber-400">
        <CardHeader>
          <CardTitle>ID Parkiran: A-01</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <form> */}
          <div className="flex flex-col text-gray-950 mb-4 font-bold">
            <p>Name</p>
            <p className="border border-gray-950 rounded p-2">Lorem</p>
          </div>
          <div className="flex flex-col text-gray-950 mb-4 font-bold">
            <p>No. Kendaraan</p>
            <p className="border border-gray-950 rounded p-2">Lorem</p>
          </div>
          <div className="flex flex-col text-gray-950 mb-4 font-bold">
            <p>Durasi</p>
            <p className="border border-gray-950 rounded p-2">Lorem</p>
          </div>
          <div className="flex gap-1">
            <Link href={"/"}>
              <Button className="bg-mist-800 hover:bg-mist-600 px-4 py-1 rounded-lg">
                Go Back
              </Button>
            </Link>
          </div>
          {/* </form> */}
        </CardContent>
      </Card>
    </div>
  );
}
