import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CalendarAddEventDialog({
  selectedDate,
  newReservation = false,
  reservationData,
  setReservationData,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const api = useApi()

  function ConfirmationClosure(e) {
    if (open) {
      if (confirm("are you sure?") === true) {
        setOpen((openState) => !openState);
      }
    } else {
      setOpen((openState) => !openState);
    }
  }

  async function OnSubmit(data) {
    try {
      const response = await fetch("http://localhost:8000/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(register),
      });

      if(response.ok) {
        setOpen((openState) => !openState);
      }
      reset(register)
      
    } catch (error) {
      throw new Error("Appointment creation failed");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button>Tilføj Reservation</Button> */}
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tilføj Reservation</DialogTitle>
        </DialogHeader>
        <form  onSubmit={handleSubmit(OnSubmit)}  className="grid grid-cols-2 gap-4 py-4" >
          <div className="col-span-2 grid gap-1">
            <Label className="col-1" >Name</Label>
            <Input className="col-1" {...register("name", { required: true })} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>
          <div className="col-span-2 grid gap-1">
            <Label >CPR</Label>
            <Input className="col-span-1" {...register("cpr", { required: true })} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>
          <div className="col-span-1 grid gap-1">
            <Label >Start tid</Label>
            <Input className="col-span-1" {...register("cpr", { required: true })} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>
          <DialogFooter className="col-span-2">
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
