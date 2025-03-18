import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function JournalEntry({Submitfunction = () => {}}) {
  const { register, handleSubmit, formState: { errors }} = useForm();

  return (
    <div>
      <form
        onSubmit={handleSubmit(Submitfunction)}
        className="flex flex-col gap-3"
      >
        <div>
          <label>diagnosis</label>
          <Input {...register("diagnosis", { required: true })} />
          {errors.email && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="grid">
          <label>notes</label>
          <textarea />
        </div>

        <div className="">
          <label>treatment</label>
          <Input {...register("treatment", { required: true })} />
          {errors.email && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="">
          <label>treatmentPlan</label>
          <Input {...register("treatmentPlan", { required: true })} />
          {errors.email && (
            <span className="text-red-600">This field is required</span>
          )}
        </div>

        <div className="">
          <label>exerciseRecommendations</label>
        </div>

        <Button className="mt-4" type="submit">
          Opret journal note
        </Button>
      </form>
    </div>
  );
}
