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
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "../ui/datepicker";
import { Select, SelectValue, SelectContent, SelectTrigger, SelectGroup, SelectItem } from "../ui/select";

export default function CalendarAddEventDialog({
  users,
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
    control,
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
      const response = api.post('appointment', data)
      if(response.ok) {
        setOpen((openState) => !openState);
      }
      reset(register)
      
    } catch (error) {
      throw new Error("Appointment creation failed");
    }
  }
  
  return (
    <Dialog className="">
      <DialogTrigger asChild>
        {/* <Button>Tilføj Reservation</Button> */}
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tilføj Reservation</DialogTitle>
        </DialogHeader>
        <form  onSubmit={handleSubmit(OnSubmit)}  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4" >
          <div className="col-1 col-span-2 grid gap-1">
            <Label className="col-1" >Titel</Label>
            <Input className="col-1" {...register("name", { required: true })} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>
          <div className="col-1 col-span-2 grid gap-1">
            <Label >CPR</Label>
            <Input className="col-span-1" {...register("cpr", { required: true })} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>

          <div className="col-1 col-span-1 grid gap-1">
            <Label >Dato</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>

          <div className="col-1 col-span-1 grid gap-1">
            <Label >Start tid</Label>
            <input className="col-span-1" type='time' min="08:00" max="18:00" step="900" {...register("startTime", { required: true })} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>

          <div className="col-1 col-span-2 grid gap-1">
            <Label >Therapist</Label>
            <Controller
              name="user"
              control={control}
              render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vælg en therapeut"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users.map((user,index) => {
                    return <SelectItem key={`select-${index}`} value={user?._id}>{user?.firstName} {user?.lastName}</SelectItem>

                  })}
                  
                </SelectGroup>
              </SelectContent>
            </Select>
            )} />
            {errors.email && <span className="text-red-600">This field is required</span>}
          </div>

          <DialogFooter className="col-span-2">
            <Button type="submit">Opret reservation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
