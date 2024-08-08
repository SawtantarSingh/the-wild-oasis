import { Controller, useForm } from "react-hook-form";
import { add, format } from "date-fns";

import FormRow from "../cabins/FormRow";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import Checkbox from "../../ui/Checkbox";

import {
  formatCurrency,
  sortAlphabeticaly,
  subtractDates,
} from "../../utils/helpers";

import { useGuests } from "./useGuests";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import { useCreateBooking } from "./useCreateBooking";

function CreateBookingForm() {
  const { createBooking, isCreating } = useCreateBooking();
  const {
    register,
    handleSubmit,
    reset,
    formState,
    control,
    getValues,
    setValue,
    watch,
  } = useForm();

  const { errors } = formState;

  const { guests, isLoading: guestsLoading } = useGuests();

  const { cabins, isLoading: cabinLoading } = useCabins();

  const { settings, isLoading: settingsLoading } = useSettings();

  if (guestsLoading || cabinLoading || settingsLoading) return <Spinner />;

  const hasBreakfast = watch("hasBreakfast");
  const isPaid = watch("isPaid");
  const startDateInput = watch("startDate");
  const endDateInput = watch("endDate");
  const numberOfGuests = watch("numGuests");
  const cabinId = Number(watch("cabinId"));

  const calcNumNights =
    startDateInput < endDateInput
      ? subtractDates(endDateInput, startDateInput)
      : 0;

  const { breakfastPrice } = settings;

  const currentCabin = cabins.find((cabin) => cabin.id === cabinId);

  const guestsOptions = [
    { value: "", label: "Select a Guest" },
    ...guests
      .sort((a, b) => sortAlphabeticaly(a.fullName, b.fullName))
      .map((guest) => {
        return { value: guest.id, label: guest.fullName };
      }),
  ];

  const cabinOptions = [
    { value: "", label: "Select a Cabin" },
    ...cabins.map((cabin) => {
      return {
        value: cabin.id,
        label: cabin.name,
      };
    }),
  ];

  const numOfGuestsOptions = [
    { value: "", label: "Select Number Of Guests" },
    ...Array.from({ length: currentCabin?.maxCapacity }, (_, i) => {
      return {
        value: i + 1,
        label: `${i + 1} ${i > 0 ? "Guests" : " Guest"}`,
      };
    }),
  ];

  const totalPrice =
    hasBreakfast === true
      ? `${formatCurrency(currentCabin?.regularPrice + breakfastPrice)}`
      : `${formatCurrency(currentCabin?.regularPrice)}`;

  function onSubmit(data) {
    const cabinPrice =
      (currentCabin.regularPrice - currentCabin.discount) * calcNumNights;

    const extraPrice =
      calcNumNights * settings.breakfastPrice * Number(numberOfGuests);

    const totalPrice = cabinPrice + extraPrice;

    const finalData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      numNights: calcNumNights,
      numGuests: Number(data.numGuests),
      cabinId: Number(data.cabinId),
      guestId: Number(data.guestId),
      observations: data.observations,
      hasBreakfast,
      isPaid,
      cabinPrice,
      extrasPrice: extraPrice,
      totalPrice,
      status: "unconfirmed",
    };

    console.log(finalData);
    createBooking(finalData);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Guest Name" error={errors?.guestId?.message}>
        <Controller
          name="guestId"
          control={control}
          render={({ field }) => <Select {...field} options={guestsOptions} />}
        />
      </FormRow>

      <FormRow label="Cabin Name" error={errors?.cabinId?.message}>
        <Controller
          name="cabinId"
          control={control}
          render={({ field }) => <Select {...field} options={cabinOptions} />}
        />
      </FormRow>
      <FormRow label="Number Of Guests" error={errors?.name?.message}>
        <Controller
          name="numGuests"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={numOfGuestsOptions}
              disabled={currentCabin === undefined}
            />
          )}
        />
      </FormRow>

      <FormRow label="Price">
        <Input
          defaultValue={
            currentCabin === undefined
              ? ""
              : formatCurrency(currentCabin?.regularPrice)
          }
          disabled
        />
      </FormRow>

      <FormRow label="Discount">
        <Input
          disabled
          value={
            currentCabin === undefined
              ? ""
              : formatCurrency(currentCabin?.discount)
          }
        />
      </FormRow>

      <FormRow label="Booking Dates">
        <Input
          {...register("startDate")}
          name="startDate"
          type="date"
          defaultValue={format(new Date(), "yyyy-MM-dd")}
        />
        <Input
          {...register("endDate")}
          name="endDate"
          type="date"
          defaultValue={format(add(new Date(), { days: 1 }), "yyyy-MM-dd")}
        />
      </FormRow>

      <FormRow label="Observation">
        <Textarea name="observations" {...register("observations")}></Textarea>
      </FormRow>

      <FormRow label="Extra Price">
        <Input
          disabled
          value={
            hasBreakfast === true
              ? `${formatCurrency(breakfastPrice)}`
              : `$0.00`
          }
        />
      </FormRow>

      <FormRow label="Total Price">
        <Input disabled value={currentCabin ? totalPrice : "$0.00"} />
      </FormRow>

      <FormRow>
        <Controller
          control={control}
          name="hasBreakfast"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              id="hasBreakfast"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
            >
              Includes breakfast?
            </Checkbox>
          )}
        />
      </FormRow>

      <FormRow>
        <Controller
          name="isPaid"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
            >
              Is Paid?
            </Checkbox>
          )}
        />
      </FormRow>
      <FormRow>
        <Button>Submit</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
