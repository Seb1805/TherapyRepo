import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function JournalEntry({patientId}) {
  const { register, handleSubmit, formState: { errors }} = useForm();

  const onSubmit = async (data) =>  {
    data = {
      ...data,
      therapistId: 'temp',
      patient: patientId,
      date: new Date().toISOString(),
      type: "initial",
      exerciseRecommendations: ["exercise1", "exercise2"]
    };

    try {

      // const response = await api.post('journal_entry', data)

      const response = await fetch(`/api/journal_entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem(`access_token`)}`
        },
        body: JSON.stringify(data),
      });
      

      if (!response.ok) {
        throw new Error(`response code: ${response.status}, error: ${response.statusText}`);
      }
      if (response.ok) {
        setAddJournalButton((value) => !value)
      }

      
    } catch (error) {
      console.log(`Error with submit: ${error}`);
    }
  }


  return (
    <Card className="bg-(--color-card-foreground)/3">
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div>
            <label>diagnosis</label>
            <Input {...register("diagnosis", { required: true })} />
            {errors.diagnosis && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
          <div className="grid">
            <label>notes</label>
            <Input {...register("notes", { required: true })}/>
            {errors.notes && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
          <div className="">
            <label>treatment</label>
            <Input {...register("treatment", { required: true })} />
            {errors.treatment && (
              <span className="text-red-600">This field is required</span>
            )}
          </div>
          <div className="">
            <label>treatmentPlan</label>
            <Input {...register("treatmentPlan", { required: true })} />
            {errors.treatmentPlan && (
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
      </CardContent>
    </Card>
  );
}
